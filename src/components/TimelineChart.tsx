import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './TimelineChart.module.css';

interface TimelineChartProps {
  type: 'bankruptcy' | 'target' | 'duration' | 'capital';
}

const TimelineChart: React.FC<TimelineChartProps> = ({ type }) => {
  // 生成模拟数据
  const generateData = () => {
    switch (type) {
      case 'bankruptcy':
        // 破产概率随轮次增加的变化
        return Array.from({ length: 50 }, (_, i) => ({
          round: i * 10,
          probability: Math.min(1, 0.05 + i * 0.018 + Math.random() * 0.02)
        }));

      case 'target':
        // 达到目标概率随轮次增加的变化
        return Array.from({ length: 50 }, (_, i) => ({
          round: i * 10,
          probability: Math.max(0, 0.95 - i * 0.018 - Math.random() * 0.02)
        }));

      case 'duration':
        // 不同初始资金下的平均游戏时长
        return [
          { capital: 10, rounds: 45 },
          { capital: 20, rounds: 120 },
          { capital: 30, rounds: 210 },
          { capital: 40, rounds: 320 },
          { capital: 50, rounds: 450 },
          { capital: 60, rounds: 580 },
          { capital: 70, rounds: 720 },
          { capital: 80, rounds: 880 },
          { capital: 90, rounds: 1050 }
        ];

      case 'capital': {
        // 典型的资金变化轨迹
        let capital = 50;
        const data = [{ round: 0, capital: 50 }];
        for (let i = 1; i <= 100; i++) {
          const change = Math.random() > 0.48 ? 1 : -1;
          capital = Math.max(0, Math.min(100, capital + change));
          data.push({ round: i, capital });
          if (capital === 0 || capital === 100) break;
        }
        return data;
      }

      default:
        return [];
    }
  };

  const data = generateData();

  const getChartConfig = () => {
    switch (type) {
      case 'bankruptcy':
        return {
          title: '破产概率随轮次变化',
          dataKey: 'probability',
          xAxisLabel: '轮次',
          yAxisLabel: '破产概率',
          lineColor: '#ef4444',
          xKey: 'round',
          yDomain: [0, 1] as [number, number]
        };

      case 'target':
        return {
          title: '达标概率随轮次变化',
          dataKey: 'probability',
          xAxisLabel: '轮次',
          yAxisLabel: '达标概率',
          lineColor: '#10b981',
          xKey: 'round',
          yDomain: [0, 1] as [number, number]
        };

      case 'duration':
        return {
          title: '不同初始资金的游戏时长',
          dataKey: 'rounds',
          xAxisLabel: '初始资金',
          yAxisLabel: '平均轮数',
          lineColor: '#3b82f6',
          xKey: 'capital',
          yDomain: undefined
        };

      case 'capital':
        return {
          title: '资金随轮次的变化',
          dataKey: 'capital',
          xAxisLabel: '轮次',
          yAxisLabel: '资金',
          lineColor: '#8b5cf6',
          xKey: 'round',
          yDomain: undefined
        };

      default:
        return {
          title: '',
          dataKey: '',
          xAxisLabel: '',
          yAxisLabel: '',
          lineColor: '#64748b',
          xKey: '',
          yDomain: undefined
        };
    }
  };

  const config = getChartConfig();

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={config.xKey}
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            label={{ value: config.xAxisLabel, position: 'insideBottom', offset: -5, fontSize: 11 }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            domain={config.yDomain}
            label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Line
            type="monotone"
            dataKey={config.dataKey}
            stroke={config.lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
