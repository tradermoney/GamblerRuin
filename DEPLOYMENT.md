# GitHub Pages 部署指南

## 部署方式

本项目支持两种部署到GitHub Pages的方式：

### 方式一：GitHub Actions（推荐）

1. **启用GitHub Pages**：
   - 进入仓库的 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **自动部署**：
   - 推送代码到 `main` 分支
   - GitHub Actions 会自动构建并部署

3. **访问地址**：
   - `https://[用户名].github.io/GamblerRuin/`

### 方式二：手动部署

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **构建项目**：
   ```bash
   npm run build
   ```

3. **部署到GitHub Pages**：
   ```bash
   npm run deploy
   ```

## 本地预览GitHub Pages版本

```bash
npm run preview:github
```

## 重要配置说明

### 1. 基础路径配置
- `vite.config.ts` 中设置了 `base: '/GamblerRuin/'`
- 这确保所有资源路径都正确指向GitHub Pages子路径

### 2. 404页面处理
- `public/404.html` 处理SPA路由
- 自动重定向到正确的路径

### 3. Jekyll禁用
- `public/.nojekyll` 文件禁用Jekyll处理
- 确保所有文件都能正确访问

## 故障排除

### 问题1：页面显示空白
- 检查浏览器控制台是否有资源加载错误
- 确认 `base` 路径配置正确

### 问题2：路由不工作
- 确认 `404.html` 文件存在
- 检查GitHub Pages设置中的Source配置

### 问题3：样式不加载
- 检查CSS文件路径
- 确认 `base` 配置包含正确的子路径

## 自定义域名

如果需要使用自定义域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为你的域名，如：`example.com`
3. 在DNS设置中添加CNAME记录指向 `[用户名].github.io`

## 环境变量

生产环境变量可以通过GitHub Actions的Secrets设置：
- 在仓库 Settings → Secrets and variables → Actions 中添加
- 在 `.github/workflows/deploy.yml` 中使用 `${{ secrets.VARIABLE_NAME }}`


