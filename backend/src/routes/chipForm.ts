// src/routes/chipForm.ts
import { Router } from 'express';
import { pool } from '../db';
import { RowDataPacket } from 'mysql2';
const router = Router();

// 获取所有芯片表单数据
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM chip_form');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '数据库查询失败' });
  }
});

// 插入新的芯片表单数据
router.post('/', async (req, res) => {
  const {
    company, project, structure, contractor, supplier, preparedBy,
    cubeSize, grade, cement, fineAggregate, coarseAggregate,
    admixture, chipCode, testDays,
  } = req.body;

  try {
    const sql = `INSERT INTO chip_form (
      company, project, structure, contractor, supplier, prepared_by,
      cube_size, grade, cement, fine_aggregate, coarse_aggregate,
      admixture, chip_code, test_days
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await pool.query(sql, [
      company, project, structure, contractor, supplier, preparedBy,
      cubeSize, grade, cement, fineAggregate, coarseAggregate,
      admixture, chipCode, testDays,
    ]);

    res.status(201).json({ message: '插入成功', insertId: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '插入失败' });
  }
});

// GET /api/chipform/:chipCode
router.get('/:chipCode', async (req, res) => {
    const { chipCode } = req.params;
    const sql = `
    SELECT
      id,
      company,
      project,
      structure,
      contractor,
      supplier,
      prepared_by AS preparedBy,
      cube_size AS cubeSize,
      grade,
      cement,
      fine_aggregate AS fineAggregate,
      coarse_aggregate AS coarseAggregate,
      admixture,
      chip_code AS chipCode,
      test_days AS testDays,
      created_at AS createdAt
    FROM chip_form
    WHERE chip_code = ?
    `
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        sql,[chipCode]
      );
      console.log('查询结果条数:', rows.length);
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: '未找到对应试块编号' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '查询失败' });
    }
  });
  
// 登录接口
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: '邮箱和密码不能为空' })
  }

  try {
    // 创建users表（如果不存在）
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        permission_level VARCHAR(50) DEFAULT 'normal',
        organization VARCHAR(100) DEFAULT 'Default Organization',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 插入测试用户（如果不存在）
    await pool.query(`
      INSERT IGNORE INTO users (name, email, password, role, permission_level, organization) 
      VALUES ('测试用户', 'test@example.com', '123456', 'admin', 'high', '测试公司')
    `)

    const [rows] = await pool.query(
      `SELECT name, email, role, permission_level, organization 
       FROM users 
       WHERE email = ? AND password = ?`,
      [email, password]
    )

    const result = rows as any[]

    if (result.length === 0) {
      return res.status(401).json({ message: '账号或密码错误' })
    }

    const user = result[0]

    return res.status(200).json(user)
  } catch (error) {
    console.error('数据库出错:', error)
    return res.status(500).json({ message: '服务器内部错误' })
  }
})

export default router;
