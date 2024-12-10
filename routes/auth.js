// 引入 Express 和路由模块
const express = require('express');
const router = express.Router();
// 引入用户模型
const User = require('../models/User');
// 引入 JWT（用于生成和验证 token）
const jwt = require('jsonwebtoken');
// 引入 bcrypt（用于密码加密和验证）
const bcrypt = require('bcryptjs');

// 用户注册接口
router.post('/register', async (req, res) => {
  try {
    // 创建新的用户实例
    const user = new User({
      username: req.body.username, // 从请求体中获取用户名
      email: req.body.email,       // 从请求体中获取邮箱
      password: req.body.password  // 从请求体中获取密码
    });

    // 保存用户到数据库
    await user.save();

    // 返回成功状态码和提示信息
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    // 捕获错误，返回 400 状态码和错误信息
    res.status(400).json({ message: error.message });
  }
});

// 用户登录接口
router.post('/login', async (req, res) => {
  try {
    // 查找数据库中与请求邮箱匹配的用户
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // 如果用户不存在，返回 400 状态码和错误提示
      return res.status(400).json({ message: '用户不存在' });
    }

    // 验证密码是否正确
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      // 如果密码错误，返回 400 状态码和错误提示
      return res.status(400).json({ message: '密码错误' });
    }

    // 生成 JSON Web Token，包含用户 ID 和角色信息
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // token 的载荷
      process.env.JWT_SECRET,                // 加密的密钥
      { expiresIn: '24h' }                   // 设置 token 的有效期为 24 小时
    );

    // 返回 token 和用户基本信息
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 升级为管理员（仅用于初始化管理员）
router.post('/make-admin', async (req, res) => {
  try {
    const { email, adminSecret } = req.body; // 从请求体中获取邮箱和管理员密钥

    // 验证管理员密钥是否正确
    if (adminSecret !== process.env.ADMIN_SECRET) {
      // 如果密钥无效，返回 403 状态码和错误提示
      return res.status(403).json({ message: '无效的管理员密钥' });
    }

    // 查找用户并将其角色更新为 'admin'
    const user = await User.findOneAndUpdate(
      { email },          // 根据邮箱查找用户
      { role: 'admin' },  // 更新角色为 'admin'
      { new: true }       // 返回更新后的用户数据
    );

    if (!user) {
      // 如果用户不存在，返回 404 状态码和错误提示
      return res.status(404).json({ message: '用户不存在' });
    }

    // 返回成功提示和更新后的用户信息
    res.json({ message: '已升级为管理员', user });
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 导出路由模块以供其他文件使用
module.exports = router;
