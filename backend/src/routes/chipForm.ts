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

// 条件查询芯片表单
router.post('/search', async (req, res) => {
  try {
    const { projectName, supplier } = req.body;

    let sql = 'SELECT * FROM chip_form WHERE 1=1';
    const params = [];

    if (projectName) {
      sql += ' AND REPLACE(project, " ", "") LIKE ?';
      params.push(`%${projectName}%`);
    }

    if (supplier) {
      sql += ' AND supplier LIKE ?';
      params.push(`%${supplier}%`);
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("❌ 数据库查询失败:", error);
    res.status(500).json({ message: '数据库查询失败' });
  }
});

// 新增芯片数据
router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const sql = `INSERT INTO chip_form 
      (company, project, structure, contractor, supplier, prepared_by, cube_size, 
      grade, cement, fine_aggregate, coarse_aggregate, admixture, chip_code, test_days) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const params = [
      data.company,
      data.project,
      data.structure,
      data.contractor,
      data.supplier,
      data.prepared_by, // Web前端是下划线，数据库也是下划线，直接存！
      data.cube_size,
      data.grade,
      data.cement,
      data.fine_aggregate, // 修复了之前的 sandType
      data.coarse_aggregate, // 修复了之前的 gravelType
      data.admixture,
      data.chip_code,
      data.test_days // 修复了之前的 curingPeriod
    ];


    await pool.query(sql, params);
    res.json({ message: '新增成功' });
  } catch (err) {
    console.error("❌ 新增失败:", err);
    res.status(500).json({ message: '新增失败' });
  }
});

// 修改芯片数据
router.post('/update', async (req, res) => {
  try {
    const data = req.body;
    const sql = `UPDATE chip_form SET 
      company=?,
      project=?, 
      structure=?, 
      contractor=?, 
      supplier=?, 
      prepared_by=?, 
      cube_size=?, 
      grade=?, 
      cement=?, 
      fine_aggregate=?, 
      coarse_aggregate=?, 
      admixture=?, 
      chip_code=?, 
      test_days=?
      WHERE id=?`;

    const params = [
      data.company,
      data.project,
      data.structure,
      data.contractor,
      data.supplier,
      data.prepared_by,
      data.cube_size,
      data.grade,
      data.cement,
      data.fine_aggregate,
      data.coarse_aggregate,
      data.admixture,
      data.chip_code,
      data.test_days,
      data.id
    ];

    await pool.query(sql, params);
    res.json({ message: '修改成功' });
  } catch (err) {
    console.error("❌ 修改失败:", err);
    res.status(500).json({ message: '修改失败' });
  }
});
// 删除记录
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    const sql = 'DELETE FROM chip_form WHERE id = ?'
    await pool.query(sql, [id])
    res.json({ message: '删除成功' })
  } catch (err) {
    console.error('❌ 删除失败:', err)
    res.status(500).json({ message: '删除失败' })
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
// 获取选项信息接口（从 information 表读取
// 对应前端 API: getOptionsInfo() -> GET /api/chipform/options/information
router.get('/options/information', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT \`project\`, \`cube_size\`, \`test_days\` FROM information WHERE id IS NOT NULL`
    );

    const result = {
      project: [] as string[],
      cubeSize: [] as string[],
      testDays: [] as string[]
    };

    const projectSet = new Set<string>();
    const cubeSizeSet = new Set<string>();
    const testDaysSet = new Set<string>();

    (rows as any[]).forEach((row: any) => {
      if (row.project && String(row.project).trim() !== '') {
        projectSet.add(String(row.project).trim());
      }

      const cubeSizeValue = row['cube_size'] || row['cube_size'] || row.cubeSize;
      if (cubeSizeValue && String(cubeSizeValue).trim() !== '') {
        cubeSizeSet.add(String(cubeSizeValue).trim());
      }

      const testDaysValue = row['test_Days'] || row['test_days'] || row.testDays || row['testDays'] || row['test_days'];
      if (testDaysValue && String(testDaysValue).trim() !== '') {
        testDaysSet.add(String(testDaysValue).trim());
      }
    });

    result.project = Array.from(projectSet).sort();
    result.cubeSize = Array.from(cubeSizeSet).sort();
    result.testDays = Array.from(testDaysSet).sort();

    res.json(result);
  } catch (error: any) {
    if (error.message?.includes('Unknown column') || error.code === 'ER_BAD_FIELD_ERROR') {
      try {
        const [rows] = await pool.query(
          `SELECT project, cube_size, test_days FROM information WHERE id IS NOT NULL`
        );

        const result = {
          project: [] as string[],
          cubeSize: [] as string[],
          testDays: [] as string[]
        };

        const projectSet = new Set<string>();
        const cubeSizeSet = new Set<string>();
        const testDaysSet = new Set<string>();

        (rows as any[]).forEach((row: any) => {
          if (row.project && String(row.project).trim() !== '') {
            projectSet.add(String(row.project).trim());
          }
          if (row.cube_size && String(row.cube_size).trim() !== '') {
            cubeSizeSet.add(String(row.cube_size).trim());
          }
          if (row.test_days && String(row.test_days).trim() !== '') {
            testDaysSet.add(String(row.test_days).trim());
          }
        });

        result.project = Array.from(projectSet).sort();
        result.cubeSize = Array.from(cubeSizeSet).sort();
        result.testDays = Array.from(testDaysSet).sort();

        return res.json(result);
      } catch (retryError) {
        console.error('获取选项信息失败:', retryError);
      }
    }
    console.error('获取选项信息失败:', error);
    res.status(500).json({ message: '获取选项信息失败', error: String(error) });
  }
});

// GET /api/chipform/:chipCode
// ⚠️ 注意：这个参数路由必须放在所有具体路由之后，否则会拦截其他路由

// 按 chipCode 查询
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
      cube_size AS cubeSize, grade, cement,
      fine_aggregate AS fineAggregate,
      coarse_aggregate AS coarseAggregate,
      admixture, 
      chip_code AS chipCode,
      test_days AS testDays, 
      created_at AS createdAt
    FROM chip_form
    WHERE chip_code = ?
    ORDER BY created_at DESC
    LIMIT 1
    `
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      sql, [chipCode]
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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '邮箱和密码不能为空' });
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        organization VARCHAR(100) DEFAULT 'Default Organization',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      INSERT IGNORE INTO users (name, email, password, role, organization) 
      VALUES ('测试用户', 'test@example.com', '123456', 'admin', 'high', '测试公司')
    `);

    const [rows] = await pool.query(
      `SELECT name, email, role, organization 
       FROM users 
       WHERE email = ? AND password = ?`,
      [email, password]
    );

    const result = rows as any[];

    if (result.length === 0) {
      return res.status(401).json({ message: '账号或密码错误' });
    }

    const user = result[0];
    return res.status(200).json(user);
  } catch (error) {
    console.error('数据库出错:', error);
    return res.status(500).json({ message: '服务器内部错误' });
  }
});

// ✅ 新增创建用户接口（支持6个字段）
router.post('/create-account', async (req, res) => {
  const { name, email, password, role, organization } = req.body;

  console.log('📩 收到创建用户请求，请求数据:', req.body);

  if (!email || !password || !role) {
    return res.status(400).json({ message: '请提供必要字段（邮箱、密码、角色）' });
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'User',
        organization VARCHAR(100) DEFAULT 'Default Organization',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [existingUser] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: '该邮箱已存在' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role,  organization) VALUES (?, ?, ?, ?, ?, ?)',
      [name || '', email, password, role, organization || 'Default Organization']
    );

    console.log('✅ 用户创建成功:', result);

    return res.status(201).json({ message: '用户创建成功', userId: (result as any).insertId });
  } catch (error: any) {
    console.error('❌ 创建用户失败:', error.message || error);
    return res.status(500).json({ message: '服务器错误，请稍后重试', error: error.message });
  }
});
// 新增打印功能

// ==========================================
// [新增] 保存/更新测试数据列表 (子表数据)
// 作用：前端在录入完中间那个表格后，调用此接口保存
// ==========================================
router.post('/save-items', async (req, res) => {
  // 注意：实际项目中建议使用事务(connection.beginTransaction)，这里为了保持和你原有风格一致，简化处理
  try {
    const { main_id, items } = req.body; // main_id 是 chip_form 的 ID

    if (!main_id) {
      return res.status(400).json({ message: '缺少主表 ID (main_id)' });
    }

    // 策略：先删除该 ID 下的所有旧数据，再插入新数据 (最简单的“全量更新”逻辑)
    // 这样用户修改或删除了某一行，这里能自动同步
    await pool.query('DELETE FROM chip_test_data WHERE main_id = ?', [main_id]);

    if (items && items.length > 0) {
      const sql = `INSERT INTO chip_test_data 
        (main_id, cust_ref, date_cast, date_test, age_days, length_mm, width_mm, height_mm, mass_kg, density, load_kn, strength, mode_failure) 
        VALUES ?`;

      // 转换数据格式为 MySQL 批量插入所需的二维数组
      const values = items.map((item: any) => [
        main_id,
        item.cust_ref || '',
        item.date_cast || '',
        item.date_test || '',
        item.age_days || 0,
        item.length_mm || 0,
        item.width_mm || 0,
        item.height_mm || 0,
        item.mass_kg || 0,
        item.density || 0,
        item.load_kn || 0,
        item.strength || 0,
        item.mode_failure || 0
      ]);

      await pool.query(sql, [values]);
    }

    res.json({ message: '测试数据保存成功' });
  } catch (error: any) {
    console.error("❌ 保存测试数据失败:", error);
    res.status(500).json({ message: '保存失败', error: error.message });
  }
});

// ==========================================
// [新增] 获取打印详情 (主表 + 子表)
// 作用：打印组件调用此接口，获取生成 PDF 所需的所有数据
// ==========================================
router.get('/print-detail/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. 查主表信息 (chip_form) -> 作为报告头部
    const [mainRows] = await pool.query<RowDataPacket[]>('SELECT * FROM chip_form WHERE id = ?', [id]);
    if (mainRows.length === 0) {
      return res.status(404).json({ message: '未找到该记录' });
    }
    const mainInfo = mainRows[0];

    // 2. 查子表列表 (chip_test_data) -> 作为报告中间的表格
    const [itemRows] = await pool.query<RowDataPacket[]>('SELECT * FROM chip_test_data WHERE main_id = ? ORDER BY id ASC', [id]);

    // 3. 拼装数据返回给前端
    const result = {
      // 展开主表字段 (company, project, contractor...)
      ...mainInfo,
      // 放入列表数据
      items: itemRows
    };

    res.json(result);
  } catch (error) {
    console.error("❌ 获取打印详情失败:", error);
    res.status(500).json({ message: '获取详情失败' });
  }
});

export default router;
