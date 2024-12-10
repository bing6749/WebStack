// 引入 mongoose，用于定义和操作 MongoDB 的数据模型
const mongoose = require('mongoose');

// 定义站点的 Schema（模式），描述站点集合中的字段及其约束
const siteSchema = new mongoose.Schema({
  // 站点标题
  title: {
    type: String, // 数据类型为字符串
    required: true // 必填字段，不能为空
  },
  // 站点的 URL 地址
  url: {
    type: String, // 数据类型为字符串
    required: true, // 必填字段，不能为空
    unique: true // 必须唯一，不能重复
  },
  // 站点的描述
  description: {
    type: String, // 数据类型为字符串
    required: true // 必填字段，不能为空
  },
  // 站点所属分类
  category: {
    type: String, // 数据类型为字符串
    required: true // 必填字段
  },
  // 站点的标签（数组，每个元素为字符串）
  tags: [{
    type: String // 数据类型为字符串
  }],
  // 站点的缩略图地址
  thumbnail: {
    type: String, // 数据类型为字符串
    default: '' // 默认值为空字符串
  },
  // 站点的状态
  status: {
    type: String, // 数据类型为字符串
    enum: ['active', 'pending', 'inactive'], // 允许的值为 'active', 'pending', 'inactive'
    default: 'active' // 默认状态为 'active'
  },
  // 优先级，用于排序
  priority: {
    type: Number, // 数据类型为数字
    default: 0 // 默认值为 0
  },
  // 点击次数统计
  clickCount: {
    type: Number, // 数据类型为数字
    default: 0 // 默认值为 0
  },
  // 评分信息
  rating: {
    total: { type: Number, default: 0 }, // 总评分
    count: { type: Number, default: 0 }, // 评分次数
    average: { type: Number, default: 0 } // 平均评分
  },
  // 创建时间
  createdAt: {
    type: Date, // 数据类型为日期
    default: Date.now // 默认值为当前时间
  },
  // 更新时间
  updatedAt: {
    type: Date, // 数据类型为日期
    default: Date.now // 默认值为当前时间
  },
  // 是否可访问
  isAccessible: {
    type: Boolean, // 数据类型为布尔值
    default: true // 默认值为 true
  },
  // 上次访问检查时间
  lastChecked: {
    type: Date, // 数据类型为日期
    default: null // 默认值为空
  },
  // 上次访问的 HTTP 状态码
  lastStatusCode: {
    type: Number, // 数据类型为数字
    default: null // 默认值为空
  },
  // 上次访问的响应时间（毫秒）
  responseTime: {
    type: Number, // 数据类型为数字
    default: null // 默认值为空
  },
  // 健康历史记录
  healthHistory: [{
    timestamp: Date, // 检查时间
    isAccessible: Boolean, // 是否可访问
    statusCode: Number, // HTTP 状态码
    responseTime: Number // 响应时间
  }],
  // 统计信息
  stats: {
    // 浏览统计
    views: {
      total: { type: Number, default: 0 }, // 总浏览量
      daily: { type: Number, default: 0 }, // 每日浏览量
      lastReset: { type: Date, default: Date.now } // 上次重置时间
    },
    favorites: { type: Number, default: 0 }, // 收藏次数
    clicks: { type: Number, default: 0 } // 点击次数
  }
});

// 在保存文档前自动更新 `updatedAt` 字段为当前时间
siteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 定义计算站点热度的方法
siteSchema.methods.calculateHeat = function() {
  const now = new Date();
  // 计算自上次重置以来的天数
  const daysSinceReset = (now - this.stats.views.lastReset) / (1000 * 60 * 60 * 24);
  
  // 热度计算公式：
  // (日均访问量 * 0.4) + (总收藏数 * 0.3) + (总点击数 * 0.3)
  const dailyAverage = this.stats.views.total / Math.max(1, daysSinceReset); // 防止除以 0
  const heat = Math.round(
    (dailyAverage * 0.4) + 
    (this.stats.favorites * 0.3) + 
    (this.stats.clicks * 0.3)
  );
  
  return heat; // 返回计算得到的热度值
};

// 导出站点模型，以便在其他模块中使用
module.exports = mongoose.model('Site', siteSchema);
