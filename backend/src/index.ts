// src/index.ts
import express from 'express';
import cors from 'cors';
import chipFormRouter from './routes/chipForm';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/chipform', chipFormRouter);

// 监听所有网卡
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
