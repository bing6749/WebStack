const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 注册
router.post('/register', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    await user.save();
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: '用户不存在' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: '密码错误' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 升级为管理员（仅用于初始化，之后应该移除）
router.post('/make-admin', async (req, res) => {
    try {
        const { email, adminSecret } = req.body;
        
        // 验证管理员密钥
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: '无效的管理员密钥' });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        res.json({ message: '已升级为管理员', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 