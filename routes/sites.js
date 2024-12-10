// 引入 Express 和路由模块
const express = require('express');
const router = express.Router();
// 引入 Site 模型和认证中间件
const Site = require('../models/Site');
const { auth } = require('../middleware/auth');

// 1. 获取所有网站
router.get('/', async (req, res) => {
  try {
    // 查询所有站点
    const sites = await Site.find();
    res.json(sites); // 返回所有网站数据
  } catch (error) {
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 2. 获取最受欢迎的网站（按热度排序）
router.get('/popular', async (req, res) => {
  try {
    // 获取所有网站
    const sites = await Site.find();
    // 根据热度进行排序（假设 Site 模型有一个 calculateHeat 方法来计算热度）
    const sortedSites = sites
      .map(site => ({
        ...site.toObject(),
        heat: site.calculateHeat() // 计算每个网站的热度
      }))
      .sort((a, b) => b.heat - a.heat) // 按热度降序排序
      .slice(0, 10); // 获取前 10 个最热网站
    res.json(sortedSites); // 返回排序后的热门网站
  } catch (error) {
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 3. 搜索网站（通过标题或描述）
router.get('/search', async (req, res) => {
  const keyword = decodeURIComponent(req.query.q || ''); // 获取并解码查询关键词
  try {
    // 使用正则匹配标题或描述中包含关键词的网站
    const sites = await Site.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } }, // 匹配标题
        { description: { $regex: keyword, $options: 'i' } } // 匹配描述
      ]
    });
    res.json(sites); // 返回匹配的网站
  } catch (error) {
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 4. 获取指定分类下的网站
router.get('/category/:category', async (req, res) => {
  try {
    const decodedCategory = decodeURIComponent(req.params.category); // 解码分类名称
    const sites = await Site.find({ category: decodedCategory }); // 查询指定分类的网站
    res.json(sites); // 返回指定分类下的网站
  } catch (error) {
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 5. 获取单个网站的信息
router.get('/:id', async (req, res) => {
  console.log('收到获取网站请求，ID:', req.params.id);
  try {
    // 验证 ID 格式是否有效
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('ID格式无效:', req.params.id);
      return res.status(400).json({ message: '无效的网站ID' });
    }

    console.log('正在查询数据库...');
    const site = await Site.findById(req.params.id); // 查询指定 ID 的网站
    console.log('查询结果:', site);

    if (!site) {
      console.log('网站不存在');
      return res.status(404).json({ message: '网站不存在' });
    }

    console.log('成功获取网站信息');
    res.json(site); // 返回网站信息
  } catch (error) {
    console.error('获取网站错误:', error);
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 6. 更新网站信息
router.put('/:id', async (req, res) => {
  try {
    // 验证 ID 格式是否有效
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: '无效的网站ID' });
    }

    // 更新网站信息
    const updatedSite = await Site.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // 返回更新后的站点信息
    );
    
    if (!updatedSite) {
      return res.status(404).json({ message: '网站不存在' });
    }
    
    res.json(updatedSite); // 返回更新后的网站信息
  } catch (error) {
    console.error('更新网站错误:', error);
    res.status(400).json({ message: error.message }); // 错误处理
  }
});

// 7. 添加新网站
router.post('/', async (req, res) => {
  // 创建一个新的 Site 实例
  const site = new Site({
    title: req.body.title,
    url: req.body.url,
    description: req.body.description,
    category: req.body.category,
    tags: req.body.tags
  });

  try {
    // 保存新网站
    const newSite = await site.save();
    res.status(201).json(newSite); // 返回新创建的网站信息
  } catch (error) {
    res.status(400).json({ message: error.message }); // 错误处理
  }
});

// 8. 删除网站（只有管理员可以删除）
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

    // 查找站点
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: '网站不存在' });
    }

    // 删除站点
    await Site.findByIdAndDelete(req.params.id);
    res.json({ message: '网站已删除' }); // 返回删除成功的消息
  } catch (error) {
    console.error('删除网站错误:', error);
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 9. 记录网站点击
router.post('/:id/click', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);

    // 更新点击数
    site.stats.clicks += 1;

    // 更新访问统计（总访问量加 1）
    site.stats.views.total += 1;

    // 检查是否需要重置每日统计
    const now = new Date();
    const lastReset = new Date(site.stats.views.lastReset);
    if (now.getDate() !== lastReset.getDate()) {
      site.stats.views.daily = 1; // 如果是新的一天，重置每日访问量
      site.stats.views.lastReset = now; // 更新重置时间
    } else {
      site.stats.views.daily += 1; // 如果是同一天，增加每日访问量
    }

    // 保存更新后的站点信息
    await site.save();
    res.json(site); // 返回更新后的站点信息
  } catch (error) {
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 10. 添加网站评分
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;

    // 验证评分范围（1 到 5 分之间）
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: '评分必须在1-5之间' });
    }

    const site = await Site.findById(req.params.id);

    // 更新评分
    site.rating.total += rating; // 累计评分
    site.rating.count += 1; // 增加评分次数
    site.rating.average = site.rating.total / site.rating.count; // 重新计算平均评分

    // 保存更新后的站点信息
    await site.save();
    res.json({
      message: '评分成功',
      rating: site.rating // 返回更新后的评分信息
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 11. 获取网站评分
router.get('/:id/rating', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    res.json(site.rating); // 返回网站评分信息
  } catch (error) {
    res.status(500).json({ message: error.message }); // 错误处理
  }
});

// 导出路由模块
module.exports = router;
