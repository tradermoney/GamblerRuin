import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import useSimulationStore from '../store/simulationStore';
import { useExportPersistence } from '../hooks/usePersistence';
import styles from './DataExportPanel.module.css';

interface DataExportPanelProps {
  className?: string;
}

const DataExportPanel: React.FC<DataExportPanelProps> = ({ className = '' }) => {
  const { config, batchResult } = useSimulationStore();
  const [isExporting, setIsExporting] = useState(false);
  
  // 导出设置状态
  const [exportSettings, setExportSettings] = useState<Record<string, any>>({
    csvFormat: 'utf-8',
    includeHeaders: true,
    dateFormat: 'YYYY-MM-DD',
    decimalPlaces: 2,
    autoSave: false
  });

  // 持久化设置
  const { restoreSettings } = useExportPersistence(exportSettings);

  // 恢复设置
  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await restoreSettings();
      if (savedSettings) {
        setExportSettings(savedSettings.exportSettings);
      }
    };
    loadSettings();
  }, [restoreSettings]);

  const exportToCSV = () => {
    if (!batchResult || !batchResult.results || batchResult.results.length === 0) {
      alert('没有数据可导出');
      return;
    }

    setIsExporting(true);

    try {
      // 根据设置格式化数据
      const formatNumber = (num: number) => {
        return num.toFixed(exportSettings.decimalPlaces);
      };

      // CSV 头部
      const headers = exportSettings.includeHeaders 
        ? ['运行编号', '最终资金', '总轮次', '是否破产', '是否达标', '最大资金', '最小资金']
        : [];
      
      const csvContent = [
        ...(exportSettings.includeHeaders ? [headers.join(',')] : []),
        ...batchResult.results.map((result, index) => [
          index + 1,
          formatNumber(result.finalCapital),
          result.rounds,
          result.bankrupt ? '是' : '否',
          result.reachedTarget ? '是' : '否',
          result.trace ? formatNumber(Math.max(...result.trace)) : '0',
          result.trace ? formatNumber(Math.min(...result.trace)) : '0'
        ].join(','))
      ].join('\n');

      const charset = exportSettings.csvFormat === 'utf-8' ? 'utf-8' : 'gbk';
      const blob = new Blob([csvContent], { type: `text/csv;charset=${charset};` });
      
      const dateStr = new Date().toISOString().slice(0, 10);
      saveAs(blob, `gambler_ruin_results_${dateStr}.csv`);
    } catch (error) {
      console.error('导出CSV失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const exportConfig = () => {
    try {
      const configJson = JSON.stringify(config, null, 2);
      const blob = new Blob([configJson], { type: 'application/json' });
      saveAs(blob, `gambler_ruin_config_${new Date().toISOString().slice(0, 10)}.json`);
    } catch (error) {
      console.error('导出配置失败:', error);
      alert('导出配置失败，请重试');
    }
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        // 这里可以添加配置验证逻辑
        if (validateConfig(importedConfig)) {
          // 更新配置到 store
          useSimulationStore.setState({ config: importedConfig });
          alert('配置导入成功');
        } else {
          alert('配置文件格式不正确');
        }
      } catch (error) {
        console.error('导入配置失败:', error);
        alert('配置文件解析失败');
      }
    };
    reader.readAsText(file);
    
    // 清空文件输入
    event.target.value = '';
  };

  const validateConfig = (config: any): boolean => {
    const requiredFields = [
      'initialCapital', 'targetCapital', 'betSize', 'winProbability', 
      'oddRatio', 'maxRounds', 'bettingStrategy', 'randomSeed'
    ];
    
    return requiredFields.every(field => 
      config.hasOwnProperty(field) && 
      typeof config[field] === (field === 'bettingStrategy' ? 'string' : 'number')
    );
  };

  const exportReport = () => {
    if (!batchResult || !batchResult.results || batchResult.results.length === 0) {
      alert('没有数据可导出');
      return;
    }

    setIsExporting(true);

    try {
      const bankruptCount = batchResult.results.filter((r: any) => r.bankrupt).length;
      const successCount = batchResult.results.filter((r: any) => r.reachedTarget).length;
      const totalRounds = batchResult.results.reduce((sum: number, r: any) => sum + r.rounds, 0);
      const avgRounds = totalRounds / batchResult.results.length;
      const avgFinalCapital = batchResult.results.reduce((sum: number, r: any) => sum + r.finalCapital, 0) / batchResult.results.length;

      const report = {
        timestamp: new Date().toISOString(),
        config: config,
        statistics: {
          totalRuns: batchResult.results.length,
          bankruptCount,
          successCount,
          bankruptcyRate: (bankruptCount / batchResult.results.length * 100).toFixed(2) + '%',
          successRate: (successCount / batchResult.results.length * 100).toFixed(2) + '%',
          averageRounds: avgRounds.toFixed(2),
          averageFinalCapital: avgFinalCapital.toFixed(2),
          minRounds: Math.min(...batchResult.results.map((r: any) => r.rounds)),
          maxRounds: Math.max(...batchResult.results.map((r: any) => r.rounds)),
          minFinalCapital: Math.min(...batchResult.results.map((r: any) => r.finalCapital)),
          maxFinalCapital: Math.max(...batchResult.results.map((r: any) => r.finalCapital))
        }
      };

      const reportContent = JSON.stringify(report, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      saveAs(blob, `gambler_ruin_report_${new Date().toISOString().slice(0, 10)}.json`);
    } catch (error) {
      console.error('导出报告失败:', error);
      alert('导出报告失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`${styles.dataExportPanel} ${className}`}>
      <h2 className={styles.title}>数据导出</h2>
      
      {/* 数据导出 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>数据导出</h3>
        <div className={styles.buttonGroup}>
          <button
            onClick={exportToCSV}
            disabled={isExporting || !batchResult || !batchResult.results || batchResult.results.length === 0}
            className={`${styles.exportButton} ${isExporting ? styles.loading : ''}`}
          >
            {isExporting ? '导出中...' : '导出CSV数据'}
          </button>
          
          <button
            onClick={exportReport}
            disabled={isExporting || !batchResult || !batchResult.results || batchResult.results.length === 0}
            className={`${styles.exportButton} ${isExporting ? styles.loading : ''}`}
          >
            {isExporting ? '导出中...' : '导出完整报告'}
          </button>
        </div>
      </div>

      {/* 导出设置 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>导出设置</h3>
        <div className={styles.settingsGrid}>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={exportSettings.includeHeaders}
                onChange={(e) => setExportSettings(prev => ({
                  ...prev,
                  includeHeaders: e.target.checked
                }))}
                className={styles.settingCheckbox}
              />
              包含表头
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              小数位数:
              <select
                value={exportSettings.decimalPlaces}
                onChange={(e) => setExportSettings(prev => ({
                  ...prev,
                  decimalPlaces: parseInt(e.target.value)
                }))}
                className={styles.settingSelect}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              编码格式:
              <select
                value={exportSettings.csvFormat}
                onChange={(e) => setExportSettings(prev => ({
                  ...prev,
                  csvFormat: e.target.value
                }))}
                className={styles.settingSelect}
              >
                <option value="utf-8">UTF-8</option>
                <option value="gbk">GBK</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* 配置管理 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>配置管理</h3>
        <div className={styles.buttonGroup}>
          <button
            onClick={exportConfig}
            className={styles.exportButton}
          >
            导出当前配置
          </button>
          
          <label className={styles.fileInputLabel}>
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className={styles.fileInput}
            />
            <div className={styles.importButton}>
              导入配置文件
            </div>
          </label>
        </div>
      </div>

      {/* 数据预览 */}
      {batchResult && batchResult.results && batchResult.results.length > 0 && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>数据预览</h3>
          <div className={styles.previewGrid}>
            <div className={styles.previewItem}>
              <span className={styles.previewLabel}>总记录数:</span>
              <span className={styles.previewValue}>{batchResult.results.length}</span>
            </div>
            <div className={styles.previewItem}>
              <span className={styles.previewLabel}>破产率:</span>
              <span className={`${styles.previewValue} ${styles.danger}`}>
                {((batchResult.results.filter((r: any) => r.bankrupt).length / batchResult.results.length) * 100).toFixed(1)}%
              </span>
            </div>
            <div className={styles.previewItem}>
              <span className={styles.previewLabel}>成功率:</span>
              <span className={`${styles.previewValue} ${styles.success}`}>
                {((batchResult.results.filter((r: any) => r.reachedTarget).length / batchResult.results.length) * 100).toFixed(1)}%
              </span>
            </div>
            <div className={styles.previewItem}>
              <span className={styles.previewLabel}>平均轮次:</span>
              <span className={styles.previewValue}>
                {(batchResult.results.reduce((sum: number, r: any) => sum + r.rounds, 0) / batchResult.results.length).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className={styles.instructions}>
        <p className={styles.instructionsTitle}>使用说明:</p>
        <ul className={styles.instructionsList}>
          <li className={styles.instructionItem}>CSV导出：导出所有仿真结果的详细数据</li>
          <li className={styles.instructionItem}>报告导出：导出包含统计分析的完整报告</li>
          <li className={styles.instructionItem}>配置导出：导出当前所有参数设置</li>
          <li className={styles.instructionItem}>配置导入：从JSON文件导入参数设置</li>
        </ul>
      </div>
    </div>
  );
};

export default DataExportPanel;