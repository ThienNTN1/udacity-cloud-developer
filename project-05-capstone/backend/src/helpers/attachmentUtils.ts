import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS);

const s3Client = new XAWS.S3({ signatureVersion: 'v4' });
const attachmentS3Bucket = process.env.ATTACHMENT_S3_BUCKET;
const signedUrlExpiration: number = +process.env.SIGNED_URL_EXPIRATION;

const logger = createLogger('attachmentUtils')

export async function getUploadedAttachmentUrl(key: string): Promise<string> {
    const signedUrlExpireSeconds = 60 * signedUrlExpiration
  
    const url = await s3Client.getSignedUrl('putObject', {
      Bucket: attachmentS3Bucket,
      Key: key,
      Expires: signedUrlExpireSeconds
    })
    logger.info(`Geting attachment url: `, { url })
    return url
  }
