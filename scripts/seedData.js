const axios = require('axios'); // 引入 axios 用于发送 HTTP 请求

// 定义网站信息数组，每个网站包括标题、URL、描述、分类和标签
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

// 定义一个异步函数，用于将网站信息批量添加到数据库
async function seedData() {
  try {
    // 遍历网站数组，逐个发送请求将网站数据添加到数据库
    for (const site of sites) {
      try {
        // 发送 POST 请求到本地 API，向数据库中添加站点数据
        const response = await axios.post('http://localhost:5000/api/sites', site);
        console.log(`Added: ${site.title}`); // 请求成功时，打印成功消息
      } catch (error) {
        // 捕获并打印添加单个网站时的错误信息
        console.error(`Error adding ${site.title}:`, {
          message: error.message, // 错误信息
          response: error.response?.data, // 错误响应数据（如果有）
          status: error.response?.status // 错误的 HTTP 状态码（如果有）
        });
      }
    }
    console.log('Seeding process completed!'); // 所有网站添加完成后，打印完成消息
  } catch (error) {
    // 捕获整个种子过程中的错误
    console.error('Fatal error:', {
      message: error.message, // 错误信息
      stack: error.stack // 错误的堆栈信息
    });
  }
}

// 添加未处理的 promise 拒绝（unhandledRejection）事件处理
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error); // 捕获并打印未处理的拒绝错误
});

// 调用种子数据函数，开始批量添加网站信息
seedData();
