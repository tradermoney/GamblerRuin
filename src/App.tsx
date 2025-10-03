import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Introduction from './pages/Introduction';
import Simulator from './pages/Simulator';
import { useI18n } from './i18n';
import './App.css';

function App() {
  const { t, currentLanguage, changeLanguage, languages } = useI18n();

  // 无障碍支持
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.title = t('simulation.title');
  }, [currentLanguage, t]);

  return (
    <Router>
      <div className="app">
        {/* 头部导航 */}
        <Navbar
          title={t('simulation.title')}
          currentLanguage={currentLanguage}
          languages={languages}
          onLanguageChange={changeLanguage}
        />

        {/* 路由内容 */}
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/simulator" element={<Simulator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;