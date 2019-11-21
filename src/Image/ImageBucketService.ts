import { ImageType } from "./EventImage.entity"
import { Bucket, File, Storage } from "@google-cloud/storage"
const randomstring = require("random-string")
import fs from "fs"
import ReadableStream = NodeJS.ReadableStream
import { FileUpload } from "graphql-upload"
import { Metadata } from "@google-cloud/common"

export interface ImageBucketServiceOptions {
  gcsBucketName: string
  buckerPublicURLBase: string
  tmpLocalPath: string
}

interface UploadImageOptions {
  imageType: ImageType
  eventId: string
  fileMeta: FileMeta
}

interface FileMeta {
  filename: string
  mimetype: string
  encoding: string
}

// General pattern for filename:
// /e/[event_id]/[image_type]_dddd
// dddd is a running number from 0001 to 9999 describing
// the order of upload

export default class ImageBucketService {
  options: ImageBucketServiceOptions
  gcsBucket: Bucket

  constructor(options: ImageBucketServiceOptions) {
    this.options = options
    this.gcsBucket = new Storage().bucket(this.options.gcsBucketName)

    // quick fail in case of bad credentials
    this.gcsBucket.getFiles()
  }

  saveLocally(stream: ReadableStream, fileMeta: FileMeta): string {
    const splitFileName = fileMeta.filename.split(".")
    splitFileName.reverse()
    splitFileName.splice(1, 0, randomstring(6))
    splitFileName.reverse()
    const targetFileName = splitFileName.join(".")
    const targetFullPath = `${this.options.tmpLocalPath}/${targetFileName}`

    fs.writeFileSync(targetFullPath, stream, {
      encoding: fileMeta.encoding,
    })

    return targetFullPath
  }

  async deleteLocally(path: string) {
    fs.unlinkSync(path)
  }

  async uploadToBucket(file: FileUpload, options: UploadImageOptions) {
    const localTempPath = this.saveLocally(file.createReadStream(), {
      encoding: file.encoding,
      filename: file.filename,
      mimetype: file.mimetype,
    })

    const prefix = `e/${options.eventId}/${options.imageType}_`
    const [existingFiles] = await this.gcsBucket.getFiles({
      prefix,
    })
    const highest: number = existingFiles
      .map(file => parseInt(file.name.split(prefix)[1]))
      .sort()
      .reverse()[0]
    const next = `${highest}`.padStart(4, "0")
    const bucketDestination = `${prefix}${next}`

    const [bucketFile, _]: [
      File,
      Metadata
    ] = await this.gcsBucket.upload(localTempPath, {
      destination: bucketDestination,
    })

    this.deleteLocally(localTempPath) // don't care about result
    return `${this.options.buckerPublicURLBase}/${bucketFile.name}`
  }
}
