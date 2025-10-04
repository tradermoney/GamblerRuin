import React from 'react';
import useSimulationStore from '../store/simulationStore';
import type { SingleRunResult } from '../types/simulation';
import HelpIcon from './HelpIcon';
import styles from './PerformanceMetrics.module.css';

interface PerformanceMetricsProps {
  className?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ className = '' }) => {
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

  // 计算各类指标
  const bankruptCount = results.filter((r: SingleRunResult) => r.bankrupt).length;
  const successCount = results.filter((r: SingleRunResult) => r.reachedTarget).length;
  const ongoingCount = results.filter((r: SingleRunResult) => !r.bankrupt && !r.reachedTarget).length;

  // 基础统计
  const bankruptRate = (bankruptCount / totalRuns) * 100;
  const successRate = (successCount / totalRuns) * 100;
  const ongoingRate = (ongoingCount / totalRuns) * 100;

  // 轮次统计
  const rounds = results.map((r: SingleRunResult) => r.rounds);
  const avgRounds = rounds.reduce((a, b) => a + b, 0) / totalRuns;
  const maxRounds = Math.max(...rounds);
  const minRounds = Math.min(...rounds);
  const medianRounds = [...rounds].sort((a, b) => a - b)[Math.floor(totalRuns / 2)];

  // 资金统计
  const finalCapitals = results.map((r: SingleRunResult) => r.finalCapital);
  const avgFinalCapital = finalCapitals.reduce((a, b) => a + b, 0) / totalRuns;
  const maxFinalCapital = Math.max(...finalCapitals);
  const minFinalCapital = Math.min(...finalCapitals);
  const medianFinalCapital = [...finalCapitals].sort((a, b) => a - b)[Math.floor(totalRuns / 2)];

  // 盈亏统计
  const initialCapital = batchResult.results[0].trace?.[0] || 0;
  const profits = finalCapitals.map(fc => fc - initialCapital);
  const totalProfit = profits.reduce((a, b) => a + b, 0);
  const avgProfit = totalProfit / totalRuns;
  const maxProfit = Math.max(...profits);
  const maxLoss = Math.min(...profits);

  const winningRuns = profits.filter(p => p > 0).length;
  const losingRuns = profits.filter(p => p < 0).length;
  const winRate = (winningRuns / totalRuns) * 100;

  const avgWinAmount = winningRuns > 0 ? profits.filter(p => p > 0).reduce((a, b) => a + b, 0) / winningRuns : 0;
  const avgLossAmount = losingRuns > 0 ? profits.filter(p => p < 0).reduce((a, b) => a + b, 0) / losingRuns : 0;

  // 风险指标
  const stdDev = Math.sqrt(profits.reduce((sq, n) => sq + Math.pow(n - avgProfit, 2), 0) / totalRuns);
  const sharpeRatio = stdDev !== 0 ? avgProfit / stdDev : 0;
  const profitFactor = avgLossAmount !== 0 ? Math.abs(avgWinAmount / avgLossAmount) : 0;
  const expectancy = avgProfit;

  // 回撤统计
  const drawdowns = results.map((r: SingleRunResult) => {
    if (!r.trace || r.trace.length === 0) return 0;
    let maxCapital = r.trace[0];
    let maxDrawdown = 0;
    for (const capital of r.trace) {
      maxCapital = Math.max(maxCapital, capital);
      const drawdown = maxCapital - capital;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
    return maxDrawdown;
  });
  const avgDrawdown = drawdowns.reduce((a, b) => a + b, 0) / totalRuns;
  const maxDrawdown = Math.max(...drawdowns);
  const avgDrawdownPct = initialCapital !== 0 ? (avgDrawdown / initialCapital) * 100 : 0;
  const maxDrawdownPct = initialCapital !== 0 ? (maxDrawdown / initialCapital) * 100 : 0;

  // 连续盈亏
  let currentStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let isWinning = false;

  profits.forEach((profit) => {
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

  // 收益率
  const totalReturnPct = initialCapital !== 0 ? (totalProfit / (initialCapital * totalRuns)) * 100 : 0;
  const avgReturnPct = initialCapital !== 0 ? (avgProfit / initialCapital) * 100 : 0;
  const maxReturnPct = initialCapital !== 0 ? (maxProfit / initialCapital) * 100 : 0;
  const maxLossPct = initialCapital !== 0 ? (maxLoss / initialCapital) * 100 : 0;

  // Kelly准则相关
  const kellyPercentage = winRate > 0 && Math.abs(avgLossAmount) > 0
    ? ((winRate / 100) - ((100 - winRate) / 100) / Math.abs(avgWinAmount / avgLossAmount)) * 100
    : 0;

  // 风险调整收益
  const calmarRatio = maxDrawdown !== 0 ? avgProfit / maxDrawdown : 0;
  const sortinoRatio = (() => {
    const downside = profits.filter(p => p < 0);
    if (downside.length === 0) return 0;
    const downsideStdDev = Math.sqrt(downside.reduce((sq, n) => sq + Math.pow(n, 2), 0) / downside.length);
    return downsideStdDev !== 0 ? avgProfit / downsideStdDev : 0;
  })();

  // 更多量化交易指标
  // 最大不利偏移（Maximum Adverse Excursion, MAE）
  const maes = results.map((r: SingleRunResult) => {
    if (!r.trace || r.trace.length === 0) return 0;
    return Math.max(0, r.trace[0] - Math.min(...r.trace));
  });
  const avgMAE = maes.reduce((a, b) => a + b, 0) / totalRuns;
  const maxMAE = Math.max(...maes);

  // 最大有利偏移（Maximum Favorable Excursion, MFE）
  const mfes = results.map((r: SingleRunResult) => {
    if (!r.trace || r.trace.length === 0) return 0;
    return Math.max(0, Math.max(...r.trace) - r.trace[0]);
  });
  const avgMFE = mfes.reduce((a, b) => a + b, 0) / totalRuns;
  const maxMFE = Math.max(...mfes);

  // R倍数（R-Multiple）
  const rMultiples = results.map((_r: SingleRunResult, idx: number) => {
    if (maes[idx] === 0) return 0;
    return profits[idx] / maes[idx];
  });
  const avgRMultiple = rMultiples.reduce((a, b) => a + b, 0) / totalRuns;

  // 恢复因子（Recovery Factor）
  const recoveryFactor = maxDrawdown !== 0 ? Math.abs(totalProfit / maxDrawdown) : 0;

  // Omega比率
  const omegaRatio = (() => {
    const gains = profits.filter(p => p > 0).reduce((a, b) => a + b, 0);
    const losses = Math.abs(profits.filter(p => p < 0).reduce((a, b) => a + b, 0));
    return losses !== 0 ? gains / losses : 0;
  })();

  // 变异系数（Coefficient of Variation）
  const coefficientOfVariation = avgProfit !== 0 ? (stdDev / Math.abs(avgProfit)) * 100 : 0;

  // 偏度（Skewness）
  const skewness = (() => {
    const cubed = profits.reduce((sum, n) => sum + Math.pow(n - avgProfit, 3), 0) / totalRuns;
    return stdDev !== 0 ? cubed / Math.pow(stdDev, 3) : 0;
  })();

  // 峰度（Kurtosis）
  const kurtosis = (() => {
    const fourth = profits.reduce((sum, n) => sum + Math.pow(n - avgProfit, 4), 0) / totalRuns;
    return stdDev !== 0 ? (fourth / Math.pow(stdDev, 4)) - 3 : 0;
  })();

  // VaR（Value at Risk）- 95%置信度
  const sortedLosses = [...profits].sort((a, b) => a - b);
  const var95Index = Math.floor(totalRuns * 0.05);
  const var95 = sortedLosses[var95Index];
  const var95Pct = initialCapital !== 0 ? (var95 / initialCapital) * 100 : 0;

  // CVaR（Conditional Value at Risk）- 95%置信度
  const cvar95 = sortedLosses.slice(0, var95Index + 1).reduce((a, b) => a + b, 0) / (var95Index + 1);
  const cvar95Pct = initialCapital !== 0 ? (cvar95 / initialCapital) * 100 : 0;

  // 信息比率（Information Ratio）
  const informationRatio = stdDev !== 0 ? avgProfit / stdDev : 0;

  // 资金使用效率
  const capitalEfficiency = avgRounds !== 0 ? avgProfit / avgRounds : 0;

  // 风险收益比
  const riskRewardRatio = Math.abs(avgLossAmount) !== 0 ? avgWinAmount / Math.abs(avgLossAmount) : 0;

  // Ulcer指数
  const ulcerIndex = Math.sqrt(drawdowns.reduce((sum, dd) => sum + dd * dd, 0) / totalRuns);

  // Martin比率
  const martinRatio = ulcerIndex !== 0 ? avgProfit / ulcerIndex : 0;

  // 稳定性系数（基于资金曲线的线性回归R²）
  const stabilityCoefficient = (() => {
    if (results.length === 0 || !results[0].trace) return 0;

    // 使用平均资金曲线
    const maxLength = Math.max(...results.map((r: SingleRunResult) => r.trace?.length || 0));
    const avgCurve: number[] = [];

    for (let i = 0; i < maxLength; i++) {
      let sum = 0;
      let count = 0;
      results.forEach((r: SingleRunResult) => {
        if (r.trace && i < r.trace.length) {
          sum += r.trace[i];
          count++;
        }
      });
      avgCurve.push(count > 0 ? sum / count : 0);
    }

    // 计算线性回归R²
    if (avgCurve.length < 2) return 0;

    const n = avgCurve.length;
    const xMean = (n - 1) / 2;
    const yMean = avgCurve.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = i - xMean;
      const yDiff = avgCurve[i] - yMean;
      numerator += xDiff * yDiff;
      denomX += xDiff * xDiff;
      denomY += yDiff * yDiff;
    }

    if (denomX === 0 || denomY === 0) return 0;
    const correlation = numerator / Math.sqrt(denomX * denomY);
    return correlation * correlation;
  })();

  // 交易质量指标
  const tradeQuality = (() => {
    if (totalRuns === 0) return 0;
    // 综合考虑胜率、盈亏比和期望值
    const normalizedWinRate = winRate / 100;
    const normalizedProfitFactor = Math.min(profitFactor / 2, 1); // 归一化到0-1
    const normalizedExpectancy = expectancy > 0 ? Math.min(expectancy / initialCapital, 1) : 0;
    return ((normalizedWinRate * 0.3 + normalizedProfitFactor * 0.4 + normalizedExpectancy * 0.3) * 100);
  })();

  // 破产概率（简化版）
  const bankruptcyProbability = (bankruptCount / totalRuns) * 100;

  const metrics = [
    {
      category: '基础统计',
      items: [
        { label: '总运行次数', value: totalRuns, tooltip: '批量模拟的总次数' },
        { label: '破产率', value: `${bankruptRate.toFixed(2)}%`, tooltip: '资金归零的比例', danger: bankruptRate > 50 },
        { label: '达标率', value: `${successRate.toFixed(2)}%`, tooltip: '达到目标资金的比例', success: successRate > 50 },
        { label: '进行中比率', value: `${ongoingRate.toFixed(2)}%`, tooltip: '未破产也未达标的比例' }
      ]
    },
    {
      category: '轮次统计',
      items: [
        { label: '平均轮数', value: avgRounds.toFixed(1), tooltip: '所有模拟的平均投注轮数' },
        { label: '中位轮数', value: medianRounds, tooltip: '轮数的中位数' },
        { label: '最大轮数', value: maxRounds, tooltip: '单次模拟的最大轮数' },
        { label: '最小轮数', value: minRounds, tooltip: '单次模拟的最小轮数' }
      ]
    },
    {
      category: '资金统计',
      items: [
        { label: '初始资金', value: initialCapital.toFixed(2), tooltip: '每次模拟的起始资金' },
        { label: '平均最终资金', value: avgFinalCapital.toFixed(2), tooltip: '所有模拟结束时的平均资金' },
        { label: '中位最终资金', value: medianFinalCapital.toFixed(2), tooltip: '最终资金的中位数' },
        { label: '最大最终资金', value: maxFinalCapital.toFixed(2), tooltip: '单次模拟的最大最终资金', success: true },
        { label: '最小最终资金', value: minFinalCapital.toFixed(2), tooltip: '单次模拟的最小最终资金', danger: minFinalCapital === 0 }
      ]
    },
    {
      category: '盈亏分析',
      items: [
        { label: '总盈亏', value: totalProfit.toFixed(2), tooltip: '所有模拟的总盈亏', success: totalProfit > 0, danger: totalProfit < 0 },
        { label: '平均盈亏', value: avgProfit.toFixed(2), tooltip: '每次模拟的平均盈亏', success: avgProfit > 0, danger: avgProfit < 0 },
        { label: '最大盈利', value: maxProfit.toFixed(2), tooltip: '单次模拟的最大盈利', success: true },
        { label: '最大亏损', value: maxLoss.toFixed(2), tooltip: '单次模拟的最大亏损', danger: true },
        { label: '盈利次数', value: winningRuns, tooltip: '盈利的模拟次数' },
        { label: '亏损次数', value: losingRuns, tooltip: '亏损的模拟次数' },
        { label: '胜率', value: `${winRate.toFixed(2)}%`, tooltip: '盈利模拟占总模拟的比例', success: winRate > 50, danger: winRate < 50 },
        { label: '平均盈利金额', value: avgWinAmount.toFixed(2), tooltip: '盈利模拟的平均盈利金额' },
        { label: '平均亏损金额', value: avgLossAmount.toFixed(2), tooltip: '亏损模拟的平均亏损金额' }
      ]
    },
    {
      category: '收益率',
      items: [
        { label: '总收益率', value: `${totalReturnPct.toFixed(2)}%`, tooltip: '总盈亏占总投入资金的比例', success: totalReturnPct > 0, danger: totalReturnPct < 0 },
        { label: '平均收益率', value: `${avgReturnPct.toFixed(2)}%`, tooltip: '平均盈亏占初始资金的比例', success: avgReturnPct > 0, danger: avgReturnPct < 0 },
        { label: '最大收益率', value: `${maxReturnPct.toFixed(2)}%`, tooltip: '最大盈利占初始资金的比例', success: true },
        { label: '最大亏损率', value: `${maxLossPct.toFixed(2)}%`, tooltip: '最大亏损占初始资金的比例', danger: true }
      ]
    },
    {
      category: '风险指标',
      items: [
        { label: '标准差', value: stdDev.toFixed(2), tooltip: '盈亏的波动程度，越小越稳定' },
        { label: '夏普比率', value: sharpeRatio.toFixed(3), tooltip: '风险调整后的收益率，越大越好', success: sharpeRatio > 1, danger: sharpeRatio < 0 },
        { label: '索提诺比率', value: sortinoRatio.toFixed(3), tooltip: '下行风险调整后的收益率，越大越好', success: sortinoRatio > 1, danger: sortinoRatio < 0 },
        { label: '卡玛比率', value: calmarRatio.toFixed(3), tooltip: '收益与最大回撤的比率，越大越好', success: calmarRatio > 1, danger: calmarRatio < 0 },
        { label: '盈亏比', value: profitFactor.toFixed(3), tooltip: '平均盈利与平均亏损的比率，>1表示盈利', success: profitFactor > 1, danger: profitFactor < 1 },
        { label: '期望值', value: expectancy.toFixed(2), tooltip: '每次投注的期望盈亏', success: expectancy > 0, danger: expectancy < 0 }
      ]
    },
    {
      category: '回撤分析',
      items: [
        { label: '平均回撤', value: avgDrawdown.toFixed(2), tooltip: '资金回撤的平均值' },
        { label: '最大回撤', value: maxDrawdown.toFixed(2), tooltip: '资金回撤的最大值', danger: true },
        { label: '平均回撤率', value: `${avgDrawdownPct.toFixed(2)}%`, tooltip: '平均回撤占初始资金的比例' },
        { label: '最大回撤率', value: `${maxDrawdownPct.toFixed(2)}%`, tooltip: '最大回撤占初始资金的比例', danger: maxDrawdownPct > 30 }
      ]
    },
    {
      category: '连续性统计',
      items: [
        { label: '最大连胜', value: maxWinStreak, tooltip: '连续盈利的最大次数', success: true },
        { label: '最大连亏', value: maxLossStreak, tooltip: '连续亏损的最大次数', danger: true }
      ]
    },
    {
      category: '资金管理',
      items: [
        { label: 'Kelly百分比', value: `${kellyPercentage.toFixed(2)}%`, tooltip: 'Kelly准则建议的最优投注比例', success: kellyPercentage > 0 && kellyPercentage < 25, danger: kellyPercentage < 0 || kellyPercentage > 50 }
      ]
    },
    {
      category: '高级风险指标',
      items: [
        { label: 'VaR(95%)', value: var95.toFixed(2), tooltip: '95%置信度下的最大损失预期值', danger: true },
        { label: 'VaR(95%)百分比', value: `${var95Pct.toFixed(2)}%`, tooltip: 'VaR占初始资金的比例', danger: var95Pct < -20 },
        { label: 'CVaR(95%)', value: cvar95.toFixed(2), tooltip: '95%置信度下的条件风险值，超过VaR的平均损失', danger: true },
        { label: 'CVaR(95%)百分比', value: `${cvar95Pct.toFixed(2)}%`, tooltip: 'CVaR占初始资金的比例', danger: cvar95Pct < -30 },
        { label: 'Ulcer指数', value: ulcerIndex.toFixed(2), tooltip: '衡量回撤深度和持续时间的综合指标', danger: ulcerIndex > initialCapital * 0.3 },
        { label: 'Martin比率', value: martinRatio.toFixed(3), tooltip: '收益与Ulcer指数的比率，越大越好', success: martinRatio > 0.5, danger: martinRatio < 0 }
      ]
    },
    {
      category: '高级收益指标',
      items: [
        { label: 'Omega比率', value: omegaRatio.toFixed(3), tooltip: '总盈利与总亏损的比率，>1表示盈利', success: omegaRatio > 1, danger: omegaRatio < 1 },
        { label: '信息比率', value: informationRatio.toFixed(3), tooltip: '每单位风险的超额收益，越大越好', success: informationRatio > 0.5, danger: informationRatio < 0 },
        { label: '恢复因子', value: recoveryFactor.toFixed(3), tooltip: '总盈利与最大回撤的比率，>1表示能够从回撤中恢复', success: recoveryFactor > 1, danger: recoveryFactor < 0.5 },
        { label: '资金使用效率', value: capitalEfficiency.toFixed(4), tooltip: '每轮投注的平均收益，衡量资金利用效率' }
      ]
    },
    {
      category: 'MAE/MFE分析',
      items: [
        { label: '平均MAE', value: avgMAE.toFixed(2), tooltip: '平均最大不利偏移，表示平均最大浮亏' },
        { label: '最大MAE', value: maxMAE.toFixed(2), tooltip: '最大不利偏移的最大值', danger: true },
        { label: '平均MFE', value: avgMFE.toFixed(2), tooltip: '平均最大有利偏移，表示平均最大浮盈', success: true },
        { label: '最大MFE', value: maxMFE.toFixed(2), tooltip: '最大有利偏移的最大值', success: true },
        { label: '平均R倍数', value: avgRMultiple.toFixed(3), tooltip: '平均收益与风险的倍数关系，>1表示收益大于风险', success: avgRMultiple > 1, danger: avgRMultiple < 0 },
        { label: '风险收益比', value: riskRewardRatio.toFixed(3), tooltip: '平均盈利与平均亏损的比率', success: riskRewardRatio > 1.5, danger: riskRewardRatio < 1 }
      ]
    },
    {
      category: '分布特征',
      items: [
        { label: '变异系数', value: `${coefficientOfVariation.toFixed(2)}%`, tooltip: '收益的相对波动性，越小越稳定', success: coefficientOfVariation < 50, danger: coefficientOfVariation > 100 },
        { label: '偏度', value: skewness.toFixed(3), tooltip: '收益分布的对称性，>0表示正偏（大盈利概率高），<0表示负偏（大亏损概率高）', success: skewness > 0, danger: skewness < -0.5 },
        { label: '峰度', value: kurtosis.toFixed(3), tooltip: '收益分布的尖峰特征，>0表示极端值较多，<0表示分布较平缓', danger: Math.abs(kurtosis) > 3 },
        { label: '稳定性系数', value: stabilityCoefficient.toFixed(3), tooltip: '资金曲线的稳定性(R²)，越接近1越稳定', success: stabilityCoefficient > 0.8, danger: stabilityCoefficient < 0.5 }
      ]
    },
    {
      category: '综合评估',
      items: [
        { label: '交易质量评分', value: tradeQuality.toFixed(2), tooltip: '综合胜率、盈亏比和期望值的质量评分(0-100)', success: tradeQuality > 60, danger: tradeQuality < 40 },
        { label: '破产概率', value: `${bankruptcyProbability.toFixed(2)}%`, tooltip: '基于历史模拟的破产概率估计', danger: bankruptcyProbability > 30, success: bankruptcyProbability < 10 }
      ]
    }
  ];

  return (
    <div className={`${styles.metricsPanel} ${className}`}>
      <h2 className={styles.title}>策略绩效分析</h2>

      {metrics.map((category, index) => (
        <div key={index} className={styles.category}>
          <h3 className={styles.categoryTitle}>{category.category}</h3>
          <div className={styles.metricsGrid}>
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className={styles.metricItem}>
                <div className={styles.metricLabel}>
                  {item.label}
                  <HelpIcon content={item.tooltip} />
                </div>
                <div className={`${styles.metricValue} ${
                  item.success ? styles.success : item.danger ? styles.danger : ''
                }`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetrics;
