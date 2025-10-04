import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();

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
              赌徒破产模拟器
            </h1>
          </div>

          {/* 中间：导航菜单 */}
          <nav className="navbar-menu">
            <Link
              to="/"
              className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              📚 赌徒破产问题介绍
            </Link>
            <Link
              to="/simulator"
              className={`menu-item ${location.pathname === '/simulator' ? 'active' : ''}`}
            >
              🎰 赌徒破产问题模拟
            </Link>
          </nav>

          {/* 右侧：控制按钮 */}
          <div className="navbar-controls">
            {/* GitHub链接 */}
            <a
              href="https://github.com/tradermoney/GamblerRuin"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              title="查看GitHub仓库"
            >
              <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

