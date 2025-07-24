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

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
