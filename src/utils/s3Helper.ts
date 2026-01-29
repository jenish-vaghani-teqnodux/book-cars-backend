import AWS from 'aws-sdk'
import * as env from '../config/env.config'

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION,
})

const s3 = new AWS.S3()

// upload
export const uploadFile = async (key: string, buffer: Buffer, type?: string) => {
  return s3.upload({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: type,
  }).promise()
}

// delete
export const deleteFile = async (key: string) => {
  return s3.deleteObject({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
  }).promise()
}
