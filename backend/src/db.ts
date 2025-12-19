// src/db.ts，连接池模块
// 把mysql2/promise包调用给mysql变量，后边直接用mysql代替，
// mysql2是node和mysql交互翻译的驱动，promise是mysql2的一个扩展，支持async/await
import mysql from 'mysql2/promise';
// 引入dotenv包，以便为了从 .env 文件中读取配置，并加载到环境变量中，因为代码里不能直接写密码等敏感信息
import dotenv from 'dotenv';
// 从 .env 文件中读取配置，让 .env 文件里的配置能在代码中使用
dotenv.config();
// createPool 创建一个连接池函数，用于管理数据库连接。pool是一个装满了数据库连接和操作方法的对象，所以要导出。
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
});
