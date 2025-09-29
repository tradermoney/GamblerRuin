import { useState, useEffect } from 'react';
import ConfigPanel from './components/ConfigPanel';
import SimulationDisplay from './components/SimulationDisplay';
import VisualizationPanel from './components/VisualizationPanel';
import ControlPanel from './components/ControlPanel';
import DataExportPanel from './components/DataExportPanel';
import { useI18n } from './i18n';
import './App.css';

function App() {
  const { t, currentLanguage, changeLanguage, languages } = useI18n();
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // 无障碍支持
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.title = t('simulation.title');
  }, [currentLanguage, t]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* 头部导航 */}
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('simulation.title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('simulation.description')}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 语言切换 */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={lang.name}
                    aria-label={`切换到${lang.name}`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>
              
              {/* 主题切换 */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
                aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：配置和控制 */}
          <div className="space-y-6">
            <ConfigPanel />
            <ControlPanel />
            <DataExportPanel />
          </div>
          
          {/* 中间：模拟展示 */}
          <div className="space-y-6">
            <SimulationDisplay />
          </div>
          
          {/* 右侧：可视化 */}
          <div className="space-y-6">
            <VisualizationPanel />
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              赌徒破产模拟器 - 交互式仿真系统 | 
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-1"
                aria-label="查看使用帮助"
              >
                使用帮助
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
