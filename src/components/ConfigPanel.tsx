import React from 'react';
import type { SimulationConfig } from '../types/simulation';
import useSimulationStore from '../store/simulationStore';
import styles from './ConfigPanel.module.css';

interface ConfigPanelProps {
  className?: string;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ className = '' }) => {
  const { config, setConfig, isRunning } = useSimulationStore();

  const handleConfigChange = (key: keyof SimulationConfig, value: any) => {
    setConfig({ [key]: value });
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
              onChange={(e) => handleConfigChange('initialCapital', parseInt(e.target.value))}
              disabled={isRunning}
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              目标资金
            </label>
            <input
              type="number"
              min={config.initialCapital}
              value={config.targetCapital || ''}
              onChange={(e) => handleConfigChange('targetCapital', e.target.value ? parseInt(e.target.value) : null)}
              disabled={isRunning}
              placeholder="无限制"
              className={styles.input}
            />
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
              onChange={(e) => handleConfigChange('betSize', parseInt(e.target.value))}
              disabled={isRunning}
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              单轮胜率
            </label>
            <input
              type="number"
              min="0.01"
              max="0.99"
              step="0.01"
              value={config.winProb}
              onChange={(e) => handleConfigChange('winProb', parseFloat(e.target.value))}
              disabled={isRunning}
              className={styles.input}
            />
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
              onChange={(e) => handleConfigChange('oddRatio', parseFloat(e.target.value))}
              disabled={isRunning}
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              最大轮数
            </label>
            <input
              type="number"
              min="1"
              value={config.maxRounds}
              onChange={(e) => handleConfigChange('maxRounds', parseInt(e.target.value))}
              disabled={isRunning}
              className={styles.input}
            />
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
              onChange={(e) => handleConfigChange('proportion', parseFloat(e.target.value))}
              disabled={isRunning}
              className={styles.input}
            />
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
            max="100000"
            value={config.runs}
            onChange={(e) => handleConfigChange('runs', parseInt(e.target.value))}
            disabled={isRunning}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;