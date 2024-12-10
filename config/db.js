// 引入 mongoose 库，用于连接和操作 MongoDB 数据库
const mongoose = require('mongoose');

// 定义一个异步函数 connectDB，用于建立与 MongoDB 的连接
const connectDB = async () => {
  try {
    // 使用 mongoose 的 connect 方法连接 MongoDB 数据库
    // process.env.MONGO_URI 是环境变量，存储 MongoDB 的连接 URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // authSource 指定用于身份验证的数据库，这里设置为 'admin'
      authSource: 'admin',
      // serverSelectionTimeoutMS 定义选择合适的 MongoDB 服务器的超时时间（毫秒）
      serverSelectionTimeoutMS: 5000,
      // socketTimeoutMS 定义套接字连接的超时时间（毫秒）
      socketTimeoutMS: 45000,
    });

    // 如果连接成功，输出连接的主机地址
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // 如果连接失败，捕获并输出错误信息
    console.error(`Error: ${error.message}`);
    // 以退出码 1 停止当前 Node.js 进程
    process.exit(1);
  }
};

// 将 connectDB 函数导出，以便在其他模块中使用
module.exports = connectDB;
