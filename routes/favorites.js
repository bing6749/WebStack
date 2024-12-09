const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Site = require('../models/Site');
const { auth } = require('../middleware/auth');

// 获取用户收藏的网站
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 添加收藏
router.post('/:siteId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const siteId = req.params.siteId;

    if (user.favorites.includes(siteId)) {
      return res.status(400).json({ message: '该网站已在收藏列表中' });
    }

    user.favorites.push(siteId);
    await user.save();
    res.json({ message: '收藏成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 取消收藏
router.delete('/:siteId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const siteId = req.params.siteId;

    user.favorites = user.favorites.filter(id => id.toString() !== siteId);
    await user.save();
    res.json({ message: '已取消收藏' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 