import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
// TODO: Implement the fileStogare logic
const bucketName = process.env.TODOS_TABLE

    const s3 = new XAWS.S3({
    signatureVersion: 'v4'
    })
    export function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: 3000
    })
    }