// 引入 node-cron 模块，用于定时任务调度
const cron = require('node-cron');
// 引入站点健康检查模块，假设该模块包含健康检查的具体实现
const checkSiteHealth = require('./siteChecker');

// 定义一个函数，启动定时健康检查
const startHealthCheck = () => {
  // 使用 cron 模块的 schedule 方法，定义一个定时任务
  // '0 */6 * * *' 表示每 6 小时执行一次任务（在每个 6 小时的整点触发）
  cron.schedule('0 */6 * * *', async () => {
    console.log('开始网站健康检查...'); // 输出开始健康检查的消息

    try {
      // 调用健康检查的函数（假设 checkSiteHealth 会检查多个网站的健康状态）
      await checkSiteHealth(); 
      console.log('健康检查完成'); // 健康检查成功完成后，打印提示信息
    } catch (error) {
      // 捕获并处理健康检查中可能发生的错误
      console.error('健康检查失败:', error); // 打印错误信息
    }
  });
};

// 导出 startHealthCheck 函数，以便在其他地方使用
module.exports = startHealthCheck;
