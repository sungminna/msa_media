import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

class FileManager {
  constructor() {
    this.db = null;
  }

  async initialize() {
    this.db = await open({
      filename: './files.db',
      driver: sqlite3.Database
    });

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_name TEXT NOT NULL,
        user_id TEXT NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }


  async saveFileInfo(fileName, userId) {
    try {
      const result = await this.db.run(
        'INSERT INTO files (file_name, user_id) VALUES (?, ?)',
        [fileName, userId]
      );
      return { success: true, id: result.lastID };
    } catch (error) {
      console.error('Error saving file info:', error);
      return { success: false, error };
    }
  }

  async getFile(fileName) {
    try {
        const result = await this.db.run(
            'SELECT * FROM files WHERE file_name = ?', 
            [fileName]
        )
        return { success: true, result };
    } catch (error) {
        console.error('Error fetching file by name: ', error);
        return { success: false, error };
    }
  }

  async getUserFiles(userId) {
    try {
      const files = await this.db.all(
        'SELECT * FROM files WHERE user_id = ? ORDER BY uploaded_at DESC',
        [userId]
      );
      return { success: true, files };
    } catch (error) {
      console.error('Error fetching user files:', error);
      return { success: false, error };
    }
  }

  async deleteFileByName(fileName, userId) {
    try {
      const result = await this.db.run(
        'DELETE FROM files WHERE file_name = ? AND user_id = ?',
        [fileName, userId]
      );
      
      if (result.changes > 0) {
        return { success: true, deleted: true };
      } else {
        return { success: true, deleted: false };
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error };
    }
  }

  
}


export default new FileManager();