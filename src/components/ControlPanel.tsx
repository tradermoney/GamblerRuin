import React from 'react';
import useSimulationStore from '../store/simulationStore';
import { validateSimulationConfig } from '../utils/validation';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ className = '' }) => {
  const { 
    config,
    isRunning, 
    isPaused, 
    simulationSpeed,
    startSingleSimulation, 
    startBatchSimulation,
    pauseSimulation, 
    resumeSimulation, 
    stopSimulation, 
    resetSimulation,
    setSimulationSpeed 
  } = useSimulationStore();

  const validationResult = validateSimulationConfig(config);
  const canStart = validationResult.isValid;

  const handleStart = () => {
    startSingleSimulation();
  };

  const handleBatchStart = () => {
    startBatchSimulation();
  };

  const handlePause = () => {
    pauseSimulation();
  };

  const handleResume = () => {
    resumeSimulation();
  };

  const handleStop = () => {
    stopSimulation();
  };

  const handleReset = () => {
    resetSimulation();
  };

  const handleSpeedChange = (speed: number) => {
    setSimulationSpeed(speed);
  };

  return (
    <div className={`${styles.controlPanel} ${className}`}>
      <h2 className={styles.title}>控制面板</h2>
      
      {/* 主控制按钮 */}
      <div className={styles.buttonGroup}>
        {!isRunning && !isPaused && (
          <>
            <button
              onClick={handleStart}
              className={styles.primaryButton}
              disabled={!canStart}
              title={!canStart ? '请先修复配置错误' : ''}
            >
              开始模拟
            </button>
            <button
              onClick={handleBatchStart}
              className={styles.primaryButton}
              disabled={!canStart}
              title={!canStart ? '请先修复配置错误' : ''}
            >
              批量模拟
            </button>
          </>
        )}
        
        {isRunning && !isPaused && (
          <button
            onClick={handlePause}
            className={styles.primaryButton}
          >
            暂停
          </button>
        )}
        
        {isPaused && (
          <button
            onClick={handleResume}
            className={styles.primaryButton}
          >
            继续
          </button>
        )}
        
        {(isRunning || isPaused) && (
          <button
            onClick={handleStop}
            className={styles.primaryButton}
          >
            停止
          </button>
        )}
        
        <button
          onClick={handleReset}
          className={styles.secondaryButton}
        >
          重置
        </button>
      </div>

      {/* 状态和速度控制 */}
      <div className={styles.statusAndSpeedGrid}>
        <div className={styles.statusItem}>
          <div className={styles.statusLabel}>状态</div>
          <div className={styles.statusValue}>
            {isRunning && !isPaused ? '运行中' :
             isPaused ? '已暂停' :
             '已停止'}
          </div>
        </div>
        <div className={styles.speedControlCompact}>
          <div className={styles.speedLabelCompact}>模拟速度</div>
          <div className={styles.speedButtons}>
            {[0.5, 1, 2, 5, 10].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`${styles.speedButton} ${
                  simulationSpeed === speed ? styles.active : ''
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 快捷键提示 */}
      <div className={styles.shortcuts}>
        <p className={styles.shortcutsTitle}>快捷键:</p>
        <div className={styles.shortcutsList}>
          <div className={styles.shortcutItem}>
            <span className={styles.shortcutKey}>空格</span> - 开始/暂停
          </div>
          <div className={styles.shortcutItem}>
            <span className={styles.shortcutKey}>ESC</span> - 停止
          </div>
          <div className={styles.shortcutItem}>
            <span className={styles.shortcutKey}>R</span> - 重置
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;