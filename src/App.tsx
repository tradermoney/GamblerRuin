import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Introduction from './pages/Introduction';
import Simulator from './pages/Simulator';
import { useI18n } from './i18n';
import './App.css';

function App() {
  const { t, currentLanguage, changeLanguage, languages } = useI18n();
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <Router>
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

        {/* 路由内容 */}
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/simulator" element={<Simulator />} />
        </Routes>

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
    </Router>
  );
}

export default App;