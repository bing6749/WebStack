const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
  },
  priority: {
    type: Number,
    default: 0
  },
  clickCount: {
    type: Number,
    default: 0
  },
  rating: {
    total: { type: Number, default: 0 },    // 总评分
    count: { type: Number, default: 0 },    // 评分次数
    average: { type: Number, default: 0 }    // 平均评分
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isAccessible: {
    type: Boolean,
    default: true
  },
  lastChecked: {
    type: Date,
    default: null
  },
  lastStatusCode: {
    type: Number,
    default: null
  },
  responseTime: {
    type: Number,
    default: null
  },
  healthHistory: [{
    timestamp: Date,
    isAccessible: Boolean,
    statusCode: Number,
    responseTime: Number
  }],
  stats: {
    views: {
      total: { type: Number, default: 0 },
      daily: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now }
    },
    favorites: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  }
});

// 更新时自动更新updatedAt字段
siteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 添加计算热度的方法
siteSchema.methods.calculateHeat = function() {
  const now = new Date();
  const daysSinceReset = (now - this.stats.views.lastReset) / (1000 * 60 * 60 * 24);
  
  // 热度计算公式：
  // (日均访问量 * 0.4) + (总收藏数 * 0.3) + (总点击数 * 0.3)
  const dailyAverage = this.stats.views.total / Math.max(1, daysSinceReset);
  const heat = Math.round(
    (dailyAverage * 0.4) + 
    (this.stats.favorites * 0.3) + 
    (this.stats.clicks * 0.3)
  );
  
  return heat;
};

module.exports = mongoose.model('Site', siteSchema); 