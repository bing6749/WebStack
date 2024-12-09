const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort('order');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 添加分类
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    icon: req.body.icon,
    order: req.body.order
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: '分类已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 