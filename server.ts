import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use the same variable the user defined
  const WEBHOOK_URL = process.env.VITE_WEBHOOK_URL;

  // API Route: Proxy Upload
  app.post('/api/transmit', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      if (!WEBHOOK_URL) {
        console.error('SERVER ERROR: VITE_WEBHOOK_URL is not defined in environment');
        return res.status(500).json({ error: 'Webhook URL is not configured on the server' });
      }

      console.log(`Transmitting ${req.file.originalname} to ${WEBHOOK_URL}`);

      // Reconstruct FormData for the target webhook
      const formData = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append('file', blob, req.file.originalname);
      
      // Pass through other fields if present
      if (req.body.fileName) formData.append('fileName', req.body.fileName);
      if (req.body.fileType) formData.append('fileType', req.body.fileType);
      if (req.body.fileSize) formData.append('fileSize', req.body.fileSize);
      if (req.body.userId) formData.append('userId', req.body.userId);
      if (req.body.timestamp) formData.append('timestamp', req.body.timestamp);
      if (req.body.date) formData.append('date', req.body.date);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Webhook responded with ${response.status}: ${text}`);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Transmission Error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Internal Server Error' 
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Webhook target: ${WEBHOOK_URL || 'NOT CONFIGURED'}`);
  });
}

startServer();
