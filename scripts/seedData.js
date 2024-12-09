const axios = require('axios');

const sites = [
  {
    title: "Google",
    url: "https://www.google.com",
    description: "全球最大的搜索引擎",
    category: "搜索引擎",
    tags: ["搜索", "工具"]
  },
  {
    title: "GitHub",
    url: "https://github.com",
    description: "全球最大的代码托管平台",
    category: "开发工具",
    tags: ["代码", "开源", "Git"]
  },
  {
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "全球最大的程序员问答社区",
    category: "开发工具",
    tags: ["问答", "编程", "社区"]
  },
  {
    title: "ChatGPT",
    url: "https://chat.openai.com",
    description: "OpenAI开发的AI聊天助手",
    category: "AI工具",
    tags: ["AI", "聊天", "工具"]
  },
  {
    title: "YouTube",
    url: "https://www.youtube.com",
    description: "全球最大的视频分享平台",
    category: "视频网站",
    tags: ["视频", "娱乐", "教育"]
  },
  {
    title: "Netflix",
    url: "https://www.netflix.com",
    description: "全球流行的流媒体平台",
    category: "视频网站",
    tags: ["视频", "电影", "电视剧"]
  },
  {
    title: "Amazon",
    url: "https://www.amazon.com",
    description: "全球最大的电商平台",
    category: "购物",
    tags: ["购物", "电商"]
  },
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Mozilla的Web技术文档",
    category: "开发文档",
    tags: ["文档", "Web", "开发"]
  },
  {
    title: "LinkedIn",
    url: "https://www.linkedin.com",
    description: "职业社交平台",
    category: "社交网络",
    tags: ["社交", "求职", "职业"]
  },
  {
    title: "Twitter",
    url: "https://twitter.com",
    description: "实时信息分享平台",
    category: "社交网络",
    tags: ["社交", "资讯"]
  }
];

async function seedData() {
  try {
    for (const site of sites) {
      try {
        const response = await axios.post('http://localhost:5000/api/sites', site);
        console.log(`Added: ${site.title}`);
      } catch (error) {
        console.error(`Error adding ${site.title}:`, {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    }
    console.log('Seeding process completed!');
  } catch (error) {
    console.error('Fatal error:', {
      message: error.message,
      stack: error.stack
    });
  }
}

// 添加错误处理
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

seedData(); 