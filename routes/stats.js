const express = require('express');
const router = express.Router();
const Site = require('../models/Site');
const { auth, adminAuth } = require('../middleware/auth');

// 获取网站统计信息
router.get('/sites/:id', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    res.json(site.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取所有网站的统计概览（管理员）
router.get('/overview', auth, adminAuth, async (req, res) => {
  try {
    const stats = await Site.aggregate([
      {
        $group: {
          _id: null,
          totalSites: { $sum: 1 },
          totalViews: { $sum: '$stats.views.total' },
          totalClicks: { $sum: '$stats.clicks.total' },
          averageRating: { $avg: '$rating.average' }
        }
      }
    ]);
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取热门网站排行
router.get('/popular', async (req, res) => {
  try {
    const sites = await Site.find()
      .sort({ 'stats.views.total': -1 })
      .limit(10)
      .select('title url stats.views stats.clicks rating');
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 记录网站访问
router.post('/sites/:id/view', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    site.stats.views.total += 1;
    site.stats.views.daily += 1;
    site.stats.views.weekly += 1;
    site.stats.views.monthly += 1;
    await site.save();
    res.json({ message: '访问已记录' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 