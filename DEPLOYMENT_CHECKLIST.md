# GitHub Pages 部署检查清单

## ✅ 部署前检查

### 1. 配置文件检查
- [x] `vite.config.ts` - 已设置 `base: '/GamblerRuin/'`
- [x] `package.json` - 已添加部署脚本和gh-pages依赖
- [x] `.github/workflows/deploy.yml` - GitHub Actions工作流已创建
- [x] `public/404.html` - SPA路由重定向文件已创建
- [x] `public/.nojekyll` - Jekyll禁用文件已创建

### 2. 构建测试
- [x] `npm run build` - 构建成功
- [x] `npm run preview:github` - GitHub Pages预览正常
- [x] 资源路径正确 - 所有资源都使用 `/GamblerRuin/` 前缀

### 3. 代码质量
- [x] TypeScript编译无错误
- [x] ESLint检查通过
- [x] 所有依赖已安装

## 🚀 部署步骤

### 方式一：GitHub Actions（推荐）

1. **推送代码到GitHub**：
   ```bash
   git add .
   git commit -m "feat: 配置GitHub Pages部署"
   git push origin main
   ```

2. **启用GitHub Pages**：
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 等待部署完成

3. **验证部署**：
   - 访问 `https://[用户名].github.io/GamblerRuin/`
   - 检查所有功能是否正常

### 方式二：手动部署

1. **构建项目**：
   ```bash
   npm run build
   ```

2. **部署到GitHub Pages**：
   ```bash
   npm run deploy
   ```

3. **验证部署**：
   - 访问 `https://[用户名].github.io/GamblerRuin/`
   - 检查所有功能是否正常

## 🔍 部署后验证

### 功能测试
- [ ] 页面正常加载
- [ ] 所有资源（CSS、JS、图片）正确加载
- [ ] 配置面板功能正常
- [ ] 模拟功能正常
- [ ] 图表显示正常
- [ ] 数据导出功能正常
- [ ] 多语言切换正常
- [ ] 响应式布局正常

### 路由测试
- [ ] 直接访问根路径正常
- [ ] 刷新页面不会出现404
- [ ] 浏览器前进/后退按钮正常

### 性能测试
- [ ] 页面加载速度正常
- [ ] 资源压缩效果良好
- [ ] 移动端性能正常

## 🐛 常见问题解决

### 问题1：页面显示空白
**原因**：资源路径配置错误
**解决**：检查 `vite.config.ts` 中的 `base` 配置

### 问题2：路由不工作
**原因**：404.html文件缺失或配置错误
**解决**：确保 `public/404.html` 文件存在且内容正确

### 问题3：样式不加载
**原因**：CSS文件路径错误
**解决**：检查构建后的HTML文件中的CSS链接

### 问题4：GitHub Actions部署失败
**原因**：权限配置或工作流配置错误
**解决**：
1. 检查仓库Settings → Actions → General中的权限设置
2. 确保工作流文件语法正确
3. 检查Node.js版本配置

## 📊 部署状态监控

### GitHub Actions
- 查看 Actions 标签页了解部署状态
- 检查构建日志排查问题

### GitHub Pages
- 在 Settings → Pages 中查看部署状态
- 检查自定义域名配置（如有）

## 🔄 更新部署

每次代码更新后：
1. 推送代码到main分支
2. GitHub Actions会自动触发部署
3. 等待部署完成
4. 验证新功能是否正常

## 📝 部署记录

| 版本 | 部署时间 | 部署方式 | 状态 | 备注 |
|------|----------|----------|------|------|
| v1.0.0 | 2024-01-XX | GitHub Actions | ✅ 成功 | 初始部署 |

---

**注意**：部署完成后，建议在多个浏览器和设备上测试，确保兼容性。

