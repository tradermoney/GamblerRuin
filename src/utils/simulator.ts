import seedrandom from 'seedrandom';
import type { SimulationConfig, SingleRunResult, BatchResult } from '../types/simulation';

export class GamblerRuinSimulator {
  private rng: seedrandom.PRNG;

  constructor(seed?: string) {
    this.rng = seedrandom(seed || Math.random().toString());
  }

  private getRandom(): number {
    return this.rng();
  }

  private determineBet(capital: number, config: SimulationConfig): number {
    const { strategy, betSize, proportion } = config;
    
    switch (strategy) {
      case 'fixed': {
        return Math.min(betSize, capital);
      }
      case 'martingale': {
        return Math.min(betSize, capital);
      }
      case 'proportional': {
        const prop = proportion || 0.1;
        return Math.max(1, Math.floor(capital * prop));
      }
      default: {
        return Math.min(betSize, capital);
      }
    }
  }

  singleSimulation(config: SimulationConfig, runId: number = 0): SingleRunResult {
    let capital = config.initialCapital;
    let rounds = 0;
    const trace: number[] = [capital];
    let currentBet = config.betSize;

    while (capital > 0 && 
           (config.targetCapital === null || capital < config.targetCapital) && 
           rounds < config.maxRounds) {
      
      currentBet = this.determineBet(capital, config);
      
      if (this.getRandom() < config.winProb) {
        capital += currentBet * config.oddRatio;
      } else {
        capital -= currentBet;
        
        if (config.strategy === 'martingale' && capital >= currentBet * 2) {
          currentBet = Math.min(currentBet * 2, capital);
        }
      }
      
      rounds++;
      trace.push(capital);
    }

    return {
      runId,
      finalCapital: capital,
      bankrupt: capital <= 0,
      reachedTarget: config.targetCapital !== null && capital >= config.targetCapital,
      rounds,
      trace
    };
  }

  batchSimulation(
    config: SimulationConfig, 
    onProgress?: (progress: number) => void
  ): BatchResult {
    console.log('Batch simulation started with config:', config);
    const results: SingleRunResult[] = [];
    const finalCapitals: number[] = [];
    const roundsList: number[] = [];
    
    let bankruptCount = 0;
    let targetReachedCount = 0;
    let totalRounds = 0;

    const batchSize = 100;
    const totalRuns = config.runs;
    
    console.log('Total runs to process:', totalRuns);
    
    for (let i = 0; i < totalRuns; i++) {
      const result = this.singleSimulation(config, i);
      results.push(result);
      
      if (result.bankrupt) {
        bankruptCount++;
      }
      
      if (result.reachedTarget) {
        targetReachedCount++;
      }
      
      finalCapitals.push(result.finalCapital);
      roundsList.push(result.rounds);
      totalRounds += result.rounds;
      
      if ((i + 1) % batchSize === 0 && onProgress) {
        console.log('Calling progress callback:', (i + 1) / totalRuns);
        onProgress((i + 1) / totalRuns);
      }
    }
    
    console.log('Batch simulation completed, total results:', results.length);

    const bankruptcyRate = bankruptCount / totalRuns;
    const targetReachedRate = targetReachedCount / totalRuns;
    const averageRounds = totalRounds / totalRuns;
    
    const roundsVariance = roundsList.reduce((sum, rounds) => 
      sum + Math.pow(rounds - averageRounds, 2), 0) / totalRuns;
    const roundsStdDev = Math.sqrt(roundsVariance);
    
    const averageFinalCapital = finalCapitals.reduce((sum, cap) => sum + cap, 0) / totalRuns;

    return {
      totalRuns,
      bankruptCount,
      targetReachedCount,
      bankruptcyRate,
      targetReachedRate,
      averageRounds,
      roundsStdDev,
      averageFinalCapital,
      finalCapitalDistribution: this.createDistribution(finalCapitals, 20),
      roundsDistribution: this.createDistribution(roundsList, 20),
      results
    };
  }

  private createDistribution(values: number[], bins: number): number[] {
    if (values.length === 0) return new Array(bins).fill(0);
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    if (range === 0) {
      const distribution = new Array(bins).fill(0);
      distribution[0] = values.length;
      return distribution;
    }
    
    const distribution = new Array(bins).fill(0);
    const binWidth = range / bins;
    
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      distribution[binIndex]++;
    });
    
    return distribution;
  }
}