export const domain = process.env.DOMAIN
export const mailgun = {
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.EMAIL_DOMAIN,
}
export const eventImage = {
  imageBucketPublicURLBase: process.env.EVENT_IMAGE_BUCKET_PUBLIC_URL_BASE,
  imageTempLocalPath: process.env.EVENT_IMAGE_TMP_LOCAL_PATH,
  imageCGSBucketName: process.env.EVENT_IMAGE_GCS_BUCKET_NAME
}
