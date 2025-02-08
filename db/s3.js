import { 
    PutObjectCommand, 
    GetObjectCommand, 
    DeleteObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../config.js';
import s3Client from '../utils/s3Utils.js';

const uploadFile = async (file, fileName) => {
    const uploadParams = {
      Bucket: config.s3.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  
    try {
      const command = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(command);
      console.log('성공', data);
      return { success: true, data };
    } catch (err) {
      console.log('오류', err);
      return { success: false, error: err };
    }
};
  
const getFile = async (fileName) => {
    const getParams = {
      Bucket: config.s3.bucketName,
      Key: fileName,
    };
  
    try {
      const command = new GetObjectCommand(getParams);
      const data = await s3Client.send(command);
      console.log('성공', data);
      return { success: true, data };
    } catch (err) {
      console.log('오류', err);
      return { success: false, error: err };
    }
};
  
const getSignedFileUrl = async (fileName) => {
    const getParams = {
      Bucket: config.s3.bucketName,
      Key: fileName,
    };
  
    try {
      const command = new GetObjectCommand(getParams);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return { success: true, url };
    } catch (err) {
      console.log('오류', err);
      return { success: false, error: err };
    }
};
  
const deleteFile = async (fileName) => {
    const deleteParams = {
      Bucket: config.s3.bucketName,
      Key: fileName,
    };
  
    try {
      const command = new DeleteObjectCommand(deleteParams);
      const data = await s3Client.send(command);
      console.log('성공', data);
      return { success: true, data };
    } catch (err) {
      console.log('오류', err);
      return { success: false, error: err };
    }
};

 export default { uploadFile, getFile, getSignedFileUrl, deleteFile };
