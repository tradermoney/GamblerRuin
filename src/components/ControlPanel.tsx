import React, { useState, useEffect } from 'react';
import useSimulationStore from '../store/simulationStore';
import { validateSimulationConfig, safeParseNumber, safeParseInt } from '../utils/validation';
import type { ValidationError } from '../utils/validation';
import type { SimulationConfig } from '../types/simulation';
import HelpIcon from './HelpIcon';
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

  const handleConfigChange = (key: keyof SimulationConfig, value: string | number | null) => {
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
          {/* Row 1 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              初始资金
              <HelpIcon content="赌徒开始时拥有的资金数量。必须大于0，建议设置为10-100之间的值。" />
            </label>
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
            <label className={styles.label}>
              目标资金
              <HelpIcon content="赌徒希望达到的资金目标。达到此目标时模拟将停止。留空表示无限制，仅在破产或达到最大轮数时停止。" />
            </label>
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
            <label className={styles.label}>
              单轮赌注
              <HelpIcon content="每次投注的金额。在固定策略下，每轮投注此金额。必须大于0且不能超过当前资金。" />
            </label>
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

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              单轮胜率
              <HelpIcon content="每次投注获胜的概率。范围为0-1之间。0.5表示公平赌局，小于0.5对庄家有利，大于0.5对玩家有利。" />
            </label>
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

          {/* Row 2 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              单轮赔率
              <HelpIcon content="获胜时的赔付倍数。例如赔率为1表示赢了可获得与赌注相等的收益，赔率为2表示获得双倍收益。" />
            </label>
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
            <label className={styles.label}>
              最大轮数
              <HelpIcon content="单次模拟的最大轮数限制。达到此轮数后，即使未破产或未达标，模拟也会停止。用于防止无限循环。" />
            </label>
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
            <label className={styles.label}>
              批量模拟次数
              <HelpIcon content="批量模拟时运行的次数。运行次数越多，统计结果越准确，但计算时间也越长。建议设置为1000-100000之间。" />
            </label>
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
            <label className={styles.label}>
              投注策略
              <HelpIcon content="固定赌注：每次投注固定金额；马丁格尔策略：输了加倍下注；比例策略：按当前资金比例投注。" />
            </label>
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

          {/* Row 3 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              投注比例
              <HelpIcon content="使用比例策略时，每轮投注金额为当前资金的此比例。例如0.1表示每次投注当前资金的10%。" />
            </label>
            <input
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              value={config.proportion || 0.1}
              onChange={(e) => handleConfigChange('proportion', safeParseNumber(e.target.value, 0.1))}
              disabled={isRunning}
              placeholder="0.1"
              className={`${styles.input} ${getFieldError('proportion') ? styles.inputError : ''}`}
            />
            {getFieldError('proportion') && (
              <div className={styles.errorMessage}>{getFieldError('proportion')}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              止损金额
              <HelpIcon content="当亏损达到此金额时自动停止模拟。留空表示无限制。" />
            </label>
            <input
              type="number"
              min="0"
              value={config.stopLossAmount || ''}
              onChange={(e) => handleConfigChange('stopLossAmount', e.target.value ? safeParseNumber(e.target.value, 0) : null)}
              disabled={isRunning}
              placeholder="无限制"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              止盈金额
              <HelpIcon content="当盈利达到此金额时自动停止模拟。留空表示无限制。" />
            </label>
            <input
              type="number"
              min="0"
              value={config.takeProfitAmount || ''}
              onChange={(e) => handleConfigChange('takeProfitAmount', e.target.value ? safeParseNumber(e.target.value, 0) : null)}
              disabled={isRunning}
              placeholder="无限制"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              最小赌注
              <HelpIcon content="动态策略下的最小投注金额限制。" />
            </label>
            <input
              type="number"
              min="1"
              value={config.minBetSize || 1}
              onChange={(e) => handleConfigChange('minBetSize', safeParseInt(e.target.value, 1))}
              disabled={isRunning}
              className={styles.input}
            />
          </div>

          {/* Row 4 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              最大赌注
              <HelpIcon content="动态策略下的最大投注金额限制。" />
            </label>
            <input
              type="number"
              min={config.minBetSize || 1}
              value={config.maxBetSize || 100}
              onChange={(e) => handleConfigChange('maxBetSize', safeParseInt(e.target.value, 100))}
              disabled={isRunning}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              连败重置次数
              <HelpIcon content="连续输掉此次数后重置投注策略。用于马丁格尔等策略的风险控制。" />
            </label>
            <input
              type="number"
              min="1"
              value={config.streakResetCount || 5}
              onChange={(e) => handleConfigChange('streakResetCount', safeParseInt(e.target.value, 5))}
              disabled={isRunning}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              手续费率
              <HelpIcon content="每次投注需支付的手续费比例（0-1之间）。例如0.01表示1%的手续费。" />
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.001"
              value={config.commissionRate || 0}
              onChange={(e) => handleConfigChange('commissionRate', safeParseNumber(e.target.value, 0))}
              disabled={isRunning}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              随机种子
              <HelpIcon content="用于生成随机数的种子。使用相同种子可以重现相同的模拟结果。留空则每次使用不同的随机种子。" />
            </label>
            <input
              type="text"
              value={config.seed || ''}
              onChange={(e) => handleConfigChange('seed', e.target.value || null)}
              disabled={isRunning}
              placeholder="可选"
              className={styles.input}
            />
          </div>
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
          <div className={styles.speedSlider}>
            <input
              type="range"
              min="0.5"
              max="100"
              step="0.5"
              value={simulationSpeed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.speedValue}>{simulationSpeed}x</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;