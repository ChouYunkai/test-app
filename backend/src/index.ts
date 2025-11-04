// src/index.ts
import express from 'express';
import cors from 'cors';
import os from 'os';
import chipFormRouter from './routes/chipForm';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 挂载表单接口
app.use('/api/chipform', chipFormRouter);
// 获取本机局域网IP地址
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name];
    if (!nets) continue;
    for (const net of nets) {
      // 跳过内部（loopback）和非IPv4地址
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Android emulator access: http://${localIP}:${PORT}`);
});
