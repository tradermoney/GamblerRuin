import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Introduction from './pages/Introduction';
import Simulator from './pages/Simulator';
import './App.css';

function App() {
  // 无障碍支持
  useEffect(() => {
    document.documentElement.lang = 'zh';
    document.title = '赌徒破产模拟器';
  }, []);

  return (
    <Router>
      <div className="app">
        {/* 头部导航 */}
        <Navbar />

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