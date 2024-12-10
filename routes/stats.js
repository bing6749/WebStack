// 引入 Express 和路由模块
const express = require('express');
const router = express.Router();
// 引入 Site 模型和认证中间件
const Site = require('../models/Site');
const { auth, adminAuth } = require('../middleware/auth');

// 1. 获取网站统计信息
router.get('/sites/:id', async (req, res) => {
  try {
    // 查询指定 ID 的网站，并返回该网站的统计信息
    const site = await Site.findById(req.params.id);
    res.json(site.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. 获取所有网站的统计概览（管理员权限）
router.get('/overview', auth, adminAuth, async (req, res) => {
  try {
    // 聚合查询，统计所有网站的总数、总浏览量、总点击量和平均评分
    const stats = await Site.aggregate([
      {
        $group: {
          _id: null,
          totalSites: { $sum: 1 }, // 统计网站总数
          totalViews: { $sum: '$stats.views.total' }, // 统计总浏览量
          totalClicks: { $sum: '$stats.clicks.total' }, // 统计总点击量
          averageRating: { $avg: '$rating.average' } // 计算所有网站的平均评分
        }
      }
    ]);
    res.json(stats[0]); // 返回第一个统计结果
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. 获取热门网站排行
router.get('/popular', async (req, res) => {
  try {
    // 按照网站的总浏览量降序排序，限制返回前 10 个网站
    const sites = await Site.find()
      .sort({ 'stats.views.total': -1 }) // 按照总浏览量降序排序
      .limit(10) // 限制返回前 10 个
      .select('title url stats.views stats.clicks rating'); // 只返回必要的字段
    res.json(sites); // 返回热门网站列表
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. 记录网站访问
router.post('/sites/:id/view', async (req, res) => {
  try {
    // 查找指定 ID 的网站
    const site = await Site.findById(req.params.id);
    // 更新该网站的访问统计
    site.stats.views.total += 1;
    site.stats.views.daily += 1;
    site.stats.views.weekly += 1;
    site.stats.views.monthly += 1;
    // 保存更新后的统计数据
    await site.save();
    res.json({ message: '访问已记录' }); // 返回访问记录成功的消息
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 导出路由模块
module.exports = router;
