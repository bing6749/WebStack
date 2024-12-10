// 引入 Express 和路由模块
const express = require('express');
const router = express.Router();
// 引入分类模型
const Category = require('../models/Category');

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    // 查询状态为 'active' 的分类，并按照 'order' 字段排序
    const categories = await Category.find({ status: 'active' }).sort('order');
    // 返回查询结果
    res.json(categories);
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 添加分类
router.post('/', async (req, res) => {
  // 根据请求体数据创建分类实例
  const category = new Category({
    name: req.body.name,          // 分类名称
    description: req.body.description, // 分类描述
    icon: req.body.icon,          // 分类图标
    order: req.body.order         // 分类排序
  });

  try {
    // 保存分类到数据库
    const newCategory = await category.save();
    // 返回成功状态码 201 和新增分类数据
    res.status(201).json(newCategory);
  } catch (error) {
    // 捕获错误，返回 400 状态码和错误信息
    res.status(400).json({ message: error.message });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    // 根据分类 ID 更新对应数据
    const category = await Category.findByIdAndUpdate(
      req.params.id,  // 分类 ID
      req.body,       // 更新数据
      { new: true }   // 返回更新后的分类数据
    );
    // 返回更新后的分类数据
    res.json(category);
  } catch (error) {
    // 捕获错误，返回 400 状态码和错误信息
    res.status(400).json({ message: error.message });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    // 根据分类 ID 删除对应数据
    await Category.findByIdAndDelete(req.params.id);
    // 返回删除成功的提示信息
    res.json({ message: '分类已删除' });
  } catch (error) {
    // 捕获错误，返回 500 状态码和错误信息
    res.status(500).json({ message: error.message });
  }
});

// 导出路由模块以供其他文件使用
module.exports = router;
