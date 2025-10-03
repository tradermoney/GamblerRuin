import React from 'react';
import './Introduction.css';

const Introduction: React.FC = () => {
  return (
    <div className="introduction-page">
      <div className="introduction-container">
        {/* 标题部分 */}
        <header className="introduction-header">
          <h1 className="introduction-title">赌徒破产问题</h1>
          <p className="introduction-subtitle">
            一个经典的概率论问题
          </p>
        </header>

        {/* 内容部分 */}
        <div className="introduction-content">
          {/* 问题定义 */}
          <section className="content-section">
            <h2 className="section-title">什么是赌徒破产问题？</h2>
            <div className="section-body">
              <p>
                赌徒破产问题（Gambler's Ruin Problem）是概率论中的一个经典问题。
                它描述了一个赌徒参与一系列赌局，每次赌局要么赢钱要么输钱，
                直到赌徒的资金耗尽（破产）或达到目标金额为止的过程。
              </p>
              <p>
                这个问题最早由法国数学家布莱士·帕斯卡和皮埃尔·德·费马在17世纪提出，
                是随机游走理论的重要应用之一。
              </p>
            </div>
          </section>

          {/* 问题设定 */}
          <section className="content-section">
            <h2 className="section-title">问题设定</h2>
            <div className="section-body">
              <p>假设一个赌徒参与如下赌局：</p>
              <ul className="definition-list">
                <li>
                  <strong>初始资金：</strong>赌徒开始时有一定数额的资金（例如50元）
                </li>
                <li>
                  <strong>胜率：</strong>每次赌局赌徒有 p 的概率赢，(1-p) 的概率输
                </li>
                <li>
                  <strong>赌注：</strong>每次赌局赌徒下注固定金额（例如1元）
                </li>
                <li>
                  <strong>目标金额：</strong>赌徒设定一个目标金额（例如100元）
                </li>
                <li>
                  <strong>破产：</strong>当赌徒的资金降到0时，游戏结束
                </li>
                <li>
                  <strong>获胜：</strong>当赌徒的资金达到目标金额时，游戏结束
                </li>
              </ul>
            </div>
          </section>

          {/* 关键问题 */}
          <section className="content-section">
            <h2 className="section-title">我们关心什么？</h2>
            <div className="section-body">
              <p>对于这个问题，我们主要关心以下几个方面：</p>
              <div className="questions-grid">
                <div className="question-card">
                  <div className="question-icon">📊</div>
                  <h3>破产概率</h3>
                  <p>赌徒最终破产的概率是多少？</p>
                </div>
                <div className="question-card">
                  <div className="question-icon">🎯</div>
                  <h3>达到目标概率</h3>
                  <p>赌徒达到目标金额的概率是多少？</p>
                </div>
                <div className="question-card">
                  <div className="question-icon">⏱️</div>
                  <h3>游戏时长</h3>
                  <p>平均需要多少次赌局才会结束？</p>
                </div>
                <div className="question-card">
                  <div className="question-icon">📈</div>
                  <h3>资金变化</h3>
                  <p>资金在游戏过程中如何变化？</p>
                </div>
              </div>
            </div>
          </section>

          {/* 数学公式 */}
          <section className="content-section">
            <h2 className="section-title">数学公式</h2>
            <div className="section-body">
              <p>设赌徒初始资金为 k，目标金额为 N，每次赌局获胜概率为 p，则：</p>

              <div className="formula-box">
                <h4>破产概率 P(k)</h4>
                <div className="formula">
                  <p><strong>当 p = 0.5 时：</strong></p>
                  <code>P(k) = 1 - k/N</code>
                </div>
                <div className="formula">
                  <p><strong>当 p ≠ 0.5 时：</strong></p>
                  <code>P(k) = [((1-p)/p)^N - ((1-p)/p)^k] / [((1-p)/p)^N - 1]</code>
                </div>
              </div>

              <div className="formula-box">
                <h4>期望赌局次数 E(k)</h4>
                <div className="formula">
                  <p><strong>当 p = 0.5 时：</strong></p>
                  <code>E(k) = k(N - k)</code>
                </div>
                <div className="formula">
                  <p><strong>当 p ≠ 0.5 时：</strong></p>
                  <code>E(k) = [k - N × P(k)] / (2p - 1)</code>
                </div>
              </div>
            </div>
          </section>

          {/* 关键洞察 */}
          <section className="content-section">
            <h2 className="section-title">关键洞察</h2>
            <div className="section-body">
              <div className="insights-list">
                <div className="insight-item">
                  <div className="insight-number">1</div>
                  <div className="insight-content">
                    <h4>公平游戏的陷阱</h4>
                    <p>
                      即使在公平游戏中（p = 0.5），只要赌徒继续参与，
                      最终破产的概率也会随着时间推移而增加。
                      这就是"久赌必输"的数学原理。
                    </p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-number">2</div>
                  <div className="insight-content">
                    <h4>不公平游戏更危险</h4>
                    <p>
                      如果游戏对赌徒不利（p &lt; 0.5），破产几乎是必然的。
                      即使只有微小的劣势，长期来看也会导致破产。
                    </p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-number">3</div>
                  <div className="insight-content">
                    <h4>资金管理的重要性</h4>
                    <p>
                      初始资金越多，破产的概率越低。
                      这说明了风险管理和资金管理在投资中的重要性。
                    </p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-number">4</div>
                  <div className="insight-content">
                    <h4>现实应用</h4>
                    <p>
                      这个问题不仅适用于赌博，还可以应用于股票交易、
                      保险精算、生物学中的物种灭绝等多个领域。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 行动召唤 */}
          <section className="content-section cta-section">
            <div className="cta-box">
              <h3>开始探索</h3>
              <p>
                通过我们的交互式模拟器，您可以直观地观察赌徒破产问题的过程，
                调整各种参数，进行大量模拟，并分析统计结果。
              </p>
              <a href="#/simulator" className="cta-button">
                进入模拟器
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
