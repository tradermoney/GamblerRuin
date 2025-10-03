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
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      {/* 头部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎲</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                  {t('simulation.title')}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('simulation.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 语言切换 */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 shadow-inner">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentLanguage === lang.code
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md scale-105'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105'
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
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-110 shadow-sm"
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
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        {/* 顶部：控制面板 - 突出显示 */}
        <div className="mb-6">
          <ControlPanel />
        </div>

        {/* 主体：两列布局 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* 左列：配置和模拟展示 */}
          <div className="space-y-6">
            <ConfigPanel />
            <SimulationDisplay />
          </div>
          
          {/* 右列：可视化分析 */}
          <div className="space-y-6">
            <VisualizationPanel />
          </div>
        </div>

        {/* 底部：数据导出 */}
        <div>
          <DataExportPanel />
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center space-x-2">
                <span className="text-xl">🎰</span>
                <span>赌徒破产模拟器 - 交互式仿真系统</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                aria-label="查看使用帮助"
              >
                📖 使用帮助
              </a>
              <span className="text-gray-400 dark:text-gray-600">|</span>
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
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
