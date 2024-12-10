// 引入 mongoose 库，用于定义和操作 MongoDB 数据模型
const mongoose = require('mongoose');

// 定义分类的 Schema（模式），描述分类集合中的字段及其约束
const categorySchema = new mongoose.Schema({
  // 分类名称
  name: {
    type: String, // 数据类型为字符串
    required: true, // 必填字段，不能为空
    unique: true // 必须唯一，不能重复
  },
  // 分类描述
  description: {
    type: String // 数据类型为字符串，非必填字段
  },
  // 分类图标
  icon: {
    type: String // 数据类型为字符串，存储图标的路径或名称
  },
  // 排序权重
  order: {
    type: Number, // 数据类型为数字
    default: 0 // 默认值为 0
  },
  // 分类状态
  status: {
    type: String, // 数据类型为字符串
    enum: ['active', 'inactive'], // 只允许 'active' 或 'inactive' 两种状态
    default: 'active' // 默认值为 'active'
  }
});

// 导出分类模型，以便在其他模块中使用
// 使用 'Category' 作为模型名称，基于 categorySchema 定义
module.exports = mongoose.model('Category', categorySchema);
