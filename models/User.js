// 引入 mongoose 和 bcrypt，用于定义数据模型和处理密码加密
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 定义用户的 Schema（模式），描述用户集合中的字段及其约束
const userSchema = new mongoose.Schema({
  // 用户名
  username: {
    type: String, // 数据类型为字符串
    required: true, // 必填字段，不能为空
    unique: true // 必须唯一，不能重复
  },
  // 用户邮箱
  email: {
    type: String, // 数据类型为字符串
    required: true, // 必填字段，不能为空
    unique: true // 必须唯一，不能重复
  },
  // 用户密码
  password: {
    type: String, // 数据类型为字符串
    required: true // 必填字段，不能为空
  },
  // 用户角色
  role: {
    type: String, // 数据类型为字符串
    enum: ['user', 'admin'], // 允许的值为 'user' 或 'admin'
    default: 'user' // 默认角色为 'user'
  },
  // 用户收藏的站点（引用 Site 集合的 ID）
  favorites: [{
    type: mongoose.Schema.Types.ObjectId, // 数据类型为 MongoDB 的 ObjectId
    ref: 'Site' // 引用 Site 模型
  }],
  // 创建时间
  createdAt: {
    type: Date, // 数据类型为日期
    default: Date.now // 默认值为当前时间
  }
});

// 在保存用户之前对密码进行加密
userSchema.pre('save', async function(next) {
  // 如果密码被修改，则进行加密处理
  if (this.isModified('password')) {
    // 使用 bcrypt 对密码进行哈希加密
    this.password = await bcrypt.hash(this.password, 10);
  }
  next(); // 调用 next 继续执行
});

// 导出用户模型，以便在其他模块中使用
module.exports = mongoose.model('User', userSchema);
