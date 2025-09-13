// src/index.ts
import express from 'express';
import cors from 'cors';
import chipFormRouter from './routes/chipForm';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 挂载表单接口
app.use('/api/chipform', chipFormRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Android emulator access: http://172.20.10.3:${PORT}`);
});
