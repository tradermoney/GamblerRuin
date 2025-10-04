import { useState, useEffect } from 'react';
import SimulationDisplay from '../components/SimulationDisplay';
import VisualizationPanel from '../components/VisualizationPanel';
import ControlPanel from '../components/ControlPanel';
import DataExportPanel from '../components/DataExportPanel';
import PersistenceTest from '../components/PersistenceTest';
import PerformanceMetricsTimeline from '../components/PerformanceMetricsTimeline';
import useSimulationStore from '../store/simulationStore';
import './Simulator.css';

function Simulator() {
  const [showTestPanel] = useState(false);
  const { restoreConfig } = useSimulationStore();


  // 应用启动时恢复配置
  useEffect(() => {
    restoreConfig();
  }, [restoreConfig]);

  return (
    <div className="simulator-page">
      {/* 主要内容 */}
      <main className="simulator-main">
        {/* 垂直堆叠布局 */}
        <div className="vertical-layout">
          {/* 1. 控制面板（包含参数设置） */}
          <div className="panel-section">
            <ControlPanel />
          </div>

          {/* 2. 模拟展示 */}
          <div className="panel-section">
            <SimulationDisplay />
          </div>

          {/* 3. 可视化分析 */}
          <div className="panel-section">
            <VisualizationPanel />
          </div>

          {/* 4. 策略绩效分析 */}
          <div className="panel-section">
            <PerformanceMetricsTimeline />
          </div>

          {/* 5. 数据导出 */}
          <div className="panel-section">
            <DataExportPanel />
          </div>

          {/* 6. 持久化测试面板 (开发模式) */}
          {showTestPanel && (
            <div className="panel-section">
              <PersistenceTest />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Simulator;
