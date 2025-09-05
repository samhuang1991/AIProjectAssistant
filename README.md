# AI智能体项目管理助手

一个基于React和Dify的智能项目管理助手，通过对话式操作和主动式预警，将项目管理从"人找信息"转变为"信息找人"的主动模式。

## 功能特性

### 🎯 核心功能
- **仪表板**: 项目概览、关键指标、数据可视化
- **任务管理**: 对话式创建和管理Jira任务，支持增删改查
- **风险预警**: 主动推送风险信息，多维度风险分析
- **健康报告**: 自然语言查询项目健康状况
- **AI助手**: 智能对话式项目管理交互

### 🛠️ 技术栈
- React 18 + Vite
- Tailwind CSS
- Recharts (数据可视化)
- Lucide React (图标)
- Axios (HTTP客户端)
- Dify API集成

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置Dify API

编辑 `src/services/difyApi.js` 文件，配置您的Dify API：

```javascript
// Dify API 配置
const DIFY_BASE_URL = 'https://api.dify.ai/v1'; // 或您的自部署地址
const DIFY_API_KEY = 'your-actual-api-key';     // 您的实际API密钥
```

#### 获取Dify API密钥的步骤：
1. 登录您的Dify控制台
2. 选择或创建一个应用
3. 在应用设置中找到"API密钥"部分
4. 复制API密钥并替换上述配置中的 `your-actual-api-key`

#### Dify工作流配置建议：
为了最佳体验，建议在Dify中创建以下工作流：

1. **任务管理工作流**
   - 输入参数：`action`, `task_data`, `task_id`, `update_data`
   - 支持操作：创建任务、查询任务、更新任务、删除任务

2. **风险预警工作流**
   - 输入参数：`action`, `project_id`
   - 输出：风险列表、风险评估报告

3. **健康报告工作流**
   - 输入参数：`query`
   - 输出：项目健康数据、分析结果

4. **聊天助手工作流**
   - 使用Dify的对话应用类型
   - 集成上下文理解和项目管理知识库

### 3. 启动开发服务器
```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 4. 构建生产版本
```bash
npm run build
```

## API集成说明

### 当前状态
- ✅ 完整的前端界面和交互
- ✅ Dify API服务层封装
- ✅ 错误处理和用户反馈
- ⚠️ 需要配置真实的Dify API密钥

### API响应处理
应用会智能处理不同的API响应情况：
- **成功响应**: 显示Dify工作流的实际输出
- **配置错误**: 提示用户检查API配置
- **网络错误**: 显示网络连接问题提示
- **其他错误**: 显示具体错误信息

### 调试API连接
1. 打开浏览器开发者工具
2. 查看Console标签页的日志输出
3. 查看Network标签页的API请求详情
4. 根据错误信息调整配置

## 项目结构

```
src/
├── components/          # 公共组件
│   └── Layout.jsx      # 主布局组件
├── pages/              # 页面组件
│   ├── Dashboard.jsx   # 仪表板
│   ├── TaskManagement.jsx  # 任务管理
│   ├── RiskAlerts.jsx  # 风险预警
│   ├── HealthReports.jsx   # 健康报告
│   └── ChatAssistant.jsx   # AI助手
├── services/           # API服务
│   └── difyApi.js     # Dify API集成
├── App.jsx            # 主应用组件
├── main.jsx           # 应用入口
└── index.css          # 全局样式
```

## 使用指南

### AI助手对话
- 支持自然语言交互
- 提供快捷功能入口
- 智能上下文理解
- 对话历史管理

### 任务管理
- 创建、编辑、删除任务
- 任务状态流转
- 智能搜索和过滤
- 批量操作支持

### 风险监控
- 实时风险预警
- 多维度风险分析
- 自动生成评估报告
- 风险趋势追踪

### 数据分析
- 项目健康度评估
- 团队效能分析
- 自然语言查询
- 可视化报表

## 故障排除

### 常见问题

1. **API连接失败**
   - 检查DIFY_BASE_URL是否正确
   - 确认DIFY_API_KEY是否有效
   - 验证网络连接

2. **工作流响应异常**
   - 检查Dify工作流配置
   - 确认输入参数格式
   - 查看Dify控制台日志

3. **页面显示异常**
   - 清除浏览器缓存
   - 检查控制台错误信息
   - 重启开发服务器

### 获取帮助
- 查看浏览器控制台日志
- 检查Dify应用运行状态
- 参考Dify官方文档

## 许可证

MIT License