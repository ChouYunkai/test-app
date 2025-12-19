import { Router } from 'express';
import { pool } from '../db';
import { RowDataPacket } from 'mysql2';

const router = Router();

// 1. 获取所有选项列表
// 对应前端 API: getInfoList() -> GET /api/info
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM information ORDER BY id ASC';
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    console.error("❌ 获取选项列表失败:", error);
    res.status(500).json({ message: '获取选项列表失败' });
  }
});
// 2 查询选项详情
router.post('/search', async (req, res) => {
  try {
    // 接收两个参数：项目名称、尺寸标准
    const { project, cube_size } = req.body;
    
    // 1=1 是一个编程技巧，方便后面直接拼接 AND 语句
    let sql = 'SELECT * FROM information WHERE 1=1';
    const params = [];

    // 条件1：项目名称 (忽略空格模糊查询)
    // 例如：数据库存 "Project A"，搜 "ProjectA" 也能搜到
    if (project) {
      sql += ' AND REPLACE(project, " ", "") LIKE ?';
      params.push(`%${project}%`); 
    }

    // 条件2：尺寸标准 (模糊查询)
    // 例如：搜 "150" 能搜到 "150x150x150"
    if (cube_size) {
      sql += ' AND cube_size LIKE ?';
      params.push(`%${cube_size}%`);
    }
    
    sql += ' ORDER BY id ASC'; // 保持 ID 正序

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("❌ 搜索失败:", error);
    res.status(500).json({ message: '搜索失败' });
  }
});

// 3. 新增选项
// 对应前端 API: addInfo() -> POST /api/info/add
router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    console.log("收到新增选项请求:", data);

    const sql = `INSERT INTO information (project, cube_size, test_days) VALUES (?, ?, ?)`;
    
    // 允许某些字段为空字符串
    const params = [
      data.project || '', 
      data.cube_size || '', 
      data.test_days || ''
    ];

    await pool.query(sql, params);
    res.json({ message: '新增成功' });
  } catch (error: any) {
    console.error("❌ 新增选项失败:", error);
    res.status(500).json({ message: '新增失败', error: error.message });
  }
});

// 4. 修改选项
// 对应前端 API: updateInfo() -> POST /api/info/update
router.post('/update', async (req, res) => {
  try {
    const data = req.body;
    console.log("收到修改选项请求:", data);

    if (!data.id) {
      return res.status(400).json({ message: '缺少 ID' });
    }

    const sql = `UPDATE information SET project=?, cube_size=?, test_days=? WHERE id=?`;
    
    const params = [
      data.project, 
      data.cube_size, 
      data.test_days, 
      data.id
    ];

    await pool.query(sql, params);
    res.json({ message: '修改成功' });
  } catch (error: any) {
    console.error("❌ 修改选项失败:", error);
    res.status(500).json({ message: '修改失败', error: error.message });
  }
});

// 5. 删除选项
// 对应前端 API: deleteInfo() -> DELETE /api/info/delete/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("收到删除选项请求 ID:", id);

    const sql = 'DELETE FROM information WHERE id = ?';
    await pool.query(sql, [id]);
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error("❌ 删除选项失败:", error);
    res.status(500).json({ message: '删除失败' });
  }
});

export default router;