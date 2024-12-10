// 引入 axios 模块用于发送 HTTP 请求
const axios = require('axios');
// 引入 Site 模型用于与数据库交互，获取网站信息
const Site = require('../models/Site');

// 定义一个检查网站健康状态的异步函数
async function checkSiteHealth() {
  // 从数据库中获取所有状态为 'active' 的网站
  const sites = await Site.find({ status: 'active' });
  
  // 初始化结果对象，用于记录网站检查的统计信息
  const results = {
    total: sites.length,      // 总网站数
    accessible: 0,            // 可访问网站数
    inaccessible: 0,          // 不可访问网站数
    updated: []               // 存储已更新的网站状态信息
  };

  // 遍历每个网站，进行健康检查
  for (const site of sites) {
    try {
      // 记录请求开始时间
      const startTime = Date.now();

      // 使用 axios 发送 GET 请求，检查网站的健康状况
      const response = await axios.get(site.url, {
        timeout: 10000,         // 设置超时时间为 10 秒
        validateStatus: false   // 允许任何 HTTP 状态码（默认 2xx 状态码才会被认为成功）
      });

      // 计算响应时间
      const responseTime = Date.now() - startTime;

      // 准备更新的站点信息
      const updates = {
        isAccessible: response.status >= 200 && response.status < 400, // 判断网站是否可访问（2xx-3xx 为正常响应）
        lastChecked: new Date(), // 更新最近检查的时间
        lastStatusCode: response.status, // 存储最后的 HTTP 状态码
        responseTime: responseTime // 存储响应时间
      };

      // 如果网站不可访问并且原状态为 'active'，将其状态更新为 'inactive'
      if (!updates.isAccessible && site.status === 'active') {
        updates.status = 'inactive';
      }

      // 更新数据库中的站点信息
      await Site.findByIdAndUpdate(site._id, updates);

      // 根据网站的可访问性更新统计信息
      results[updates.isAccessible ? 'accessible' : 'inaccessible']++;
      results.updated.push({
        url: site.url,           // 网站的 URL
        status: response.status, // HTTP 状态码
        responseTime             // 响应时间
      });
    } catch (error) {
      // 如果请求失败，更新网站的状态为 'inactive'
      await Site.findByIdAndUpdate(site._id, {
        isAccessible: false,     // 标记为不可访问
        lastChecked: new Date(), // 更新最近检查的时间
        lastStatusCode: 0,       // 设置状态码为 0（表示请求失败）
        status: 'inactive'       // 将网站状态设为 'inactive'
      });

      // 记录不可访问的网站统计信息
      results.inaccessible++;
      results.updated.push({
        url: site.url,           // 网站的 URL
        error: error.message     // 错误信息
      });
    }
  }

  // 返回健康检查的结果
  return results;
}

// 导出 checkSiteHealth 函数
module.exports = checkSiteHealth;
