# AI智能体项目管理助手

一个基于AI驱动的现代化项目管理平台，通过"对话式操作"与"主动式预警"，将项目管理从"人找信息"的被动模式转变为"信息找人"的主动模式。

## 🎯 项目概述

传统项目管理严重依赖人工操作Jira，流程繁琐、信息割裂。同时，项目风险依赖被动发现，管理模式滞后，常导致进度延期与成本超支。

本智能体通过AI技术，实现：
- **对话式操作**：通过自然语言交互简化任务管理
- **主动式预警**：基于历史数据分析，主动推送风险预警
- **智能分析**：自动生成项目健康报告和风险评估
- **效能提升**：减少团队事务性耗时，提升开发专注度

## ✨ 核心功能

### 📊 智能仪表板
- 项目概览和关键指标实时展示
- 多维度数据可视化图表
- 团队效能和进度趋势分析
- 风险预警统计和即将到期任务提醒

### 📋 任务管理
- 对话式创建和管理Jira任务
- 支持任务的增删改查操作
- 智能搜索和多维度过滤
- 任务状态流转管理
- AI助手辅助任务操作

### ⚠️ 风险预警中心
- 主动推送项目风险信息
- 多类型风险识别（进度延期、资源冲突、质量问题等）
- 风险严重程度智能分级
- 自动生成风险评估报告
- 风险处理状态跟踪

### 📈 项目健康报告
- 自然语言查询项目状态
- 项目组合健康状况分析
- 智能数据可视化展示
- 团队效能指标监控
- 一键导出详细报告

### 🤖 AI智能助手
- 24/7对话式项目管理支持
- 上下文感知的智能建议
- 快捷功能入口和操作指导
- 对话历史管理和导出

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化前端框架
- **Vite** - 快速构建工具
- **React Router** - 单页应用路由管理
- **Tailwind CSS** - 原子化CSS框架
- **Lucide React** - 现代化图标库
- **Recharts** - 数据可视化图表库

### AI集成
- **Dify API** - AI工作流编排平台
- **自然语言处理** - 对话式交互
- **智能分析引擎** - 风险预测和报告生成

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd ai_project3
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置Dify API信息
DIFY_API_URL=your_dify_api_url
DIFY_API_KEY=your_dify_api_key
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 `http://localhost:3000`

### 构建生产版本
```bash
npm run build
npm run preview
```

## 📁 项目结构

```
ai_project3/
├── src/
│   ├── components/          # 公共组件
│   │   └── Layout.jsx       # 主布局组件
│   ├── pages/               # 页面组件
│   │   ├── Dashboard.jsx    # 仪表板
│   │   ├── TaskManagement.jsx # 任务管理
│   │   ├── RiskAlerts.jsx   # 风险预警
│   │   ├── HealthReports.jsx # 健康报告
│   │   └── ChatAssistant.jsx # AI助手
│   ├── services/            # API服务
│   │   └── difyApi.js       # Dify API集成
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 应用入口
│   └── index.css            # 全局样式
├── public/                  # 静态资源
├── package.json             # 项目配置
├── vite.config.js           # Vite配置
├── tailwind.config.js       # Tailwind配置
└── README.md                # 项目文档
```

## 🎨 界面预览

### 仪表板
- 项目概览卡片
- 实时数据图表
- 关键指标监控
- 活动时间线

### 任务管理
- 任务列表视图
- 对话式创建任务
- 状态流转操作
- 智能搜索过滤

### 风险预警
- 风险等级分类
- 预警详情展示
- 处理状态跟踪
- 报告生成功能

### AI助手
- 对话式交互界面
- 快捷操作入口
- 智能建议推荐
- 历史记录管理

## 🔧 配置说明

### Dify API配置

在 `src/services/difyApi.js` 中配置您的Dify API信息：

```javascript
const DIFY_BASE_URL = 'https://api.dify.ai/v1'; // 您的Dify API地址
const DIFY_API_KEY = 'your-dify-api-key';      // 您的API密钥
```

### 工作流配置

确保在Dify平台中创建以下工作流：
- 任务管理工作流
- 风险分析工作流
- 健康报告生成工作流
- 对话助手工作流

## 👥 使用场景

### 开发/测试人员
- 通过对话快速创建和更新Jira任务
- 主动接收关键通知与风险预警
- 提升日常工作效率

### 项目经理
- 每日接收AI主动推送的进度延期、资源冲突等风险预警
- 解决风险发现滞后、管理被动、人工跟进耗时的问题

### 团队高管
- 通过自然语言即时查询项目组合的健康报告
- 解决获取全局视图困难、依赖人工汇报、决策数据延迟的问题

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

## 🙏 致谢

感谢以下开源项目的支持：
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide](https://lucide.dev/)
- [Dify](https://dify.ai/)

---

**让AI赋能项目管理，实现研发效能与交付质量的双重提升！** 🚀