import express from 'express';
import cors from 'cors';
import Router from './config/router.js';
import { PORT } from './config/enviroment.js';
import { connectDb } from './db/helpers.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', Router);

async function startServer() {
  try {
    await connectDb();
    console.log('🧿 Connected to mongoDb');
    app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
  } catch (err) {
    console.log('Error', err);
  }
}

startServer();
