# 赌徒破产模拟器 (GamblerRuin)

一个交互式的赌徒破产问题仿真系统，使用React + TypeScript + Vite构建。

## 🎯 项目简介

赌徒破产模拟器是一个用于模拟和分析赌徒破产问题的交互式工具。用户可以设置不同的参数（初始资金、目标资金、胜率、赔率等），观察在不同策略下的破产概率和资金变化趋势。

## ✨ 主要功能

- **参数配置**：灵活设置模拟参数
- **实时仿真**：支持单次和批量模拟
- **可视化分析**：图表展示资金变化趋势
- **数据导出**：支持CSV和JSON格式导出
- **多语言支持**：中英文界面切换
- **响应式设计**：适配各种设备尺寸
- **持久化存储**：使用IndexedDB保存配置

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### GitHub Pages 部署

#### 方式一：GitHub Actions（推荐）

1. **启用GitHub Pages**：
   - 进入仓库的 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **自动部署**：
   - 推送代码到 `main` 分支
   - GitHub Actions 会自动构建并部署

3. **访问地址**：
   - `https://[用户名].github.io/GamblerRuin/`

#### 方式二：手动部署

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 部署到GitHub Pages
npm run deploy
```

#### 本地预览GitHub Pages版本

```bash
npm run preview:github
```

## 🛠️ 技术栈

- **前端框架**：React 19.1.1
- **开发语言**：TypeScript
- **构建工具**：Vite
- **状态管理**：Zustand
- **图表库**：Recharts
- **样式方案**：CSS Modules
- **测试框架**：Playwright
- **部署平台**：GitHub Pages

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── ConfigPanel.tsx     # 配置面板
│   ├── ControlPanel.tsx    # 控制面板
│   ├── SimulationDisplay.tsx # 模拟展示
│   ├── VisualizationPanel.tsx # 可视化面板
│   ├── DataExportPanel.tsx # 数据导出面板
│   └── Navbar.tsx         # 导航栏
├── hooks/              # 自定义Hooks
├── store/              # 状态管理
├── utils/              # 工具函数
├── types/              # 类型定义
└── i18n/               # 国际化
```

## 🎮 使用说明

1. **设置参数**：
   - 初始资金：开始时的资金数量
   - 目标资金：希望达到的资金目标
   - 单轮赌注：每次投注的金额
   - 单轮胜率：每次投注获胜的概率
   - 单轮赔率：获胜时的赔率倍数

2. **选择策略**：
   - 固定金额：每次投注固定金额
   - 比例投注：按当前资金的一定比例投注

3. **开始模拟**：
   - 单次模拟：观察一次完整的资金变化
   - 批量模拟：进行多次模拟并统计分析

4. **查看结果**：
   - 实时图表显示资金变化
   - 统计信息显示破产概率等数据
   - 支持导出数据进行分析

## 🔧 开发指南

### 环境要求

- Node.js 18+
- npm 或 yarn

### 代码规范

项目使用ESLint进行代码检查：

```bash
npm run lint
```

### 测试

项目使用Playwright进行端到端测试：

```bash
# 运行测试
npx playwright test

# 查看测试报告
npx playwright show-report
```

## 📊 性能优化

- **代码分割**：使用动态导入优化加载性能
- **资源压缩**：生产环境自动压缩CSS和JS
- **缓存策略**：合理设置资源缓存
- **响应式图片**：根据设备选择合适的图片尺寸

## 🌐 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 基础模拟功能
- 可视化图表
- 数据导出功能
- 多语言支持

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 构建工具
- [Recharts](https://recharts.org/) - 图表库
- [Zustand](https://zustand-demo.pmnd.rs/) - 状态管理

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/[用户名]/GamblerRuin/issues)
- 发送邮件至：[邮箱地址]

---

⭐ 如果这个项目对你有帮助，请给它一个星标！