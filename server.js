import express from 'express';
import { logger } from './backend/logger.js';
import cors from 'cors';
import { dispatch, listServices } from './backend/dispatcher.js';

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

app.post('/api', async (req, res) => {
  try {
    const requestData = req.body;

    const result = await dispatch(requestData);
    res.json(result);

  } catch (err) {
    logger.error(`Server error: ${err.message}`);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.get('/api', (req, res) => {
  const response = listServices();
  res.status(response.status).json(response);
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});