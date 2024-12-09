const express = require('express');
const router = express.Router();
const Site = require('../models/Site');
const { auth } = require('../middleware/auth');

// 1. 首先是固定路径的路由
router.get('/', async (req, res) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. 然后是特定的功能路由
router.get('/popular', async (req, res) => {
  try {
    const sites = await Site.find();
    const sortedSites = sites
      .map(site => ({
        ...site.toObject(),
        heat: site.calculateHeat()
      }))
      .sort((a, b) => b.heat - a.heat)
      .slice(0, 10);
    res.json(sortedSites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  const keyword = decodeURIComponent(req.query.q || '');
  try {
    const sites = await Site.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const decodedCategory = decodeURIComponent(req.params.category);
    const sites = await Site.find({ category: decodedCategory });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. 然后是获取单个网站的路由
router.get('/:id', async (req, res) => {
  console.log('收到获取网站请求，ID:', req.params.id);
  try {
    // 验证 ID 格式
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('ID格式无效:', req.params.id);
      return res.status(400).json({ message: '无效的网站ID' });
    }

    console.log('正在查询数据库...');
    const site = await Site.findById(req.params.id);
    console.log('查询结果:', site);

    if (!site) {
      console.log('网站不存在');
      return res.status(404).json({ message: '网站不存在' });
    }

    console.log('成功获取网站信息');
    res.json(site);
  } catch (error) {
    console.error('获取网站错误:', error);
    res.status(500).json({ message: error.message });
  }
});

// 4. 最后是其他使用 :id 的路由
router.put('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: '无效的网站ID' });
    }

    const updatedSite = await Site.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedSite) {
      return res.status(404).json({ message: '网站不存在' });
    }
    
    res.json(updatedSite);
  } catch (error) {
    console.error('更新网站错误:', error);
    res.status(400).json({ message: error.message });
  }
});

// 添加新网站
router.post('/', async (req, res) => {
  const site = new Site({
    title: req.body.title,
    url: req.body.url,
    description: req.body.description,
    category: req.body.category,
    tags: req.body.tags
  });

  try {
    const newSite = await site.save();
    res.status(201).json(newSite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除网站
router.delete('/:id', auth, async (req, res) => {
  try {
    // 检查用户是否是管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }

    // 验证 ID 格式
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: '无效的网站ID' });
    }

    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: '网站不存在' });
    }

    await Site.findByIdAndDelete(req.params.id);
    res.json({ message: '网站已删除' });
  } catch (error) {
    console.error('删除网站错误:', error);
    res.status(500).json({ message: error.message });
  }
});

// 记录点击
router.post('/:id/click', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);

    // 更新点击数
    site.stats.clicks += 1;

    // 更新访问统计
    site.stats.views.total += 1;

    // 检查是否需要重置每日统计
    const now = new Date();
    const lastReset = new Date(site.stats.views.lastReset);
    if (now.getDate() !== lastReset.getDate()) {
      site.stats.views.daily = 1;
      site.stats.views.lastReset = now;
    } else {
      site.stats.views.daily += 1;
    }

    await site.save();
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 添加评分
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;

    // 验证评分
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: '评分必须在1-5之间' });
    }

    const site = await Site.findById(req.params.id);

    // 更新评分
    site.rating.total += rating;
    site.rating.count += 1;
    site.rating.average = site.rating.total / site.rating.count;

    await site.save();
    res.json({
      message: '评分成功',
      rating: site.rating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取网站评分
router.get('/:id/rating', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    res.json(site.rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 