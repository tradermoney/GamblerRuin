import { useState } from 'react';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Translation {
  [key: string]: string;
}

const languages: Language[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const translations: { [lang: string]: Translation } = {
  zh: {
    'simulation.title': '赌徒破产模拟器',
    'simulation.description': '交互式赌徒破产问题仿真系统',
    'config.title': '参数配置',
    'config.initialCapital': '初始资金',
    'config.targetCapital': '目标资金',
    'config.betSize': '下注金额',
    'config.winProbability': '获胜概率',
    'config.oddRatio': '赔率',
    'config.maxRounds': '最大轮次',
    'config.bettingStrategy': '下注策略',
    'config.strategy.fixed': '固定下注',
    'config.strategy.martingale': '马丁格尔',
    'config.strategy.proportional': '比例下注',
    'config.proportion': '比例',
    'config.randomSeed': '随机种子',
    'config.batchRuns': '批量运行次数',
    'control.start': '开始模拟',
    'control.pause': '暂停',
    'control.resume': '继续',
    'control.stop': '停止',
    'control.reset': '重置',
    'control.speed': '模拟速度',
    'display.title': '模拟展示',
    'display.currentCapital': '当前资金',
    'display.currentRound': '当前轮次',
    'display.status': '状态',
    'display.status.waiting': '等待开始',
    'display.status.running': '进行中',
    'display.status.paused': '已暂停',
    'display.status.bankrupt': '已破产',
    'display.status.success': '达到目标',
    'display.result.finalCapital': '最终资金',
    'display.result.totalRounds': '总轮次',
    'display.result.bankrupt': '破产',
    'display.result.reachedTarget': '达标',
    'visualization.title': '可视化分析',
    'visualization.outcomeDistribution': '结果分布',
    'visualization.roundsDistribution': '轮次分布',
    'visualization.finalCapital': '最终资金分布',
    'visualization.statistics': '统计摘要',
    'visualization.totalRuns': '总运行次数',
    'visualization.bankruptcyRate': '破产率',
    'visualization.successRate': '成功率',
    'visualization.averageRounds': '平均轮次',
    'export.title': '数据导出',
    'export.csv': '导出CSV数据',
    'export.report': '导出完整报告',
    'export.config': '导出当前配置',
    'export.import': '导入配置文件',
    'export.preview': '数据预览',
    'export.records': '总记录数',
    'export.help': '使用说明'
  },
  en: {
    'simulation.title': 'Gambler\'s Ruin Simulator',
    'simulation.description': 'Interactive Gambler\'s Ruin Problem Simulation System',
    'config.title': 'Parameter Configuration',
    'config.initialCapital': 'Initial Capital',
    'config.targetCapital': 'Target Capital',
    'config.betSize': 'Bet Size',
    'config.winProbability': 'Win Probability',
    'config.oddRatio': 'Odd Ratio',
    'config.maxRounds': 'Max Rounds',
    'config.bettingStrategy': 'Betting Strategy',
    'config.strategy.fixed': 'Fixed Betting',
    'config.strategy.martingale': 'Martingale',
    'config.strategy.proportional': 'Proportional Betting',
    'config.proportion': 'Proportion',
    'config.randomSeed': 'Random Seed',
    'config.batchRuns': 'Batch Runs',
    'control.start': 'Start Simulation',
    'control.pause': 'Pause',
    'control.resume': 'Resume',
    'control.stop': 'Stop',
    'control.reset': 'Reset',
    'control.speed': 'Simulation Speed',
    'display.title': 'Simulation Display',
    'display.currentCapital': 'Current Capital',
    'display.currentRound': 'Current Round',
    'display.status': 'Status',
    'display.status.waiting': 'Waiting to Start',
    'display.status.running': 'Running',
    'display.status.paused': 'Paused',
    'display.status.bankrupt': 'Bankrupt',
    'display.status.success': 'Target Reached',
    'display.result.finalCapital': 'Final Capital',
    'display.result.totalRounds': 'Total Rounds',
    'display.result.bankrupt': 'Bankrupt',
    'display.result.reachedTarget': 'Target Reached',
    'visualization.title': 'Visualization Analysis',
    'visualization.outcomeDistribution': 'Outcome Distribution',
    'visualization.roundsDistribution': 'Rounds Distribution',
    'visualization.finalCapital': 'Final Capital Distribution',
    'visualization.statistics': 'Statistics Summary',
    'visualization.totalRuns': 'Total Runs',
    'visualization.bankruptcyRate': 'Bankruptcy Rate',
    'visualization.successRate': 'Success Rate',
    'visualization.averageRounds': 'Average Rounds',
    'export.title': 'Data Export',
    'export.csv': 'Export CSV Data',
    'export.report': 'Export Full Report',
    'export.config': 'Export Current Config',
    'export.import': 'Import Config File',
    'export.preview': 'Data Preview',
    'export.records': 'Total Records',
    'export.help': 'Usage Instructions'
  }
};

export const useI18n = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('zh');

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || key;
  };

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    languages
  };
};

export default useI18n;