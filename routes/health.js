const express = require('express');
const router = express.Router();
const Site = require('../models/Site');
const checkSiteHealth = require('../utils/siteChecker');
const { auth, adminAuth } = require('../middleware/auth');

// 获取所有网站的健康状态
router.get('/status', async (req, res) => {
  try {
    const sites = await Site.find({}, {
      title: 1,
      url: 1,
      isAccessible: 1,
      lastChecked: 1,
      lastStatusCode: 1,
      responseTime: 1,
      status: 1
    });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 手动触发健康检查（仅管理员）
router.post('/check', auth, adminAuth, async (req, res) => {
  try {
    const results = await checkSiteHealth();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 