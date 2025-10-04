import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useSimulationStore from '../store/simulationStore';
import type { SingleRunResult } from '../types/simulation';
import HelpIcon from './HelpIcon';
import styles from './PerformanceMetricsTimeline.module.css';

interface PerformanceMetricsTimelineProps {
  className?: string;
}

const PerformanceMetricsTimeline: React.FC<PerformanceMetricsTimelineProps> = ({ className = '' }) => {
  const { batchResult } = useSimulationStore();

  if (!batchResult || !batchResult.results || batchResult.results.length === 0) {
    return (
      <div className={`${styles.metricsPanel} ${className}`}>
        <h2 className={styles.title}>策略绩效分析</h2>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p className={styles.emptyText}>暂无数据</p>
          <p className={styles.emptySubtext}>请先运行批量仿真</p>
        </div>
      </div>
    );
  }

  const results = batchResult.results;
  const totalRuns = results.length;

  // 获取所有轨迹中的最大轮数
  const maxRounds = Math.max(...results.map((r: SingleRunResult) => r.trace?.length || 0));

  // 计算每轮的统计数据
  const timelineData: Array<{
    round: number;
    avgCapital: number;
    maxCapital: number;
    minCapital: number;
    bankruptRate: number;
    successRate: number;
    avgProfit: number;
    runningCount: number;
    bankruptCount: number;
    successCount: number;
    medianCapital: number;
    p25Capital: number;
    p75Capital: number;
  }> = [];

  const initialCapital = results[0]?.trace?.[0] || 0;

  for (let round = 0; round < maxRounds; round++) {
    const capitalsAtRound: number[] = [];
    let bankruptCount = 0;
    let successCount = 0;
    const targetCapital = batchResult.results[0].reachedTarget ?
      results.find(r => r.reachedTarget)?.finalCapital || initialCapital * 2 :
      initialCapital * 2;

    results.forEach((r: SingleRunResult) => {
      if (r.trace && round < r.trace.length) {
        const capital = r.trace[round];
        capitalsAtRound.push(capital);

        if (capital === 0) bankruptCount++;
        if (capital >= targetCapital) successCount++;
      }
    });

    if (capitalsAtRound.length === 0) continue;

    const sortedCapitals = [...capitalsAtRound].sort((a, b) => a - b);
    const avgCapital = capitalsAtRound.reduce((a, b) => a + b, 0) / capitalsAtRound.length;
    const maxCapital = Math.max(...capitalsAtRound);
    const minCapital = Math.min(...capitalsAtRound);
    const medianCapital = sortedCapitals[Math.floor(sortedCapitals.length / 2)];
    const p25Capital = sortedCapitals[Math.floor(sortedCapitals.length * 0.25)];
    const p75Capital = sortedCapitals[Math.floor(sortedCapitals.length * 0.75)];
    const runningCount = capitalsAtRound.length;
    const bankruptRate = (bankruptCount / totalRuns) * 100;
    const successRate = (successCount / totalRuns) * 100;
    const avgProfit = avgCapital - initialCapital;

    timelineData.push({
      round,
      avgCapital: Number(avgCapital.toFixed(2)),
      maxCapital: Number(maxCapital.toFixed(2)),
      minCapital: Number(minCapital.toFixed(2)),
      bankruptRate: Number(bankruptRate.toFixed(2)),
      successRate: Number(successRate.toFixed(2)),
      avgProfit: Number(avgProfit.toFixed(2)),
      runningCount,
      bankruptCount,
      successCount,
      medianCapital: Number(medianCapital.toFixed(2)),
      p25Capital: Number(p25Capital.toFixed(2)),
      p75Capital: Number(p75Capital.toFixed(2))
    });
  }

  // 计算衍生指标的时间线数据
  const derivedTimelineData = timelineData.map((data, index) => {
    const { avgCapital, bankruptRate, successRate, runningCount, round } = data;

    // 计算累计盈亏
    const cumulativeProfit = avgCapital - initialCapital;
    const cumulativeProfitPct = initialCapital !== 0 ? (cumulativeProfit / initialCapital) * 100 : 0;

    // 计算累计破产和达标比例
    const ongoingRate = 100 - bankruptRate - successRate;

    // 计算资金波动率（使用滑动窗口）
    const windowSize = Math.min(10, index + 1);
    const recentData = timelineData.slice(Math.max(0, index - windowSize + 1), index + 1);
    const capitals = recentData.map(d => d.avgCapital);
    const avgRecent = capitals.reduce((a, b) => a + b, 0) / capitals.length;
    const variance = capitals.reduce((sum, c) => sum + Math.pow(c - avgRecent, 2), 0) / capitals.length;
    const volatility = Math.sqrt(variance);
    const volatilityPct = avgRecent !== 0 ? (volatility / avgRecent) * 100 : 0;

    // 计算到当前轮次的盈亏数据
    const profitsUpToRound = results
      .filter((r: SingleRunResult) => r.trace && round < r.trace.length)
      .map((r: SingleRunResult) => {
        const capital = r.trace![round];
        return capital - initialCapital;
      });

    // 胜率计算
    const winningCount = profitsUpToRound.filter(p => p > 0).length;
    const losingCount = profitsUpToRound.filter(p => p < 0).length;
    const winRate = profitsUpToRound.length > 0 ? (winningCount / profitsUpToRound.length) * 100 : 0;

    // 平均盈亏
    const avgProfit = profitsUpToRound.length > 0 ? profitsUpToRound.reduce((a, b) => a + b, 0) / profitsUpToRound.length : 0;
    const avgWinAmount = winningCount > 0 ? profitsUpToRound.filter(p => p > 0).reduce((a, b) => a + b, 0) / winningCount : 0;
    const avgLossAmount = losingCount > 0 ? profitsUpToRound.filter(p => p < 0).reduce((a, b) => a + b, 0) / losingCount : 0;

    // 标准差
    const stdDev = profitsUpToRound.length > 0
      ? Math.sqrt(profitsUpToRound.reduce((sq, n) => sq + Math.pow(n - avgProfit, 2), 0) / profitsUpToRound.length)
      : 0;

    // 夏普比率
    const sharpeRatio = stdDev !== 0 ? avgProfit / stdDev : 0;

    // 索提诺比率
    const downside = profitsUpToRound.filter(p => p < 0);
    const downsideStdDev = downside.length > 0
      ? Math.sqrt(downside.reduce((sq, n) => sq + Math.pow(n, 2), 0) / downside.length)
      : 0;
    const sortinoRatio = downsideStdDev !== 0 ? avgProfit / downsideStdDev : 0;

    // 盈亏比
    const profitFactor = Math.abs(avgLossAmount) !== 0 ? Math.abs(avgWinAmount / avgLossAmount) : 0;

    // 回撤计算
    const drawdownsUpToRound = results
      .filter((r: SingleRunResult) => r.trace && round < r.trace.length)
      .map((r: SingleRunResult) => {
        if (!r.trace || r.trace.length === 0) return 0;
        const traceUpToRound = r.trace.slice(0, round + 1);
        let maxCapital = traceUpToRound[0];
        let maxDrawdown = 0;
        for (const capital of traceUpToRound) {
          maxCapital = Math.max(maxCapital, capital);
          const drawdown = maxCapital - capital;
          maxDrawdown = Math.max(maxDrawdown, drawdown);
        }
        return maxDrawdown;
      });

    const avgDrawdown = drawdownsUpToRound.length > 0 ? drawdownsUpToRound.reduce((a, b) => a + b, 0) / drawdownsUpToRound.length : 0;
    const maxDrawdown = drawdownsUpToRound.length > 0 ? Math.max(...drawdownsUpToRound) : 0;
    const avgDrawdownPct = initialCapital !== 0 ? (avgDrawdown / initialCapital) * 100 : 0;
    const maxDrawdownPct = initialCapital !== 0 ? (maxDrawdown / initialCapital) * 100 : 0;

    // 卡玛比率
    const calmarRatio = maxDrawdown !== 0 ? avgProfit / maxDrawdown : 0;

    // MAE/MFE计算
    const maesUpToRound = results
      .filter((r: SingleRunResult) => r.trace && round < r.trace.length)
      .map((r: SingleRunResult) => {
        if (!r.trace || r.trace.length === 0) return 0;
        const traceUpToRound = r.trace.slice(0, round + 1);
        return Math.max(0, traceUpToRound[0] - Math.min(...traceUpToRound));
      });

    const mfesUpToRound = results
      .filter((r: SingleRunResult) => r.trace && round < r.trace.length)
      .map((r: SingleRunResult) => {
        if (!r.trace || r.trace.length === 0) return 0;
        const traceUpToRound = r.trace.slice(0, round + 1);
        return Math.max(0, Math.max(...traceUpToRound) - traceUpToRound[0]);
      });

    const avgMAE = maesUpToRound.length > 0 ? maesUpToRound.reduce((a, b) => a + b, 0) / maesUpToRound.length : 0;
    const maxMAE = maesUpToRound.length > 0 ? Math.max(...maesUpToRound) : 0;
    const avgMFE = mfesUpToRound.length > 0 ? mfesUpToRound.reduce((a, b) => a + b, 0) / mfesUpToRound.length : 0;
    const maxMFE = mfesUpToRound.length > 0 ? Math.max(...mfesUpToRound) : 0;

    // R倍数
    const avgMAEForR = avgMAE !== 0 ? avgMAE : 1;
    const avgRMultiple = avgProfit / avgMAEForR;

    // 分布特征
    const coefficientOfVariation = avgProfit !== 0 ? (stdDev / Math.abs(avgProfit)) * 100 : 0;
    const skewness = stdDev !== 0 && profitsUpToRound.length > 0
      ? (profitsUpToRound.reduce((sum, n) => sum + Math.pow(n - avgProfit, 3), 0) / profitsUpToRound.length) / Math.pow(stdDev, 3)
      : 0;
    const kurtosis = stdDev !== 0 && profitsUpToRound.length > 0
      ? ((profitsUpToRound.reduce((sum, n) => sum + Math.pow(n - avgProfit, 4), 0) / profitsUpToRound.length) / Math.pow(stdDev, 4)) - 3
      : 0;

    // VaR/CVaR (95%)
    const sortedProfits = [...profitsUpToRound].sort((a, b) => a - b);
    const var95Index = Math.floor(sortedProfits.length * 0.05);
    const var95 = sortedProfits.length > 0 && var95Index >= 0 ? sortedProfits[var95Index] : 0;
    const var95Pct = initialCapital !== 0 ? (var95 / initialCapital) * 100 : 0;
    const cvar95 = sortedProfits.length > 0 && var95Index >= 0
      ? sortedProfits.slice(0, var95Index + 1).reduce((a, b) => a + b, 0) / (var95Index + 1)
      : 0;
    const cvar95Pct = initialCapital !== 0 ? (cvar95 / initialCapital) * 100 : 0;

    // Omega比率
    const gains = profitsUpToRound.filter(p => p > 0).reduce((a, b) => a + b, 0);
    const losses = Math.abs(profitsUpToRound.filter(p => p < 0).reduce((a, b) => a + b, 0));
    const omegaRatio = losses !== 0 ? gains / losses : 0;

    // 信息比率
    const informationRatio = stdDev !== 0 ? avgProfit / stdDev : 0;

    // Ulcer指数
    const ulcerIndex = drawdownsUpToRound.length > 0
      ? Math.sqrt(drawdownsUpToRound.reduce((sum, dd) => sum + dd * dd, 0) / drawdownsUpToRound.length)
      : 0;

    // Martin比率
    const martinRatio = ulcerIndex !== 0 ? avgProfit / ulcerIndex : 0;

    // 恢复因子
    const totalProfit = profitsUpToRound.reduce((a, b) => a + b, 0);
    const recoveryFactor = maxDrawdown !== 0 ? Math.abs(totalProfit / maxDrawdown) : 0;

    // 连续性统计
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let isWinning = false;

    profitsUpToRound.forEach((profit) => {
      if (profit > 0) {
        if (isWinning) {
          currentStreak++;
        } else {
          currentStreak = 1;
          isWinning = true;
        }
        maxWinStreak = Math.max(maxWinStreak, currentStreak);
      } else if (profit < 0) {
        if (!isWinning) {
          currentStreak++;
        } else {
          currentStreak = 1;
          isWinning = false;
        }
        maxLossStreak = Math.max(maxLossStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return {
      ...data,
      cumulativeProfit: Number(cumulativeProfit.toFixed(2)),
      cumulativeProfitPct: Number(cumulativeProfitPct.toFixed(2)),
      ongoingRate: Number(ongoingRate.toFixed(2)),
      volatility: Number(volatility.toFixed(2)),
      volatilityPct: Number(volatilityPct.toFixed(2)),
      activeRunsRate: Number(((runningCount / totalRuns) * 100).toFixed(2)),
      winRate: Number(winRate.toFixed(2)),
      avgProfit: Number(avgProfit.toFixed(2)),
      avgWinAmount: Number(avgWinAmount.toFixed(2)),
      avgLossAmount: Number(avgLossAmount.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      sharpeRatio: Number(sharpeRatio.toFixed(3)),
      sortinoRatio: Number(sortinoRatio.toFixed(3)),
      profitFactor: Number(profitFactor.toFixed(3)),
      avgDrawdown: Number(avgDrawdown.toFixed(2)),
      maxDrawdown: Number(maxDrawdown.toFixed(2)),
      avgDrawdownPct: Number(avgDrawdownPct.toFixed(2)),
      maxDrawdownPct: Number(maxDrawdownPct.toFixed(2)),
      calmarRatio: Number(calmarRatio.toFixed(3)),
      avgMAE: Number(avgMAE.toFixed(2)),
      maxMAE: Number(maxMAE.toFixed(2)),
      avgMFE: Number(avgMFE.toFixed(2)),
      maxMFE: Number(maxMFE.toFixed(2)),
      avgRMultiple: Number(avgRMultiple.toFixed(3)),
      coefficientOfVariation: Number(coefficientOfVariation.toFixed(2)),
      skewness: Number(skewness.toFixed(3)),
      kurtosis: Number(kurtosis.toFixed(3)),
      var95: Number(var95.toFixed(2)),
      var95Pct: Number(var95Pct.toFixed(2)),
      cvar95: Number(cvar95.toFixed(2)),
      cvar95Pct: Number(cvar95Pct.toFixed(2)),
      omegaRatio: Number(omegaRatio.toFixed(3)),
      informationRatio: Number(informationRatio.toFixed(3)),
      ulcerIndex: Number(ulcerIndex.toFixed(2)),
      martinRatio: Number(martinRatio.toFixed(3)),
      recoveryFactor: Number(recoveryFactor.toFixed(3)),
      maxWinStreak: maxWinStreak,
      maxLossStreak: maxLossStreak
    };
  });

  return (
    <div className={`${styles.metricsPanel} ${className}`}>
      <h2 className={styles.title}>策略绩效分析</h2>

      {/* 1. 资金变化时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          资金变化时间线
          <HelpIcon content="展示平均资金、最大资金、最小资金随轮次的变化趋势" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: '资金', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgCapital" stroke="#3b82f6" name="平均资金" strokeWidth={2} />
            <Line type="monotone" dataKey="medianCapital" stroke="#10b981" name="中位数资金" strokeWidth={2} />
            <Line type="monotone" dataKey="maxCapital" stroke="#22c55e" name="最大资金" strokeWidth={1} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="minCapital" stroke="#ef4444" name="最小资金" strokeWidth={1} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. 累计盈亏时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          累计盈亏时间线
          <HelpIcon content="展示平均盈亏金额和盈亏百分比随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: '盈亏金额', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '盈亏百分比 (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="cumulativeProfit" stroke="#3b82f6" name="累计盈亏" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="cumulativeProfitPct" stroke="#8b5cf6" name="盈亏百分比" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 3. 破产率和达标率时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          破产率和达标率时间线
          <HelpIcon content="展示破产率、达标率和进行中比率随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: '百分比 (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bankruptRate" stroke="#ef4444" name="破产率" strokeWidth={2} />
            <Line type="monotone" dataKey="successRate" stroke="#22c55e" name="达标率" strokeWidth={2} />
            <Line type="monotone" dataKey="ongoingRate" stroke="#f59e0b" name="进行中比率" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 4. 资金分位数时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          资金分位数时间线
          <HelpIcon content="展示资金的25分位、中位数和75分位随轮次的变化，反映资金分布情况" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: '资金', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="p75Capital" stroke="#22c55e" name="75分位资金" strokeWidth={2} />
            <Line type="monotone" dataKey="medianCapital" stroke="#3b82f6" name="中位数资金" strokeWidth={2} />
            <Line type="monotone" dataKey="p25Capital" stroke="#f59e0b" name="25分位资金" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 5. 波动率时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          资金波动率时间线
          <HelpIcon content="展示资金波动率随轮次的变化，反映策略的稳定性（使用10轮滑动窗口计算）" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: '波动率', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '波动率百分比 (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="volatility" stroke="#8b5cf6" name="波动率" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="volatilityPct" stroke="#ec4899" name="波动率百分比" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 6. 活跃运行数时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          活跃运行数时间线
          <HelpIcon content="展示每轮仍在运行（未破产也未达标）的模拟数量" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: '运行数', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '活跃率 (%)', angle: 90, position: 'insideRight' }}
              domain={[0, 100]}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="runningCount" stroke="#3b82f6" name="活跃运行数" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="activeRunsRate" stroke="#10b981" name="活跃率" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 7. 盈亏分析时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          盈亏分析时间线
          <HelpIcon content="展示胜率、平均盈利和平均亏损随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: '盈亏金额', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '胜率 (%)', angle: 90, position: 'insideRight' }}
              domain={[0, 100]}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="avgWinAmount" stroke="#22c55e" name="平均盈利" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="avgLossAmount" stroke="#ef4444" name="平均亏损" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#3b82f6" name="胜率" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 8. 风险指标时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          风险调整收益指标时间线
          <HelpIcon content="展示夏普比率、索提诺比率、卡玛比率随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: '比率值', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sharpeRatio" stroke="#3b82f6" name="夏普比率" strokeWidth={2} />
            <Line type="monotone" dataKey="sortinoRatio" stroke="#8b5cf6" name="索提诺比率" strokeWidth={2} />
            <Line type="monotone" dataKey="calmarRatio" stroke="#ec4899" name="卡玛比率" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 9. 回撤分析时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          回撤分析时间线
          <HelpIcon content="展示平均回撤和最大回撤（金额和百分比）随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: '回撤金额', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '回撤百分比 (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="avgDrawdown" stroke="#f59e0b" name="平均回撤" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="maxDrawdown" stroke="#ef4444" name="最大回撤" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="avgDrawdownPct" stroke="#fb923c" name="平均回撤%" strokeWidth={2} strokeDasharray="5 5" />
            <Line yAxisId="right" type="monotone" dataKey="maxDrawdownPct" stroke="#dc2626" name="最大回撤%" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 10. MAE/MFE分析时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          MAE/MFE分析时间线
          <HelpIcon content="展示最大不利偏移(MAE)和最大有利偏移(MFE)随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: '金额', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgMAE" stroke="#ef4444" name="平均MAE" strokeWidth={2} />
            <Line type="monotone" dataKey="maxMAE" stroke="#dc2626" name="最大MAE" strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="avgMFE" stroke="#22c55e" name="平均MFE" strokeWidth={2} />
            <Line type="monotone" dataKey="maxMFE" stroke="#16a34a" name="最大MFE" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 11. R倍数和盈亏比时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          R倍数和盈亏比时间线
          <HelpIcon content="展示平均R倍数和盈亏比随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: '比率', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgRMultiple" stroke="#3b82f6" name="平均R倍数" strokeWidth={2} />
            <Line type="monotone" dataKey="profitFactor" stroke="#8b5cf6" name="盈亏比" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 12. 分布特征时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          收益分布特征时间线
          <HelpIcon content="展示偏度、峰度和变异系数随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: '偏度/峰度', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '变异系数 (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="skewness" stroke="#3b82f6" name="偏度" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="kurtosis" stroke="#8b5cf6" name="峰度" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="coefficientOfVariation" stroke="#ec4899" name="变异系数" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 13. VaR/CVaR时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          风险价值(VaR/CVaR)时间线
          <HelpIcon content="展示95%置信度下的VaR和CVaR随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: '风险值', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '百分比 (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="var95" stroke="#ef4444" name="VaR(95%)" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="cvar95" stroke="#dc2626" name="CVaR(95%)" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="var95Pct" stroke="#fb923c" name="VaR%" strokeWidth={2} strokeDasharray="5 5" />
            <Line yAxisId="right" type="monotone" dataKey="cvar95Pct" stroke="#f97316" name="CVaR%" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 14. 高级收益指标时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          高级收益指标时间线
          <HelpIcon content="展示Omega比率、信息比率和恢复因子随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: '比率值', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="omegaRatio" stroke="#3b82f6" name="Omega比率" strokeWidth={2} />
            <Line type="monotone" dataKey="informationRatio" stroke="#8b5cf6" name="信息比率" strokeWidth={2} />
            <Line type="monotone" dataKey="recoveryFactor" stroke="#ec4899" name="恢复因子" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 15. Ulcer指数和Martin比率时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          Ulcer指数和Martin比率时间线
          <HelpIcon content="展示Ulcer指数和Martin比率随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: 'Ulcer指数', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Martin比率', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="ulcerIndex" stroke="#ef4444" name="Ulcer指数" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="martinRatio" stroke="#3b82f6" name="Martin比率" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 16. 连续性统计时间线 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>
          连续性统计时间线
          <HelpIcon content="展示最大连胜和最大连亏次数随轮次的变化" />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              label={{ value: '轮次', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: '连续次数', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="maxWinStreak" stroke="#22c55e" name="最大连胜" strokeWidth={2} />
            <Line type="monotone" dataKey="maxLossStreak" stroke="#ef4444" name="最大连亏" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 统计摘要 */}
      <div className={styles.summarySection}>
        <h3 className={styles.summaryTitle}>统计摘要</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>总模拟次数</span>
            <span className={styles.summaryValue}>{totalRuns}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>最大轮数</span>
            <span className={styles.summaryValue}>{maxRounds}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>初始资金</span>
            <span className={styles.summaryValue}>{initialCapital.toFixed(2)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>最终平均资金</span>
            <span className={styles.summaryValue}>
              {derivedTimelineData[derivedTimelineData.length - 1]?.avgCapital.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>最终破产率</span>
            <span className={`${styles.summaryValue} ${styles.danger}`}>
              {derivedTimelineData[derivedTimelineData.length - 1]?.bankruptRate.toFixed(2) || '0.00'}%
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>最终达标率</span>
            <span className={`${styles.summaryValue} ${styles.success}`}>
              {derivedTimelineData[derivedTimelineData.length - 1]?.successRate.toFixed(2) || '0.00'}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsTimeline;
