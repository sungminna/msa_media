// controllers/s3Controller.js
import s3Manager from '../db/s3.js';
import fileManager from '../db/sqlite.js';
import getUserIdFromToken from '../utils/auth.js';

fileManager.initialize().catch(console.error);

const uploadFile = async (req, res) => {
    try {
      const { file } = req;
      const token = req.headers.authorization?.split(' ')[1];
      const userId = getUserIdFromToken(token)
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      if (!file) {
        return res.status(400).json({ error: 'no file provided' });
      }
      
      const fileName = `uploads/${Date.now()}-${file.originalname}`;
      const saveResult = await fileManager.saveFileInfo(fileName, userId);
      var uploadResult = { success: false };
      if (saveResult) {
        uploadResult = await s3Manager.uploadFile(file, fileName);
      }
      
      if (uploadResult.success && saveResult.success) {
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

      const token = req.headers.authorization?.split(' ')[1];
      const userId = getUserIdFromToken(token)
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const deleteResultDB = await fileManager.deleteFileByName(fileName, userId);
      var deleteResult = { success: false };
      if (deleteResultDB.success && deleteResultDB.deleted) {
        deleteResult = await s3Manager.deleteFile(fileName);
      }  
      if (deleteResult.success && deleteResultDB.success && deleteResultDB.deleted) {
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