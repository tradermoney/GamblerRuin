import React, { useState } from 'react';
import styles from './FormulaExplanation.module.css';

const FormulaExplanation: React.FC = () => {
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  const toggleExample = (id: string) => {
    setExpandedExample(expandedExample === id ? null : id);
  };

  return (
    <div className={styles.formulaContainer}>
      {/* 破产概率公式 */}
      <div className={styles.formulaSection}>
        <h4 className={styles.formulaTitle}>📉 破产概率 P(k)</h4>

        <div className={styles.explanation}>
          <h5>通俗理解：</h5>
          <p>
            破产概率就是<strong>从初始资金k开始，最终资金降到0的可能性</strong>。
            这个概率取决于三个关键因素：初始资金k、目标金额N、以及每次赌局的胜率p。
          </p>
        </div>

        <div className={styles.formulaBox}>
          <div className={styles.caseBox}>
            <h5>情况一：公平游戏 (p = 0.5)</h5>
            <div className={styles.formula}>
              <code>P(k) = 1 - k/N</code>
            </div>
            <p className={styles.formulaMeaning}>
              含义：在公平游戏中，破产概率等于 <strong>1 减去初始资金占目标金额的比例</strong>。
            </p>
          </div>

          <div className={styles.caseBox}>
            <h5>情况二：不公平游戏 (p ≠ 0.5)</h5>
            <div className={styles.formula}>
              <code>P(k) = [((1-p)/p)^N - ((1-p)/p)^k] / [((1-p)/p)^N - 1]</code>
            </div>
            <p className={styles.formulaMeaning}>
              含义：当胜率不是0.5时，破产概率会根据胜率偏离0.5的程度而变化。
              如果 p &lt; 0.5（对赌徒不利），破产概率会接近1。
            </p>
          </div>
        </div>

        <div className={styles.exampleBox}>
          <button
            className={styles.exampleToggle}
            onClick={() => toggleExample('bankruptcy')}
          >
            {expandedExample === 'bankruptcy' ? '▼' : '▶'} 具体示例
          </button>
          {expandedExample === 'bankruptcy' && (
            <div className={styles.exampleContent}>
              <h5>示例：初始资金10元，目标20元，胜率0.5</h5>
              <div className={styles.calculation}>
                <p><strong>计算过程：</strong></p>
                <p>P(10) = 1 - 10/20 = 1 - 0.5 = <strong>0.5</strong></p>
                <p><strong>结果解释：</strong>破产概率为50%，也就是说有一半的可能性会破产。</p>
              </div>
              <div className={styles.insight}>
                <p>💡 <strong>启示：</strong>即使在公平游戏中，从10元开始想赚到20元，也有50%的概率会破产！</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 期望赌局次数公式 */}
      <div className={styles.formulaSection}>
        <h4 className={styles.formulaTitle}>⏱️ 期望赌局次数 E(k)</h4>

        <div className={styles.explanation}>
          <h5>通俗理解：</h5>
          <p>
            期望赌局次数就是<strong>从初始资金k开始，到游戏结束（破产或达标）平均需要玩多少轮</strong>。
            这个数字告诉我们游戏大概会持续多久。
          </p>
        </div>

        <div className={styles.formulaBox}>
          <div className={styles.caseBox}>
            <h5>情况一：公平游戏 (p = 0.5)</h5>
            <div className={styles.formula}>
              <code>E(k) = k(N - k)</code>
            </div>
            <p className={styles.formulaMeaning}>
              含义：期望轮数等于 <strong>初始资金 × (目标金额 - 初始资金)</strong>。
              当初始资金正好是目标的一半时，期望轮数最大。
            </p>
          </div>

          <div className={styles.caseBox}>
            <h5>情况二：不公平游戏 (p ≠ 0.5)</h5>
            <div className={styles.formula}>
              <code>E(k) = [k - N × P(k)] / (2p - 1)</code>
            </div>
            <p className={styles.formulaMeaning}>
              含义：在不公平游戏中，期望轮数会受到胜率的影响。
              如果对赌徒不利，游戏会更快结束（因为会更快破产）。
            </p>
          </div>
        </div>

        <div className={styles.exampleBox}>
          <button
            className={styles.exampleToggle}
            onClick={() => toggleExample('duration')}
          >
            {expandedExample === 'duration' ? '▼' : '▶'} 具体示例
          </button>
          {expandedExample === 'duration' && (
            <div className={styles.exampleContent}>
              <h5>示例：初始资金10元，目标20元，胜率0.5</h5>
              <div className={styles.calculation}>
                <p><strong>计算过程：</strong></p>
                <p>E(10) = 10 × (20 - 10) = 10 × 10 = <strong>100轮</strong></p>
                <p><strong>结果解释：</strong>平均需要玩100轮才会结束游戏（破产或达标）。</p>
              </div>
              <div className={styles.insight}>
                <p>💡 <strong>启示：</strong>即使每轮只赌1元，从10元到20元或破产，平均也要100轮！游戏可能比想象的更持久。</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 关键参数说明 */}
      <div className={styles.parameterGuide}>
        <h5>📖 参数说明</h5>
        <div className={styles.parameterList}>
          <div className={styles.parameterItem}>
            <span className={styles.paramSymbol}>k</span>
            <span className={styles.paramDesc}>初始资金（赌徒开始时拥有的钱）</span>
          </div>
          <div className={styles.parameterItem}>
            <span className={styles.paramSymbol}>N</span>
            <span className={styles.paramDesc}>目标金额（赌徒希望达到的钱数）</span>
          </div>
          <div className={styles.parameterItem}>
            <span className={styles.paramSymbol}>p</span>
            <span className={styles.paramDesc}>胜率（每次赌局获胜的概率，0到1之间）</span>
          </div>
          <div className={styles.parameterItem}>
            <span className={styles.paramSymbol}>P(k)</span>
            <span className={styles.paramDesc}>破产概率（从资金k开始最终破产的可能性）</span>
          </div>
          <div className={styles.parameterItem}>
            <span className={styles.paramSymbol}>E(k)</span>
            <span className={styles.paramDesc}>期望轮数（从资金k开始平均需要多少轮结束）</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaExplanation;
