# Intellecta 仪表板

基于 shadcn-vue 组件库构建的现代化生产力仪表板，参考了 Intellecta 的设计风格。

## 功能特性

- 🎨 现代化的 UI 设计
- 📱 响应式布局
- 🌙 主题切换支持
- 🤖 虚拟助手聊天界面
- 📊 活动时间线
- ✅ 待办事项管理
- 📈 性能数据可视化

## 技术栈

- Vue 3
- Vite
- Tailwind CSS
- shadcn-vue 组件库
- Lucide Vue 图标库

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 项目结构

```
src/
├── components/
│   ├── ui/           # 基础 UI 组件
│   ├── layout/       # 布局组件
│   └── dashboard/    # 仪表板功能组件
├── views/            # 页面组件
├── router/           # 路由配置
└── utils/            # 工具函数
```

## 组件说明

### 布局组件
- `Sidebar.vue` - 左侧导航栏
- `Header.vue` - 顶部导航栏

### 仪表板组件
- `Greeting.vue` - 问候语和生产力指标
- `VirtualAssistant.vue` - 虚拟助手聊天界面
- `ActivityTimeline.vue` - 活动时间线
- `TodoList.vue` - 待办事项列表
- `PerformanceSummary.vue` - 性能数据总结

### UI 组件
基于 shadcn-vue 设计系统的基础组件：
- Button, Card, Input, Badge 等

## 自定义

你可以通过修改 Tailwind CSS 配置和组件样式来自定义外观。所有组件都支持通过 props 和 CSS 类进行定制。
