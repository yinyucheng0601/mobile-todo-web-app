# 移动待办事项应用

一个专为移动设备设计的现代待办事项 Web 应用，支持离线使用和 PWA 安装。

## 功能特性

- 📱 **移动优先设计** - 专为手机屏幕优化
- 🎨 **现代化界面** - 渐变色彩、圆角设计、流畅动画
- 📝 **任务管理** - 添加、编辑、删除、标记完成
- 🏷️ **分类管理** - 工作、个人、购物等分类
- 💾 **本地存储** - 数据保存在浏览器本地
- 📱 **PWA 支持** - 可安装到手机主屏幕
- 🌙 **暗色模式** - 自动跟随系统主题
- 📊 **任务统计** - 实时显示任务完成情况
- ✨ **触摸优化** - 长按删除、震动反馈
- 📝 **快速笔记** - 内置简单笔记功能

## 技术栈

- HTML5
- CSS3 (Flexbox, Grid, CSS Variables)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- PWA (Service Worker, Web App Manifest)

## 使用方法

### 在线访问
直接访问部署后的 URL 即可使用。

### 本地运行
1. 克隆仓库
2. 使用任何 HTTP 服务器运行（如 Python、Node.js 等）
3. 在浏览器中打开 `index.html`

### 安装到手机
1. 在手机浏览器中打开应用
2. 点击分享按钮 → "添加到主屏幕"
3. 应用将像原生应用一样运行

## 项目结构

```
mobile-web-app/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js             # 主逻辑
├── manifest.json      # PWA 配置文件
├── README.md          # 说明文档
└── (未来可添加)
    ├── service-worker.js  # 离线支持
    ├── icons/            # 应用图标
    └── assets/           # 静态资源
```

## 开发说明

### 添加新功能
1. 在 `app.js` 中添加新功能逻辑
2. 在 `styles.css` 中添加对应样式
3. 在 `index.html` 中添加必要的 HTML 结构

### 数据存储
- 任务数据：`localStorage.mobile-todo-tasks`
- 笔记数据：`localStorage.mobile-todo-notes`

### 响应式设计
- 480px 以下：单列布局
- 480px 以上：优化布局
- 支持横屏和竖屏

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- 所有现代移动浏览器

## 未来计划

- [ ] 云同步功能
- [ ] 任务提醒通知
- [ ] 数据导出/导入
- [ ] 多语言支持
- [ ] 主题自定义
- [ ] 任务分享功能

## 许可证

MIT License - 自由使用和修改

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**提示**：这是一个纯前端应用，无需后端服务器即可运行。所有数据保存在用户本地浏览器中。