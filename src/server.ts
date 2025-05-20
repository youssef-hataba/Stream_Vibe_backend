import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT} 🎆`);
});
