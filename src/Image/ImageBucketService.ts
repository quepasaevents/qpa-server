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
    this.gcsBucket.getFiles().catch(err => {
      console.error("Error accessing bucket", err)
    })
  }

  addRandomHashToFilename = (filename: string) => {
    const splitFileName = filename.split(".")
    const randomSequence = randomstring({ length: 6 })
    splitFileName.reverse()
    splitFileName.splice(1, 0, randomSequence)
    splitFileName.reverse()
    const targetFileName = splitFileName.join(".")
    return targetFileName
  }

  async saveLocally(
    readableStream: ReadableStream,
    fileMeta: FileMeta
  ): Promise<string> {
    const targetFileName = this.addRandomHashToFilename(fileMeta.filename)
    const targetFullPath = `${this.options.tmpLocalPath}/${targetFileName}`
    console.log('::STREAM::',typeof readableStream, JSON.stringify(readableStream))

    const writeStream =  fs.createWriteStream(targetFullPath)
    return new Promise((resolve, reject) => {
      readableStream.pipe(writeStream)
      readableStream.on('end', () => {
        resolve(targetFullPath)
      })
      readableStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  async deleteLocally(path: string) {
    fs.unlinkSync(path)
  }

  async uploadToBucket(file: FileUpload, options: UploadImageOptions) {
    const localTempPath = await this.saveLocally(file.createReadStream(), {
      filename: file.filename,
      mimetype: file.mimetype,
    })
    console.log("local save call terminated", localTempPath)

    const prefix = `e/${options.eventId}/${options.imageType}_`
    const [existingFiles] = await this.gcsBucket.getFiles({
      prefix,
    })
    console.log("existing filenames", existingFiles.map(file => file.name))

    const existingIds: number[] = existingFiles.map(file =>
      parseInt(file.name.split(prefix)[1])
    )

    const highest = Math.max(0, ...existingIds)
    const next = `${highest}`.padStart(4, "0")
    const bucketDestination = `${prefix}${next}`

    console.log(
      "will bucket upload from",
      localTempPath,
      "to",
      bucketDestination
    )
    const [bucketFile]: [File, Metadata] = await this.gcsBucket.upload(
      localTempPath,
      {
        destination: bucketDestination,
      }
    )

    // this.deleteLocally(localTempPath) // don't care about result
    return `${this.options.buckerPublicURLBase}/${bucketFile.name}`
  }
}
