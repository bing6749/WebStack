const cron = require('node-cron');
const checkSiteHealth = require('./siteChecker');

// 每6小时运行一次健康检查
const startHealthCheck = () => {
  cron.schedule('0 */6 * * *', async () => {
    console.log('开始网站健康检查...');
    try {
      await checkSiteHealth();
      console.log('健康检查完成');
    } catch (error) {
      console.error('健康检查失败:', error);
    }
  });
};

module.exports = startHealthCheck; 