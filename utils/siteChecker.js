const axios = require('axios');
const Site = require('../models/Site');

async function checkSiteHealth() {
  const sites = await Site.find({ status: 'active' });
  const results = {
    total: sites.length,
    accessible: 0,
    inaccessible: 0,
    updated: []
  };

  for (const site of sites) {
    try {
      const startTime = Date.now();
      const response = await axios.get(site.url, {
        timeout: 10000,
        validateStatus: false // 允许任何状态码
      });
      const responseTime = Date.now() - startTime;

      const updates = {
        isAccessible: response.status >= 200 && response.status < 400,
        lastChecked: new Date(),
        lastStatusCode: response.status,
        responseTime: responseTime
      };

      if (!updates.isAccessible && site.status === 'active') {
        updates.status = 'inactive';
      }

      await Site.findByIdAndUpdate(site._id, updates);

      results[updates.isAccessible ? 'accessible' : 'inaccessible']++;
      results.updated.push({
        url: site.url,
        status: response.status,
        responseTime
      });
    } catch (error) {
      await Site.findByIdAndUpdate(site._id, {
        isAccessible: false,
        lastChecked: new Date(),
        lastStatusCode: 0,
        status: 'inactive'
      });
      results.inaccessible++;
      results.updated.push({
        url: site.url,
        error: error.message
      });
    }
  }

  return results;
}

module.exports = checkSiteHealth; 