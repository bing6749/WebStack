// 引入 Express 和路由模块
const express = require('express');
const router = express.Router();
// 引入 User 和 Site 模型
const User = require('../models/User');
const Site = require('../models/Site');
// 引入认证中间件
const { auth } = require('../middleware/auth');

// 获取用户收藏的网站
router.get('/', auth, async (req, res) => {
  try {
    // 根据用户 ID 查询用户信息，并填充收藏的站点信息
    const user = await User.findById(req.user.userId).populate('favorites');
    // 返回用户的收藏站点列表
    res.json(user.favorites);
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 添加收藏
router.post('/:siteId', auth, async (req, res) => {
  try {
    // 根据用户 ID 查询用户信息
    const user = await User.findById(req.user.userId);
    const siteId = req.params.siteId; // 获取站点 ID

    // 检查站点是否已经在收藏列表中
    if (user.favorites.includes(siteId)) {
      return res.status(400).json({ message: '该网站已在收藏列表中' });
    }

    // 将站点 ID 添加到用户的收藏列表
    user.favorites.push(siteId);
    await user.save(); // 保存更新后的用户信息
    res.json({ message: '收藏成功' });
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 取消收藏
router.delete('/:siteId', auth, async (req, res) => {
  try {
    // 根据用户 ID 查询用户信息
    const user = await User.findById(req.user.userId);
    const siteId = req.params.siteId; // 获取站点 ID

    // 从收藏列表中移除对应的站点 ID
    user.favorites = user.favorites.filter(id => id.toString() !== siteId);
    await user.save(); // 保存更新后的用户信息
    res.json({ message: '已取消收藏' });
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 导出路由模块以供其他文件使用
module.exports = router;
