#!/bin/bash

# 定义应用名称
APP_NAME="GamblerRuin"
PORT=48770  # 从 playwright.config.ts 中获取的端口号

# 检查并终止已运行的实例
echo "检查是否有运行中的实例..."

# 通过端口号查找并终止进程
if lsof -i :$PORT > /dev/null; then
    echo "发现端口 $PORT 已被占用，正在终止相关进程..."
    lsof -i :$PORT | grep LISTEN | awk '{print $2}' | xargs kill -9
    echo "已终止旧进程"
fi

# 确保 node_modules 存在
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
fi

# 启动应用
echo "正在启动 $APP_NAME..."
npm run dev

# 捕获 SIGINT 和 SIGTERM 信号
trap 'echo "正在关闭应用..."; lsof -i :$PORT | grep LISTEN | awk "{print \$2}" | xargs kill -9 2>/dev/null; exit 0' SIGINT SIGTERM



