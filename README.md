# Intellecta Dashboard

> 基于 Vue 3 + Vite + Tailwind CSS 构建的现代化生产力仪表板

[![Vue 3](https://img.shields.io/badge/Vue-3.4.0-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

## ✨ 功能特性

### 🎯 核心功能
- **📊 智能仪表板** - 个性化数据概览和生产力分析
- **📅 日程管理** - 完整的日程创建、编辑和跟踪系统
- **👥 群组协作** - 团队协作和成员管理功能
- **🔔 智能通知** - 实时提醒和通知中心
- **🤖 虚拟助手** - AI 驱动的生产力助手

### 🎨 用户体验
- **🌙 深色/浅色主题** - 支持系统主题自动切换
- **📱 响应式设计** - 完美适配桌面端和移动端
- **⚡ 极速加载** - 基于 Vite 的快速开发体验
- **🎭 现代化 UI** - 基于 shadcn-vue 的精美组件库

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
# 克隆项目
git clone <repository-url>
cd intellecta-dashboard

# 安装依赖
npm install
```

### 开发模式
```bash
# 启动开发服务器
npm run dev

# 访问应用
# http://localhost:5173
```

### 生产构建
```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🏗️ 项目架构

### 技术栈
- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5.0
- **样式框架**: Tailwind CSS 3.4
- **组件库**: shadcn-vue + Lucide Vue
- **路由管理**: Vue Router 4
- **状态管理**: VueUse
- **工具库**: clsx, tailwind-merge

### 目录结构
```
src/
├── components/           # 组件库
│   ├── ui/              # 基础 UI 组件
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Input.vue
│   │   └── ...
│   ├── layout/          # 布局组件
│   │   ├── Header.vue
│   │   └── Sidebar.vue
│   ├── dashboard/       # 仪表板组件
│   │   ├── Greeting.vue
│   │   ├── VirtualAssistant.vue
│   │   ├── ActivityTimeline.vue
│   │   ├── TodoList.vue
│   │   └── PerformanceSummary.vue
│   ├── schedule/        # 日程管理组件
│   │   ├── ScheduleModal.vue
│   │   ├── CountdownTimer.vue
│   │   ├── ReminderModal.vue
│   │   └── NotificationService.vue
│   ├── group/           # 群组管理组件
│   │   ├── ScheduleList.vue
│   │   ├── MemberManagement.vue
│   │   ├── FileCenter.vue
│   │   └── ...
│   └── notification/    # 通知组件
│       └── NotificationCenter.vue
├── views/               # 页面视图
│   ├── Dashboard.vue
│   ├── ScheduleManagement.vue
│   ├── ScheduleDetail.vue
│   └── GroupOverview.vue
├── router/              # 路由配置
│   └── index.js
├── utils/               # 工具函数
│   └── cn.js
├── App.vue              # 根组件
├── main.js              # 应用入口
└── style.css            # 全局样式
```

## 🎯 核心组件

### 仪表板组件
| 组件 | 功能 | 特性 |
|------|------|------|
| `Greeting.vue` | 个性化问候 | 时间感知、用户状态 |
| `VirtualAssistant.vue` | AI 助手 | 智能对话、任务建议 |
| `ActivityTimeline.vue` | 活动时间线 | 实时更新、交互式图表 |
| `TodoList.vue` | 待办管理 | 拖拽排序、优先级标记 |
| `PerformanceSummary.vue` | 性能分析 | 数据可视化、趋势分析 |

### 日程管理
| 组件 | 功能 | 特性 |
|------|------|------|
| `ScheduleModal.vue` | 日程编辑 | 表单验证、重复设置 |
| `CountdownTimer.vue` | 倒计时 | 实时更新、声音提醒 |
| `ReminderModal.vue` | 提醒设置 | 多种提醒方式 |
| `NotificationService.vue` | 通知服务 | 浏览器通知、推送 |

### 群组协作
| 组件 | 功能 | 特性 |
|------|------|------|
| `ScheduleList.vue` | 日程列表 | 筛选排序、批量操作 |
| `MemberManagement.vue` | 成员管理 | 权限控制、角色分配 |
| `FileCenter.vue` | 文件中心 | 上传下载、版本管理 |
| `InviteMemberModal.vue` | 成员邀请 | 邮件邀请、链接分享 |

## 🎨 主题定制

### CSS 变量
项目使用 CSS 变量系统，支持动态主题切换：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  /* ... 更多变量 */
}
```

### Tailwind 配置
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... 更多颜色配置
      }
    }
  }
}
```

## 🔧 开发指南

### 添加新组件
1. 在 `src/components/` 下创建组件文件
2. 使用 Composition API 编写组件逻辑
3. 遵循 shadcn-vue 设计规范
4. 添加必要的 TypeScript 类型定义

### 样式规范
- 使用 Tailwind CSS 工具类
- 遵循 BEM 命名规范
- 支持响应式设计
- 保持组件样式独立性

### 代码规范
- 使用 ESLint + Prettier
- 遵循 Vue 3 最佳实践
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

## 📱 浏览器支持

| 浏览器 | 版本要求 |
|--------|----------|
| Chrome | >= 88 |
| Firefox | >= 78 |
| Safari | >= 14 |
| Edge | >= 88 |

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [shadcn-vue](https://www.shadcn-vue.com/) - 可复用的组件库
- [Lucide](https://lucide.dev/) - 精美的图标库

---
