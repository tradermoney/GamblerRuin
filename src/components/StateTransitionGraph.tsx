import React from 'react';
import styles from './StateTransitionGraph.module.css';

const StateTransitionGraph: React.FC = () => {
  return (
    <div className={styles.graphContainer}>
      <svg viewBox="0 0 800 400" className={styles.svg}>
        {/* 定义箭头标记 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
          </marker>
          <marker
            id="arrowhead-win"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
          </marker>
          <marker
            id="arrowhead-lose"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
          </marker>
        </defs>

        {/* 破产节点 (左边) */}
        <g className={styles.bankruptNode}>
          <circle cx="100" cy="200" r="50" />
          <text x="100" y="195" textAnchor="middle" className={styles.nodeLabel}>
            破产
          </text>
          <text x="100" y="215" textAnchor="middle" className={styles.nodeSubLabel}>
            资金 = 0
          </text>
        </g>

        {/* 初始状态节点 (中间偏左) */}
        <g className={styles.initialNode}>
          <circle cx="280" cy="200" r="50" />
          <text x="280" y="195" textAnchor="middle" className={styles.nodeLabel}>
            初始状态
          </text>
          <text x="280" y="215" textAnchor="middle" className={styles.nodeSubLabel}>
            资金 = k
          </text>
        </g>

        {/* 中间状态节点 (中间偏右) */}
        <g className={styles.intermediateNode}>
          <circle cx="520" cy="200" r="50" />
          <text x="520" y="195" textAnchor="middle" className={styles.nodeLabel}>
            游戏中
          </text>
          <text x="520" y="215" textAnchor="middle" className={styles.nodeSubLabel}>
            0 &lt; 资金 &lt; N
          </text>
        </g>

        {/* 达标节点 (右边) */}
        <g className={styles.targetNode}>
          <circle cx="700" cy="200" r="50" />
          <text x="700" y="195" textAnchor="middle" className={styles.nodeLabel}>
            达标
          </text>
          <text x="700" y="215" textAnchor="middle" className={styles.nodeSubLabel}>
            资金 = N
          </text>
        </g>

        {/* 初始 -> 中间 箭头 */}
        <line
          x1="330"
          y1="200"
          x2="470"
          y2="200"
          className={styles.arrow}
          markerEnd="url(#arrowhead)"
        />
        <text x="400" y="190" textAnchor="middle" className={styles.arrowLabel}>
          开始游戏
        </text>

        {/* 中间 -> 破产 箭头 (输的路径，向下弯曲) */}
        <path
          d="M 475 230 Q 290 300, 135 230"
          className={styles.arrowLose}
          fill="none"
          markerEnd="url(#arrowhead-lose)"
        />
        <text x="280" y="310" textAnchor="middle" className={styles.arrowLabelLose}>
          输 (1-p)
        </text>

        {/* 中间 -> 达标 箭头 (赢的路径，向上弯曲) */}
        <path
          d="M 565 170 Q 632 100, 685 160"
          className={styles.arrowWin}
          fill="none"
          markerEnd="url(#arrowhead-win)"
        />
        <text x="632" y="90" textAnchor="middle" className={styles.arrowLabelWin}>
          赢 (p)
        </text>

        {/* 中间状态自循环 (继续游戏) */}
        <path
          d="M 520 150 Q 520 80, 520 150"
          className={styles.arrowLoop}
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <text x="520" y="70" textAnchor="middle" className={styles.arrowLabel}>
          继续
        </text>
      </svg>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: '#3b82f6' }}></div>
          <span>初始状态</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: '#64748b' }}></div>
          <span>游戏中</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: '#ef4444' }}></div>
          <span>破产（终止）</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: '#10b981' }}></div>
          <span>达标（终止）</span>
        </div>
      </div>
    </div>
  );
};

export default StateTransitionGraph;
