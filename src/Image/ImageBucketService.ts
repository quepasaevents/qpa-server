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
// /e/[event_id]/[image_type]_timeOfUploadInMs_RNDM.extension
// RNDM are 4 random characters
// Extensions is the extension of the file

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
    const writeStream = fs.createWriteStream(targetFullPath)
    return new Promise((resolve, reject) => {
      readableStream.pipe(writeStream)
      readableStream.on("end", () => {
        resolve(targetFullPath)
      })
      readableStream.on("error", err => {
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

    const prefix = `e/${options.eventId}/${options.imageType}`
    const fileExtension = file.filename.split(".").reverse()[0]
    const uniquenessSalt = randomstring({ length: 3 })
    const bucketDestination = `${prefix}_${Date.now()}_${uniquenessSalt}.${fileExtension}`

    const [bucketFile]: [File, Metadata] = await this.gcsBucket.upload(
      localTempPath,
      {
        destination: bucketDestination,
      }
    )

    this.deleteLocally(localTempPath) // don't care about result
    return `${this.options.buckerPublicURLBase}/${bucketFile.name}`
  }
}
