import React from 'react';
import './Navbar.css';

interface NavbarProps {
  title: string;
  currentLanguage: string;
  languages: Array<{ code: string; name: string; flag: string }>;
  onLanguageChange: (code: string) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  currentLanguage,
  languages,
  onLanguageChange,
  isDarkMode,
  onThemeToggle,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* 左侧：Logo和标题 */}
          <div className="navbar-brand">
            <div className="navbar-logo">
              <span className="navbar-logo-icon">🎲</span>
            </div>
            <h1 className="navbar-title">
              {title}
            </h1>
          </div>
          
          {/* 右侧：控制按钮 */}
          <div className="navbar-controls">
            {/* 语言切换 */}
            <div className="language-switcher">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`language-button ${currentLanguage === lang.code ? 'active' : ''}`}
                  title={`切换到${lang.name}`}
                >
                  <span className="language-flag">{lang.flag}</span>
                  <span className="language-code">{lang.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
            
            {/* 主题切换 */}
            <button
              onClick={onThemeToggle}
              className="theme-toggle"
              title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
            >
              <span className="theme-icon">
                {isDarkMode ? '☀️' : '🌙'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

