# 部署说明

## GitHub Pages 部署

### 自动部署（推荐）
1. 进入 GitHub 仓库设置
2. 找到 "Pages" 或 "GitHub Pages" 选项
3. 选择部署分支（master/main）
4. 选择部署文件夹（/ (root)）
5. 保存后等待几分钟，访问生成的 URL

### 手动部署
如果需要自定义域名或更多控制：
1. 在仓库根目录创建 `.nojekyll` 文件（防止 Jekyll 处理）
2. 确保所有文件路径正确
3. 推送到 master 分支

## 本地测试

### 使用 Python 简单服务器
```bash
cd /Users/yin/Projects/mobile-web-app
python3 -m http.server 8000
```
访问：http://localhost:8000

### 使用 Node.js 服务器
```bash
cd /Users/yin/Projects/mobile-web-app
npx serve .
```

## 手机测试

### 二维码访问
1. 使用 GitHub Pages URL
2. 生成二维码让手机扫描
3. 在手机浏览器中打开

### 本地网络访问
1. 确保电脑和手机在同一 WiFi
2. 获取电脑的本地 IP 地址
3. 在手机浏览器访问：http://[电脑IP]:8000

## PWA 安装

### iOS (Safari)
1. 在 Safari 中打开应用
2. 点击分享按钮
3. 选择"添加到主屏幕"
4. 自定义名称后确认

### Android (Chrome)
1. 在 Chrome 中打开应用
2. 点击菜单（三个点）
3. 选择"添加到主屏幕"
4. 确认安装

## 自定义配置

### 修改应用信息
- `manifest.json` - PWA 配置
- `index.html` - 页面标题和元数据
- `styles.css` - 颜色和样式变量

### 添加功能
1. 在 `app.js` 中添加新功能
2. 在 `styles.css` 中添加样式
3. 在 `index.html` 中添加 HTML 结构

## 故障排除

### 问题：GitHub Pages 不更新
- 检查仓库设置中的 Pages 配置
- 确保推送到正确的分支
- 等待 GitHub 的缓存更新（最多10分钟）

### 问题：PWA 安装失败
- 确保通过 HTTPS 访问
- 检查 `manifest.json` 格式
- 验证图标文件存在

### 问题：本地存储不工作
- 检查浏览器是否允许本地存储
- 清除浏览器缓存后重试
- 确保使用现代浏览器

## 项目链接

- GitHub 仓库：https://github.com/yinyucheng0601/mobile-todo-web-app
- 预览页面：https://yinyucheng0601.github.io/mobile-todo-web-app/preview.html
- 主应用：https://yinyucheng0601.github.io/mobile-todo-web-app/

## 后续步骤

1. 启用 GitHub Pages
2. 测试手机访问
3. 添加更多功能（如云同步）
4. 优化性能
5. 添加分析统计