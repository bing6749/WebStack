// 引入 Express 和路由模块
const express = require('express');
const router = express.Router();
// 引入 Site 模型和健康检查工具
const Site = require('../models/Site');
const checkSiteHealth = require('../utils/siteChecker');
// 引入认证中间件
const { auth, adminAuth } = require('../middleware/auth');

// 获取所有网站的健康状态
router.get('/status', async (req, res) => {
  try {
    // 查询所有站点并选择指定字段
    const sites = await Site.find({}, {
      title: 1,          // 网站标题
      url: 1,            // 网站 URL
      isAccessible: 1,   // 是否可访问
      lastChecked: 1,    // 上次检查时间
      lastStatusCode: 1, // 上次返回状态码
      responseTime: 1,   // 响应时间
      status: 1          // 健康状态
    });

    // 返回站点健康信息列表
    res.json(sites);
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 手动触发健康检查（仅管理员）
router.post('/check', auth, adminAuth, async (req, res) => {
  try {
    // 调用健康检查工具并获取结果
    const results = await checkSiteHealth();
    // 返回检查结果
    res.json(results);
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 导出路由模块以供其他文件使用
module.exports = router;
