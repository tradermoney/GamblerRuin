import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 无障碍支持：确保页面加载完成后再渲染
const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

// 性能监控（可选）
if (import.meta.env.PROD) {
  // 这里可以添加性能监控代码
  console.log('生产环境模式')
}
