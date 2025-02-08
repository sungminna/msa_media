// controllers/s3Controller.js
import s3Manager from '../db/s3.js';

const uploadFile = async (req, res) => {
    try {
      const { file } = req;
      if (!file) {
        return res.status(400).json({ error: 'no file provided' });
      }
  
      const fileName = `uploads/${Date.now()}-${file.originalname}`;
      const uploadResult = await s3Manager.uploadFile(file, fileName);
  
      if (uploadResult.success) {
        res.json({ 
          message: 'upload successful', 
          data: { 
            fileName,
          } 
        });
      } else {
        res.status(500).json({ error: 'upload failed', details: uploadResult.error });
      }
    } catch (error) {
      console.error('error on file upload: ', error);
      res.status(500).json({ error: 'failed to upload file', details: error.message });
    }
};
  
const getFile = async (req, res) => {
    try {
      const fileName = req.query.fileName;
      const urlResult = await s3Manager.getSignedFileUrl(fileName);
  
      if (urlResult.success) {
        res.json({ url: urlResult.url });
      } else {
        res.status(404).json({ error: 'file not found', details: urlResult.error });
      }
    } catch (error) {
      console.error('error on file search: ', error);
      res.status(500).json({ error: 'failed to find file', details: error.message });
    }
};
  
const deleteFile = async (req, res) => {
    try {
      const fileName = req.query.fileName;
      const deleteResult = await s3Manager.deleteFile(fileName);
  
      if (deleteResult.success) {
        res.json({ message: 'file deletion successful' });
      } else {
        res.status(500).json({ error: 'failed to delete file', details: deleteResult.error });
      }
    } catch (error) {
      console.error('error on file delete: ', error);
      res.status(500).json({ error: 'failed to delete file', details: error.message });
    }
};
  
export default { uploadFile, getFile, deleteFile };