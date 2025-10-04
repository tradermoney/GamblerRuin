# 赌徒破产模拟器 (GamblerRuin)

**🌐 [English Documentation](README.md)**

**🎰 在线演示: https://tradermoney.github.io/GamblerRuin/**

一个交互式的赌徒破产问题仿真系统，使用 React + TypeScript + Vite 构建。

## 🎯 项目简介

赌徒破产模拟器是一个用于模拟和分析经典赌徒破产问题的交互式工具。用户可以设置不同的参数（初始资金、目标资金、胜率、赔率等），观察在不同投注策略下的破产概率和资金变化趋势。

## ✨ 主要功能

- **参数配置**：灵活的模拟参数设置，支持16+个可配置选项
- **实时仿真**：支持单次和批量模拟
- **可视化分析**：基于图表的资金变化趋势可视化
- **数据导出**：支持CSV和JSON格式导出模拟数据
- **响应式设计**：适配各种设备屏幕尺寸
- **持久化存储**：使用IndexedDB保存配置
- **性能指标**：实时性能监控和优化
- **交互式图表**：使用Recharts库实现动态可视化

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
- **构建工具**：Vite (rolldown-vite 7.1.12)
- **状态管理**：Zustand
- **图表库**：Recharts
- **样式方案**：CSS Modules
- **测试框架**：Playwright
- **路由管理**：React Router DOM
- **部署平台**：GitHub Pages
- **随机数生成**：seedrandom
- **文件导出**：file-saver

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── ConfigPanel.tsx       # 配置面板
│   ├── ControlPanel.tsx      # 控制面板（16个参数）
│   ├── SimulationDisplay.tsx # 模拟展示
│   ├── VisualizationPanel.tsx # 可视化面板
│   ├── DataExportPanel.tsx   # 数据导出面板
│   ├── PerformanceMetrics.tsx # 性能监控
│   ├── TimelineChart.tsx     # 时间线图表组件
│   ├── StateTransitionGraph.tsx # 状态转换图
│   ├── FormulaExplanation.tsx # 数学公式解释
│   ├── Navbar.tsx           # 导航栏
│   ├── Tooltip.tsx          # 自定义提示框组件
│   └── HelpIcon.tsx         # 帮助图标组件
├── pages/              # 页面组件
│   ├── Introduction.tsx     # 介绍页面
│   └── Simulator.tsx        # 模拟器页面
├── hooks/              # 自定义React Hooks
├── store/              # 状态管理（Zustand）
│   └── simulationStore.ts   # 模拟状态存储
├── utils/              # 工具函数
└── types/              # TypeScript类型定义
```

## 🎮 使用说明

### 1. 参数配置

**基础参数**：
- **初始资金**：开始时的资金数量
- **目标资金**：希望达到的资金目标
- **最大轮数**：最多进行多少轮投注
- **单轮赌注**：每次投注的金额
- **单轮胜率**：每次投注获胜的概率（0-1）
- **单轮赔率**：获胜时的赔率倍数（如2表示翻倍）

**高级参数**：
- **投注策略**：
  - 固定金额：每次投注固定金额
  - 比例投注：按当前资金的一定比例投注
- **投注比例**：比例策略下，投注资金的百分比
- **批量模拟次数**：批量模式下运行的模拟次数
- **随机种子**：可选的随机种子，用于可重现的结果
- **显示间隔**：可视化更新频率（毫秒）

### 2. 运行模拟

- **单次模拟**：观察一次完整的资金变化轨迹
- **批量模拟**：进行多次模拟并查看统计分析
- **暂停/继续**：控制模拟执行
- **重置**：清除当前结果并重新开始

### 3. 查看结果

- **实时图表**：动态显示资金变化
- **统计信息**：查看破产概率、平均轮数等指标
- **性能指标**：监控模拟性能和优化统计
- **数据导出**：导出模拟结果进行进一步分析

## 🔧 开发指南

### 环境要求

- Node.js 18+
- npm 或 yarn

### 代码质量

运行 ESLint 进行代码检查：

```bash
npm run lint
```

### 测试

项目使用 Playwright 进行端到端测试：

```bash
# 运行测试
npx playwright test

# 查看测试报告
npx playwright show-report
```

## 📊 性能优化

- **代码分割**：使用动态导入优化加载性能
- **资源压缩**：生产环境自动压缩CSS和JS
- **缓存策略**：智能资源缓存
- **响应式设计**：针对各种设备尺寸优化
- **虚拟DOM**：React 19 并发特性
- **Web Workers**：离线重计算（计划中）

## 🌐 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 更新日志

### 最新更新
- 移除国际化基础设施，使用简体中文界面
- 使用 React Portal 实现修复提示框定位问题
- 优化控制面板布局为4列网格，支持16个参数
- 添加性能指标监控
- 添加状态转换图和公式解释
- 在导航栏实现 GitHub 链接
- 增强数据导出功能

### v1.0.0
- 初始版本发布
- 基础模拟功能
- 可视化图表
- 数据导出功能
- 响应式设计

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
- [Vite](https://vitejs.dev/) - 构建工具和开发服务器
- [Recharts](https://recharts.org/) - React 图表库
- [Zustand](https://zustand-demo.pmnd.rs/) - 轻量级状态管理
- [Playwright](https://playwright.dev/) - 端到端测试框架

## 📞 联系方式

如有问题或建议，请：

- 提交 [Issue](https://github.com/tradermoney/GamblerRuin/issues)
- 访问 [GitHub 仓库](https://github.com/tradermoney/GamblerRuin)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
