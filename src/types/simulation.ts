export interface SimulationConfig {
  initialCapital: number;
  targetCapital: number | null;
  betSize: number;
  winProb: number;
  oddRatio: number;
  maxRounds: number;
  runs: number;
  strategy: 'fixed' | 'martingale' | 'proportional';
  proportion?: number;
  seed?: string;
}

export interface SingleRunResult {
  runId: number;
  finalCapital: number;
  bankrupt: boolean;
  reachedTarget: boolean;
  rounds: number;
  trace?: number[];
}

export interface BatchResult {
  totalRuns: number;
  bankruptCount: number;
  targetReachedCount: number;
  bankruptcyRate: number;
  targetReachedRate: number;
  averageRounds: number;
  roundsStdDev: number;
  averageFinalCapital: number;
  finalCapitalDistribution: number[];
  roundsDistribution: number[];
  results: SingleRunResult[];
}

export interface SimulationState {
  config: SimulationConfig;
  isRunning: boolean;
  currentRun: SingleRunResult | null;
  batchResult: BatchResult | null;
  progress: number;
  currentCapital: number;
  currentRound: number;
  isPaused: boolean;
  simulationSpeed: number;
}

export const defaultConfig: SimulationConfig = {
  initialCapital: 10,
  targetCapital: 20,
  betSize: 1,
  winProb: 0.5,
  oddRatio: 1,
  maxRounds: 10000,
  runs: 10000,
  strategy: 'fixed',
  proportion: 0.1,
  seed: undefined
};