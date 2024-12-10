// 引入必要的模块
const express = require('express');  // 用于创建和管理服务器的框架
const cors = require('cors');  // 用于处理跨域请求的中间件
const path = require('path');  // 用于处理文件和目录路径的模块
const connectDB = require('./config/db');  // 自定义函数，用于连接数据库
require('dotenv').config();  // 加载 .env 文件中的环境变量
const authRoutes = require('./routes/auth');  // 引入身份验证相关路由
const favoritesRoutes = require('./routes/favorites');  // 引入用户收藏相关路由
const statsRoutes = require('./routes/stats');  // 引入统计相关路由

// 创建 Express 应用实例
const app = express();

// 连接到数据库
connectDB();

// 中间件设置
app.use(cors());  // 允许跨域请求
app.use(express.json());  // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true }));  // 解析 URL 编码的请求体，支持复杂的对象结构

// 配置静态文件服务
app.use(express.static(path.join(__dirname, 'public')));  // 提供公共文件夹中的静态资源
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // 提供上传文件夹中的静态资源

// 定义 API 路由
app.use('/api/sites', require('./routes/sites'));  // 网站相关路由
app.use('/api/categories', require('./routes/categories'));  // 类别相关路由
app.use('/api/auth', authRoutes);  // 身份验证路由
app.use('/api/favorites', favoritesRoutes);  // 收藏夹相关路由
app.use('/api/stats', statsRoutes);  // 统计相关路由

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);  // 打印错误栈信息到控制台
  res.status(500).json({ message: '服务器内部错误' });  // 发送500错误响应
});

// 服务器监听指定端口
const PORT = process.env.PORT || 5000;  // 获取端口号，优先使用环境变量，若无则默认为 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // 启动服务器并输出信息
