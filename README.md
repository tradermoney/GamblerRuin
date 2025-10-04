# GamblerRuin - Gambler's Ruin Problem Simulator

**🌐 [中文文档](README.zh-CN.md)**

**🎰 Online Demo: https://tradermoney.github.io/GamblerRuin/**

An interactive simulation system for the Gambler's Ruin problem, built with React + TypeScript + Vite.

## 🎯 Project Overview

The Gambler's Ruin Simulator is an interactive tool for simulating and analyzing the classic Gambler's Ruin problem. Users can configure various parameters (initial capital, target capital, win probability, payout odds, etc.) and observe bankruptcy probabilities and capital change trends under different betting strategies.

## ✨ Key Features

- **Parameter Configuration**: Flexible simulation parameter settings with 16+ configurable options
- **Real-time Simulation**: Support for single-run and batch simulations
- **Visual Analysis**: Chart-based visualization of capital changes over time
- **Data Export**: Export simulation data in CSV and JSON formats
- **Responsive Design**: Adapts to various device screen sizes
- **Persistent Storage**: Save configurations using IndexedDB
- **Performance Metrics**: Real-time performance monitoring and optimization
- **Interactive Charts**: Dynamic visualization with Recharts library

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### GitHub Pages Deployment

#### Method 1: GitHub Actions (Recommended)

1. **Enable GitHub Pages**:
   - Navigate to repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Automatic Deployment**:
   - Push code to `main` branch
   - GitHub Actions will automatically build and deploy

3. **Access URL**:
   - `https://[username].github.io/GamblerRuin/`

#### Method 2: Manual Deployment

```bash
# Install dependencies
npm install

# Build project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

#### Preview GitHub Pages Version Locally

```bash
npm run preview:github
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Programming Language**: TypeScript
- **Build Tool**: Vite (rolldown-vite 7.1.12)
- **State Management**: Zustand
- **Charting Library**: Recharts
- **Styling**: CSS Modules
- **Testing Framework**: Playwright
- **Router**: React Router DOM
- **Deployment**: GitHub Pages
- **Random Number Generation**: seedrandom
- **File Export**: file-saver

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ConfigPanel.tsx       # Configuration panel
│   ├── ControlPanel.tsx      # Control panel with 16 parameters
│   ├── SimulationDisplay.tsx # Simulation display
│   ├── VisualizationPanel.tsx # Visualization panel
│   ├── DataExportPanel.tsx   # Data export panel
│   ├── PerformanceMetrics.tsx # Performance monitoring
│   ├── TimelineChart.tsx     # Timeline chart component
│   ├── StateTransitionGraph.tsx # State transition graph
│   ├── FormulaExplanation.tsx # Mathematical formula explanation
│   ├── Navbar.tsx           # Navigation bar
│   ├── Tooltip.tsx          # Custom tooltip component
│   └── HelpIcon.tsx         # Help icon component
├── pages/              # Page components
│   ├── Introduction.tsx     # Introduction page
│   └── Simulator.tsx        # Simulator page
├── hooks/              # Custom React Hooks
├── store/              # State management (Zustand)
│   └── simulationStore.ts   # Simulation state store
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## 🎮 Usage Guide

### 1. Parameter Configuration

**Basic Parameters**:
- **Initial Capital**: Starting amount of money
- **Target Capital**: Goal amount to reach
- **Max Rounds**: Maximum number of betting rounds
- **Single Bet Amount**: Amount to bet per round
- **Win Probability**: Probability of winning each bet (0-1)
- **Payout Odds**: Multiplier when winning (e.g., 2 means double your bet)

**Advanced Parameters**:
- **Betting Strategy**:
  - Fixed Amount: Bet a fixed amount each round
  - Proportional: Bet a percentage of current capital
- **Bet Ratio**: For proportional strategy, percentage of capital to bet
- **Batch Simulation Count**: Number of simulations to run in batch mode
- **Random Seed**: Optional seed for reproducible results
- **Display Interval**: Update frequency for visualization (milliseconds)

### 2. Running Simulations

- **Single Simulation**: Observe one complete capital change trajectory
- **Batch Simulation**: Run multiple simulations and view statistical analysis
- **Pause/Resume**: Control simulation execution
- **Reset**: Clear current results and start fresh

### 3. Viewing Results

- **Real-time Charts**: Dynamic visualization of capital changes
- **Statistical Information**: View bankruptcy probability, average rounds, and other metrics
- **Performance Metrics**: Monitor simulation performance and optimization stats
- **Data Export**: Export simulation results for further analysis

## 🔧 Development Guide

### Environment Requirements

- Node.js 18+
- npm or yarn

### Code Quality

Run ESLint for code linting:

```bash
npm run lint
```

### Testing

The project uses Playwright for end-to-end testing:

```bash
# Run tests
npx playwright test

# View test report
npx playwright show-report
```

## 📊 Performance Optimizations

- **Code Splitting**: Dynamic imports for optimized loading
- **Resource Compression**: Automatic minification in production
- **Caching Strategy**: Smart resource caching
- **Responsive Design**: Optimized for all device sizes
- **Virtual DOM**: React 19 with concurrent features
- **Web Workers**: Offload heavy computations (planned)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Changelog

### Latest Updates
- Removed i18n infrastructure, using simplified Chinese interface
- Fixed tooltip positioning issues with React Portal implementation
- Optimized control panel layout to 4-column grid with 16 parameters
- Added performance metrics monitoring
- Added state transition graph and formula explanations
- Implemented GitHub link in navigation
- Enhanced data export functionality

### v1.0.0
- Initial release
- Basic simulation functionality
- Visualization charts
- Data export feature
- Responsive design

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - User interface library
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Recharts](https://recharts.org/) - Charting library for React
- [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- [Playwright](https://playwright.dev/) - End-to-end testing framework

## 📞 Contact

For questions or suggestions, please:

- Submit an [Issue](https://github.com/tradermoney/GamblerRuin/issues)
- Visit the [GitHub Repository](https://github.com/tradermoney/GamblerRuin)

---

⭐ If this project helps you, please give it a star!
