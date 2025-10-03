import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useSimulationStore from '../store/simulationStore';
import styles from './SimulationDisplay.module.css';

interface SimulationDisplayProps {
  className?: string;
}

const SimulationDisplay: React.FC<SimulationDisplayProps> = ({ className = '' }) => {
  const { 
    currentCapital, 
    currentRound, 
    currentRun, 
    isRunning, 
    progress,
    config 
  } = useSimulationStore();

  const getChartData = () => {
    if (!currentRun?.trace) return [];
    return currentRun.trace.map((capital, index) => ({
      round: index,
      capital
    }));
  };

  const statusText = () => {
    if (currentRun?.bankrupt) return '已破产';
    if (currentRun?.reachedTarget) return '达到目标';
    if (isRunning) return '进行中';
    return '等待开始';
  };

  return (
    <div className={`${styles.simulationDisplay} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>模拟展示</h2>
        <div className={`${styles.statusBadge} ${
          currentRun?.bankrupt ? styles.bankrupt :
          currentRun?.reachedTarget ? styles.success :
          isRunning ? styles.running : styles.waiting
        }`}>
          {statusText()}
        </div>
      </div>

      {/* 当前状态 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>当前资金</div>
          <div className={styles.statValue}>
            {currentCapital}
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statLabel}>当前轮次</div>
          <div className={styles.statValue}>
            {currentRound}
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statLabel}>初始资金</div>
          <div className={styles.statValue}>
            {config.initialCapital}
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statLabel}>目标资金</div>
          <div className={styles.statValue}>
            {config.targetCapital || '∞'}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      {isRunning && (
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>模拟进度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 图表 */}
      {currentRun?.trace && currentRun.trace.length > 1 && (
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="round" 
                label={{ value: '轮次', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: '资金', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [value, '资金']}
                labelFormatter={(label) => `轮次: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="capital" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 结果展示 */}
      {currentRun && !isRunning && (
        <div className={styles.resultSection}>
          <h3 className={styles.resultTitle}>模拟结果</h3>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>最终资金:</span>
              <span className={styles.resultValue}>{currentRun.finalCapital}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>总轮次:</span>
              <span className={styles.resultValue}>{currentRun.rounds}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>破产:</span>
              <span className={`${styles.resultValue} ${currentRun.bankrupt ? styles.bankrupt : styles.success}`}>
                {currentRun.bankrupt ? '是' : '否'}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>达标:</span>
              <span className={`${styles.resultValue} ${currentRun.reachedTarget ? styles.success : styles.neutral}`}>
                {currentRun.reachedTarget ? '是' : '否'}
              </span>
            </div>
          </div>
        </div>
      )}

      {!currentRun && !isRunning && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p className={styles.emptyText}>点击开始按钮开始模拟</p>
        </div>
      )}
    </div>
  );
};

export default SimulationDisplay;