import { useState, useEffect } from 'react';
import SimulationDisplay from './components/SimulationDisplay';
import VisualizationPanel from './components/VisualizationPanel';
import ControlPanel from './components/ControlPanel';
import DataExportPanel from './components/DataExportPanel';
import Navbar from './components/Navbar';
import PersistenceTest from './components/PersistenceTest';
import { useI18n } from './i18n';
import useSimulationStore from './store/simulationStore';
import './App.css';

function App() {
  const { t, currentLanguage, changeLanguage, languages } = useI18n();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const { restoreConfig } = useSimulationStore();

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        // 这里可以添加开始/暂停逻辑
      } else if (event.code === 'Escape') {
        // 这里可以添加停止逻辑
      } else if (event.code === 'KeyR') {
        // 这里可以添加重置逻辑
      } else if (event.code === 'KeyT' && event.ctrlKey) {
        // Ctrl+T 切换测试面板
        event.preventDefault();
        setShowTestPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // 应用启动时恢复配置
  useEffect(() => {
    restoreConfig();
  }, [restoreConfig]);

  // 无障碍支持
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.title = t('simulation.title');
  }, [currentLanguage, t]);

  // 主题切换处理
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      {/* 头部导航 */}
      <Navbar
        title={t('simulation.title')}
        currentLanguage={currentLanguage}
        languages={languages}
        onLanguageChange={changeLanguage}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />

      {/* 主要内容 */}
      <main className="app-main">
        {/* 垂直堆叠布局 */}
        <div className="vertical-layout">
          {/* 1. 控制面板（包含参数设置） */}
          <div className="panel-section">
            <ControlPanel />
          </div>

          {/* 2. 模拟展示 */}
          <div className="panel-section">
            <SimulationDisplay />
          </div>
          
          {/* 3. 可视化分析 */}
          <div className="panel-section">
            <VisualizationPanel />
          </div>

          {/* 4. 数据导出 */}
          <div className="panel-section">
            <DataExportPanel />
          </div>

          {/* 5. 持久化测试面板 (开发模式) */}
          {showTestPanel && (
            <div className="panel-section">
              <PersistenceTest />
            </div>
          )}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-info">
              <p className="footer-text">
                <span className="footer-icon">🎰</span>
                <span>赌徒破产模拟器 - 交互式仿真系统</span>
              </p>
            </div>
            <div className="footer-links">
              <a 
                href="#" 
                className="footer-link"
                aria-label="查看使用帮助"
              >
                📖 使用帮助
              </a>
              <span className="footer-separator">|</span>
              <a 
                href="#" 
                className="footer-link"
                aria-label="关于项目"
              >
                ℹ️ 关于
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;