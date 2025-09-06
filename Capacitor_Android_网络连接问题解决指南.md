# Capacitor Android 应用网络连接问题解决指南

## 项目概述
这是一个基于 Ionic Vue + Capacitor 的移动应用项目，包含前端移动应用和后端 Node.js 服务器。本文档记录了在开发过程中遇到的网络连接问题及其解决方案。

## 问题总结与解决方案

### 1. 模块导入错误

**问题描述：**
```
找不到模块"@capacitor-mlkit/barcode-scanning"或其相应的类型声明。
```

**原因分析：**
项目中实际安装的是 `@capacitor-community/barcode-scanner`，但代码中导入的是 `@capacitor-mlkit/barcode-scanning`。

**解决方案：**
```typescript
// 修改前
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'

// 修改后
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'
```

### 2. 明文HTTP请求被阻止

**问题描述：**
```
POST http://localhost:3001/api/chipform/login net::ERR_CLEARTEXT_NOT_PERMITTED
```

**原因分析：**
Android 9+ 默认不允许明文 HTTP 请求，需要配置网络安全策略。

**解决方案：**

#### 2.1 创建网络安全配置文件
创建 `android/app/src/main/res/xml/network_security_config.xml`：
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
    </domain-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </base-config>
</network-security-config>
```

#### 2.2 修改 AndroidManifest.xml
```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/AppTheme"
    android:networkSecurityConfig="@xml/network_security_config"
    android:usesCleartextTraffic="true">
```

### 3. 混合内容错误

**问题描述：**
```
Mixed Content: The page at 'https://localhost/tabs/tab2' was loaded over HTTPS, 
but requested an insecure resource 'http://10.0.2.2:3001/api/chipform/login'. 
This request has been blocked; the content must be served over HTTPS.
```

**原因分析：**
Capacitor 应用在 HTTPS 环境下运行，但尝试访问 HTTP 资源。

**解决方案：**

#### 3.1 修改 Capacitor 配置
`capacitor.config.ts`：
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'TestApp',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
```

#### 3.2 修改 MainActivity.java
```java
package io.ionic.starter;

import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        
        // 允许混合内容
        if (bridge != null && bridge.getWebView() != null) {
            WebSettings webSettings = bridge.getWebView().getSettings();
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    }
}
```

### 4. 网络地址映射问题

**问题描述：**
```
POST http://10.0.2.2:3001/api/chipform/login net::ERR_CONNECTION_TIMED_OUT
```

**原因分析：**
- `10.0.2.2` 只能在 Android 模拟器内部访问
- 后端服务器只监听 localhost，无法从外部访问
- 手机和电脑不在同一网络

**解决方案：**

#### 4.1 修改后端服务器监听地址
`backend/src/index.ts`：
```typescript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Android emulator access: http://10.0.2.2:${PORT}`);
});
```

#### 4.2 网络环境配置
- 使用手机热点，确保手机和电脑在同一网络
- 获取电脑在热点网络中的IP地址（如：172.20.10.3）
- 更新前端代码使用正确的IP地址

#### 4.3 更新前端API地址
```typescript
// 修改前
const response = await fetch('http://localhost:3001/api/chipform/login', {

// 修改后（使用实际IP地址）
const response = await fetch('http://172.20.10.3:3001/api/chipform/login', {
```

### 5. 数据库连接和认证问题

**问题描述：**
```
POST http://172.20.10.3:3001/api/chipform/login 401 (Unauthorized)
```

**原因分析：**
- 数据库中没有用户表或用户数据
- 缺少数据库环境配置

**解决方案：**

#### 5.1 创建环境配置文件
`backend/.env`：
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=test_app
DB_PORT=3306
```

#### 5.2 修改登录接口自动创建用户表
```typescript
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

    // 验证用户登录
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
```

## 测试账号
- 邮箱：`test@example.com`
- 密码：`123456`

## 常用命令

### 重新构建和同步
```bash
# 构建前端
npm run build

# 同步到Android
npx cap sync android

# 运行Android应用
npx cap run android
```

### 检查网络连接
```bash
# 检查端口是否被占用
netstat -an | findstr :3001

# 获取本机IP地址
ipconfig
```

## 注意事项

1. **开发环境配置**：本文档中的配置仅适用于开发环境，生产环境应使用HTTPS
2. **网络安全**：`usesCleartextTraffic="true"` 会降低应用安全性，仅用于开发测试
3. **IP地址变化**：使用热点时，IP地址可能会变化，需要重新获取和更新
4. **防火墙设置**：确保Windows防火墙允许端口3001的入站连接

## 故障排除

### 如果仍然无法连接：
1. 检查后端服务器是否正在运行
2. 确认手机和电脑在同一网络
3. 验证IP地址是否正确
4. 检查防火墙设置
5. 查看后端控制台错误日志

### 调试步骤：
1. 先在电脑浏览器中测试API地址
2. 再在手机浏览器中测试
3. 最后在Android应用中测试

## 总结

通过以上配置，成功解决了：
- ✅ 模块导入错误
- ✅ 明文HTTP请求被阻止
- ✅ 混合内容错误
- ✅ 网络连接超时
- ✅ 数据库认证问题

最终实现了移动应用与后端服务器的正常通信。
