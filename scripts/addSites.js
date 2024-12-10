const axios = require('axios'); // 引入 axios，用于发送 HTTP 请求

// 定义一个网站对象的数组，每个网站包含标题、URL、描述、分类和标签
const sites = [
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
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Mozilla的Web开发文档",
    category: "开发文档",
    tags: ["文档", "Web", "开发"]
  },
  {
    title: "VS Code",
    url: "https://code.visualstudio.com",
    description: "微软开发的代码编辑器",
    category: "开发工具",
    tags: ["编辑器", "IDE", "开发工具"]
  },
  {
    title: "React",
    url: "https://reactjs.org",
    description: "Facebook的JavaScript框架",
    category: "前端框架",
    tags: ["JavaScript", "框架", "前端"]
  },
  {
    title: "Vue.js",
    url: "https://vuejs.org",
    description: "渐进式JavaScript框架",
    category: "前端框架",
    tags: ["JavaScript", "框架", "前端"]
  },
  {
    title: "Node.js",
    url: "https://nodejs.org",
    description: "JavaScript运行时",
    category: "后端技术",
    tags: ["JavaScript", "后端", "运行时"]
  },
  {
    title: "MongoDB",
    url: "https://www.mongodb.com",
    description: "流行的NoSQL数据库",
    category: "数据库",
    tags: ["数据库", "NoSQL", "后端"]
  },
  {
    title: "Docker",
    url: "https://www.docker.com",
    description: "容器化平台",
    category: "开发工具",
    tags: ["容器", "部署", "DevOps"]
  },
  {
    title: "Kubernetes",
    url: "https://kubernetes.io",
    description: "容器编排平台",
    category: "开发工具",
    tags: ["容器", "编排", "DevOps"]
  }
];

// 定义一个异步函数用于批量添加网站数据
async function addSites() {
  try {
    // 遍历 sites 数组，逐个发送 POST 请求将每个网站数据添加到数据库
    for (const site of sites) {
      // 向本地的 API 发送 POST 请求，URL 为 http://localhost:5000/api/sites，数据为 site 对象
      const response = await axios.post('http://localhost:5000/api/sites', site);
      
      // 请求成功后，打印网站标题
      console.log(`Added: ${site.title}`);
    }
    
    // 所有网站都成功添加后，打印成功消息
    console.log('All sites have been added successfully!');
  } catch (error) {
    // 如果请求失败，打印错误信息
    console.error('Error adding sites:', error.message);
  }
}

// 调用 addSites 函数执行批量添加操作
addSites();
