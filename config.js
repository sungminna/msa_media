import dotenv from 'dotenv';
dotenv.config();

const config = {
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  port: process.env.PORT || 3000,
};

export default config;
