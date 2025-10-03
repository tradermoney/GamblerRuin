import React, { useState, useEffect } from 'react';
import useSimulationStore from '../store/simulationStore';
import { validateSimulationConfig, safeParseNumber, safeParseInt } from '../utils/validation';
import type { ValidationError } from '../utils/validation';
import type { SimulationConfig } from '../types/simulation';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ className = '' }) => {
  const { 
    config,
    setConfig,
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

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    const result = validateSimulationConfig(config);
    setValidationErrors(result.errors);
  }, [config]);

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

  const handleConfigChange = (key: keyof SimulationConfig, value: any) => {
    setConfig({ [key]: value });
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(e => e.field === field)?.message;
  };

  return (
    <div className={`${styles.controlPanel} ${className}`}>
      <h2 className={styles.title}>控制面板</h2>
      
      {/* 参数设置 */}
      <div className={styles.configSection}>
        <h3 className={styles.configTitle}>参数设置</h3>
        
        <div className={styles.formGrid}>
          {/* 第一行：资金相关 */}
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>初始资金</label>
              <input
                type="number"
                min="1"
                value={config.initialCapital}
                onChange={(e) => handleConfigChange('initialCapital', safeParseInt(e.target.value, 10))}
                disabled={isRunning}
                className={`${styles.input} ${getFieldError('initialCapital') ? styles.inputError : ''}`}
              />
              {getFieldError('initialCapital') && (
                <div className={styles.errorMessage}>{getFieldError('initialCapital')}</div>
              )}
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>目标资金</label>
              <input
                type="number"
                min={config.initialCapital}
                value={config.targetCapital || ''}
                onChange={(e) => handleConfigChange('targetCapital', e.target.value ? safeParseInt(e.target.value, 0) : null)}
                disabled={isRunning}
                placeholder="无限制"
                className={`${styles.input} ${getFieldError('targetCapital') ? styles.inputError : ''}`}
              />
              {getFieldError('targetCapital') && (
                <div className={styles.errorMessage}>{getFieldError('targetCapital')}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>单轮赌注</label>
              <input
                type="number"
                min="1"
                value={config.betSize}
                onChange={(e) => handleConfigChange('betSize', safeParseInt(e.target.value, 1))}
                disabled={isRunning}
                className={`${styles.input} ${getFieldError('betSize') ? styles.inputError : ''}`}
              />
              {getFieldError('betSize') && (
                <div className={styles.errorMessage}>{getFieldError('betSize')}</div>
              )}
            </div>
          </div>

          {/* 第二行：概率和策略相关 */}
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>单轮胜率</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={config.winProb}
                onChange={(e) => handleConfigChange('winProb', safeParseNumber(e.target.value, 0.5))}
                disabled={isRunning}
                className={`${styles.input} ${getFieldError('winProb') ? styles.inputError : ''}`}
              />
              {getFieldError('winProb') && (
                <div className={styles.errorMessage}>{getFieldError('winProb')}</div>
              )}
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>单轮赔率</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={config.oddRatio}
                onChange={(e) => handleConfigChange('oddRatio', safeParseNumber(e.target.value, 1))}
                disabled={isRunning}
                className={`${styles.input} ${getFieldError('oddRatio') ? styles.inputError : ''}`}
              />
              {getFieldError('oddRatio') && (
                <div className={styles.errorMessage}>{getFieldError('oddRatio')}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>投注策略</label>
              <select
                value={config.strategy}
                onChange={(e) => handleConfigChange('strategy', e.target.value as 'fixed' | 'martingale' | 'proportional')}
                disabled={isRunning}
                className={styles.select}
              >
                <option value="fixed">固定赌注</option>
                <option value="martingale">马丁格尔策略</option>
                <option value="proportional">比例策略</option>
              </select>
            </div>
          </div>

          {/* 第三行：轮数和种子 */}
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>最大轮数</label>
              <input
                type="number"
                min="1"
                value={config.maxRounds}
                onChange={(e) => handleConfigChange('maxRounds', safeParseInt(e.target.value, 10000))}
                disabled={isRunning}
                className={`${styles.input} ${getFieldError('maxRounds') ? styles.inputError : ''}`}
              />
              {getFieldError('maxRounds') && (
                <div className={styles.errorMessage}>{getFieldError('maxRounds')}</div>
              )}
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>批量模拟次数</label>
              <input
                type="number"
                min="1"
                max="1000000"
                value={config.runs}
                onChange={(e) => handleConfigChange('runs', safeParseInt(e.target.value, 10000))}
                disabled={isRunning}
                className={`${styles.input} ${getFieldError('runs') ? styles.inputError : ''}`}
              />
              {getFieldError('runs') && (
                <div className={styles.errorMessage}>{getFieldError('runs')}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>随机种子</label>
              <input
                type="text"
                value={config.seed || ''}
                onChange={(e) => handleConfigChange('seed', e.target.value || null)}
                disabled={isRunning}
                placeholder="留空则使用随机种子"
                className={styles.input}
              />
            </div>
          </div>

          {/* 比例策略专用行 */}
          {config.strategy === 'proportional' && (
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>投注比例 (0-1)</label>
                <input
                  type="number"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={config.proportion || 0.1}
                  onChange={(e) => handleConfigChange('proportion', safeParseNumber(e.target.value, 0.1))}
                  disabled={isRunning}
                  className={`${styles.input} ${getFieldError('proportion') ? styles.inputError : ''}`}
                />
                {getFieldError('proportion') && (
                  <div className={styles.errorMessage}>{getFieldError('proportion')}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {validationErrors.length > 0 && (
          <div className={styles.validationSummary}>
            <div className={styles.validationTitle}>⚠️ 配置错误</div>
            <ul className={styles.validationList}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
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