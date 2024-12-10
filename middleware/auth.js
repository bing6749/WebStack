// 引入 jsonwebtoken 库，用于生成和验证 JSON Web Token（JWT）
const jwt = require('jsonwebtoken');

// 定义用户认证中间件 auth，验证用户的 JWT
const auth = (req, res, next) => {
  try {
    // 从请求头的 Authorization 字段中获取 JWT
    // 并移除 'Bearer ' 前缀，获取实际的 Token 字符串
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // 使用 jsonwebtoken 的 verify 方法验证 Token 的合法性
    // process.env.JWT_SECRET 是用于验证的密钥
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 将解码后的用户信息存储到 req.user 中，供后续中间件或路由使用
    req.user = decoded;
    
    // 调用 next() 表示认证通过，继续执行后续中间件或路由处理
    next();
  } catch (error) {
    // 如果验证失败，返回 401 状态码，提示用户未登录
    res.status(401).json({ message: '请先登录' });
  }
};

// 定义管理员权限认证中间件 adminAuth，确保用户具备管理员权限
const adminAuth = (req, res, next) => {
  // 检查 req.user 中的角色信息是否为 'admin'
  if (req.user.role !== 'admin') {
    // 如果用户不是管理员，返回 403 状态码，提示需要管理员权限
    return res.status(403).json({ message: '需要管理员权限' });
  }
  
  // 如果是管理员，调用 next()，继续执行后续中间件或路由处理
  next();
};

// 导出 auth 和 adminAuth 中间件，以便在其他模块中使用
module.exports = { auth, adminAuth };
