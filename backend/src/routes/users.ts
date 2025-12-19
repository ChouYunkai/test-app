import { Router } from 'express';
import { pool } from '../db';

const router = Router();

// 1. 获取用户列表
// 注意：为了安全，通常不把密码(password)查出来发给前端
router.get('/', async (req, res) => {
  try {
    // 按 ID 正序排列 (1, 2, 3...)
    const sql = `
      SELECT id, name, email, role, permission_level, organization, created_at 
      FROM users 
      ORDER BY id ASC
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    console.error("❌ 获取用户列表失败:", error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
});

// 2. 查询用户
router.post('/search', async (req, res) => {
  try {
    const { name, email } = req.body;

    // 基础 SQL (注意：这里也不要查密码字段)
    let sql = 'SELECT id, name, email, role, permission_level, organization, created_at FROM users WHERE 1=1';
    const params = [];

    // 条件1：姓名模糊查询
    if (name) {
      sql += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }

    // 条件2：邮箱模糊查询
    if (email) {
      sql += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }

    sql += ' ORDER BY id ASC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("❌ 搜索用户失败:", error);
    res.status(500).json({ message: '搜索用户失败' });
  }
});

// 3. 新增用户
router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    console.log("收到新增用户请求:", data);

    const sql = `
      INSERT INTO users (name, email, password, role, permission_level, organization) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      data.name, 
      data.email, 
      data.password || '123456', // 如果没填密码，默认给 123456
      data.role || 'User', 
      data.permission_level || 'normal',
      data.organization || ''
    ];

    await pool.query(sql, params);
    res.json({ message: '新增成功' });
  } catch (error: any) {
    console.error("❌ 新增用户失败:", error);
    // 比如邮箱重复等错误
    res.status(500).json({ message: '新增失败', error: error.message });
  }
});

// 4. 修改用户
router.post('/update', async (req, res) => {
  try {
    const data = req.body;
    console.log("收到修改用户请求:", data);

    if (!data.id) return res.status(400).json({ message: '缺少 ID' });

    // 修改时通常不改密码，除非有专门的重置密码接口
    const sql = `
      UPDATE users 
      SET name=?, email=?, role=?, permission_level=?, organization=? 
      WHERE id=?
    `;
    
    const params = [
      data.name, 
      data.email, 
      data.role, 
      data.permission_level, 
      data.organization,
      data.id
    ];

    await pool.query(sql, params);
    res.json({ message: '修改成功' });
  } catch (error: any) {
    console.error("❌ 修改用户失败:", error);
    res.status(500).json({ message: '修改失败', error: error.message });
  }
});

// 5. 删除用户
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("收到删除用户请求 ID:", id);

    const sql = 'DELETE FROM users WHERE id = ?';
    await pool.query(sql, [id]);
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error("❌ 删除用户失败:", error);
    res.status(500).json({ message: '删除失败' });
  }
});

export default router;