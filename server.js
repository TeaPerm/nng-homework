import express, { request } from 'express';
import { logger } from './backend/logger.js';
import { dispatch } from './backend/dispatcher.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
  try {
    const requestData = req.body;

    const result = await dispatch(requestData);
    res.json(result);

  } catch (err) {
    logger.error(`Server error: ${err.message}`);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});