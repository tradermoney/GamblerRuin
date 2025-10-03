import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import useSimulationStore from '../store/simulationStore';
import type { SingleRunResult } from '../types/simulation';
import { useVisualizationPersistence } from '../hooks/usePersistence';
import styles from './VisualizationPanel.module.css';

interface VisualizationPanelProps {
  className?: string;
}

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ className = '' }) => {
  const { batchResult } = useSimulationStore();
  
  // 可视化设置状态
  const [chartTypes, setChartTypes] = useState<string[]>(['pie', 'bar', 'scatter']);
  const [chartSettings, setChartSettings] = useState<Record<string, string | number | boolean>>({
    pie: { showLabels: true, outerRadius: 80 },
    bar: { showGrid: true, barColor: '#8884d8' },
    scatter: { showGrid: true, pointColor: '#8884d8' }
  });

  // 持久化设置
  const { restoreSettings } = useVisualizationPersistence(chartTypes, chartSettings);

  // 恢复设置
  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await restoreSettings();
      if (savedSettings) {
        setChartTypes(savedSettings.chartTypes);
        setChartSettings(savedSettings.chartSettings);
      }
    };
    loadSettings();
  }, [restoreSettings]);

  const getOutcomeData = () => {
    if (!batchResult || !batchResult.results || batchResult.results.length === 0) return [];
    
    const bankruptCount = batchResult.results.filter((r: SingleRunResult) => r.bankrupt).length;
    const successCount = batchResult.results.filter((r: SingleRunResult) => r.reachedTarget).length;
    const ongoingCount = batchResult.results.filter((r: SingleRunResult) => !r.bankrupt && !r.reachedTarget).length;
    
    return [
      { name: '破产', value: bankruptCount, color: '#ef4444' },
      { name: '成功', value: successCount, color: '#22c55e' },
      { name: '进行中', value: ongoingCount, color: '#6b7280' }
    ];
  };

  const getRoundsDistribution = () => {
    if (!batchResult || !batchResult.results || batchResult.results.length === 0) return [];
    
    const rounds = batchResult.results.map((r: SingleRunResult) => r.rounds);
    const maxRounds = Math.max(...rounds);
    const bins = 10;
    const binSize = Math.ceil(maxRounds / bins);
    
    const histogram = Array.from({ length: bins }, (_, i) => ({
      range: `${i * binSize}-${(i + 1) * binSize - 1}`,
      count: 0
    }));
    
    rounds.forEach((rounds: number) => {
      const binIndex = Math.min(Math.floor(rounds / binSize), bins - 1);
      histogram[binIndex].count++;
    });
    
    return histogram;
  };

  const getFinalCapitalData = () => {
    if (!batchResult || !batchResult.results || batchResult.results.length === 0) return [];
    
    return batchResult.results.map((result: SingleRunResult, index: number) => ({
      run: index + 1,
      finalCapital: result.finalCapital
    }));
  };

  // 暂时注释掉未使用的函数
  // const getBoxPlotData = () => {
  //   if (!batchResults || batchResults.length === 0) return [];
  //   
  //   const rounds = batchResults.map((r: SingleRunResult) => r.rounds).sort((a: number, b: number) => a - b);
  //   const finalCapitals = batchResults.map((r: SingleRunResult) => r.finalCapital).sort((a: number, b: number) => a - b);
  //   
  //   const getStats = (arr: number[]) => {
  //     const q1 = arr[Math.floor(arr.length * 0.25)];
  //     const median = arr[Math.floor(arr.length * 0.5)];
  //     const q3 = arr[Math.floor(arr.length * 0.75)];
  //     const min = arr[0];
  //     const max = arr[arr.length - 1];
  //     
  //     return { min, q1, median, q3, max };
  //   };
  //   
  //   return [
  //     {
  //       name: '轮次',
  //       ...getStats(rounds)
  //     },
  //     {
  //       name: '最终资金',
  //       ...getStats(finalCapitals)
  //     }
  //   ];
  // };

  if (!batchResult || !batchResult.results || batchResult.results.length === 0) {
    return (
      <div className={`${styles.visualizationPanel} ${className}`}>
        <h2 className={styles.title}>可视化分析</h2>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📈</div>
          <p className={styles.emptyText}>暂无批量仿真数据</p>
          <p className={styles.emptySubtext}>请先运行批量仿真</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.visualizationPanel} ${className}`}>
      <h2 className={styles.title}>可视化分析</h2>
      
      {/* 结果分布饼图 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>结果分布</h3>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getOutcomeData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getOutcomeData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 轮次分布直方图 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>轮次分布</h3>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getRoundsDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 最终资金散点图 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>最终资金分布</h3>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={getFinalCapitalData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="run" name="运行次数" />
              <YAxis dataKey="finalCapital" name="最终资金" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="最终资金" dataKey="finalCapital" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 统计摘要 */}
      <div className={styles.summarySection}>
        <h3 className={styles.summaryTitle}>统计摘要</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>总运行次数</div>
            <div className={styles.summaryValue}>{batchResult.results.length}</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>破产率</div>
            <div className={`${styles.summaryValue} ${styles.danger}`}>
              {((batchResult.results.filter((r: SingleRunResult) => r.bankrupt).length / batchResult.results.length) * 100).toFixed(1)}%
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>成功率</div>
            <div className={`${styles.summaryValue} ${styles.success}`}>
              {((batchResult.results.filter((r: SingleRunResult) => r.reachedTarget).length / batchResult.results.length) * 100).toFixed(1)}%
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>平均轮次</div>
            <div className={styles.summaryValue}>
              {(batchResult.results.reduce((sum: number, r: SingleRunResult) => sum + r.rounds, 0) / batchResult.results.length).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPanel;