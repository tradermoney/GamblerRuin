import React, { useState, useEffect } from 'react';
import type { SimulationConfig } from '../types/simulation';
import useSimulationStore from '../store/simulationStore';
import { validateSimulationConfig, safeParseNumber, safeParseInt } from '../utils/validation';
import type { ValidationError } from '../utils/validation';
import styles from './ConfigPanel.module.css';

interface ConfigPanelProps {
  className?: string;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ className = '' }) => {
  const { config, setConfig, isRunning } = useSimulationStore();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    const result = validateSimulationConfig(config);
    setValidationErrors(result.errors);
  }, [config]);

  const handleConfigChange = (key: keyof SimulationConfig, value: any) => {
    setConfig({ [key]: value });
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(e => e.field === field)?.message;
  };

  return (
    <div className={`${styles.configPanel} ${className}`}>
      <h2 className={styles.title}>参数设置</h2>
      
      <div className={styles.formGrid}>
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              初始资金
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
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              单轮赌注
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
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              单轮赔率
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
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
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

        {config.strategy === 'proportional' && (
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>
              投注比例 (0-1)
            </label>
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
        )}

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>随机种子（可选）</label>
          <input
            type="text"
            value={config.seed || ''}
            onChange={(e) => handleConfigChange('seed', e.target.value || null)}
            disabled={isRunning}
            placeholder="留空则使用随机种子"
            className={styles.input}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
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
  );
};

export default ConfigPanel;