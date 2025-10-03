import { defaultConfig } from '../types/simulation';
import type { SimulationState, SimulationConfig, BatchResult } from '../types/simulation';
import { GamblerRuinSimulator } from '../utils/simulator';
import { create } from 'zustand';
import { indexedDBManager } from '../utils/indexedDB';

interface SimulationStore extends SimulationState {
  setConfig: (config: Partial<SimulationConfig>) => void;
  startSingleSimulation: () => Promise<void>;
  startBatchSimulation: () => Promise<void>;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  resetSimulation: () => void;
  saveConfig: () => Promise<void>;
  restoreConfig: () => Promise<void>;
  isConfigLoaded: boolean;
}

const useSimulationStore = create<SimulationStore>((set, get) => ({
  config: defaultConfig,
  isRunning: false,
  currentRun: null,
  batchResult: null,
  progress: 0,
  currentCapital: defaultConfig.initialCapital,
  currentRound: 0,
  isPaused: false,
  simulationSpeed: 1,
  isConfigLoaded: false,

  setConfig: (config) => {
    set((state) => ({
      config: { ...state.config, ...config }
    }));
    // 自动保存配置
    get().saveConfig();
  },

  startSingleSimulation: async () => {
    const { config, simulationSpeed } = get();
    set({ isRunning: true, isPaused: false, progress: 0, currentRound: 0 });

    const simulator = new GamblerRuinSimulator(config.seed);
    const result = simulator.singleSimulation(config);
    
    // 模拟实时播放效果
    if (result.trace) {
      for (let i = 0; i < result.trace.length; i++) {
        if (get().isPaused) {
          await waitForResume(get);
        }
        
        if (!get().isRunning) break;
        
        set({
          currentCapital: result.trace[i],
          currentRound: i,
          progress: (i / result.trace.length) * 100
        });
        
        await sleep(100 / simulationSpeed);
      }
    }

    set({
      currentRun: result,
      isRunning: false,
      progress: 100
    });
  },

  startBatchSimulation: async () => {
    const { config } = get();
    console.log('Starting batch simulation with config:', config);
    set({ isRunning: true, isPaused: false, progress: 0 });

    try {
      const simulator = new GamblerRuinSimulator(config.seed);
      console.log('Created simulator with seed:', config.seed);
      
      const result = await new Promise<BatchResult>((resolve) => {
        const batchResult = simulator.batchSimulation(config, (progress) => {
          console.log('Progress callback called:', progress);
          set({ progress: progress * 100 });
        });
        resolve(batchResult);
      });
      
      console.log('Batch simulation completed!');
      console.log('Batch simulation result:', result);
      console.log('Result type:', typeof result);
      console.log('Result keys:', result ? Object.keys(result) : 'null');

      set({
        batchResult: result,
        isRunning: false,
        progress: 100
      });
      
      console.log('Store state after setting batchResult:', get().batchResult);
    } catch (error) {
      console.error('Batch simulation error:', error);
      set({
        isRunning: false,
        progress: 0
      });
    }
  },

  pauseSimulation: () => {
    set({ isPaused: true });
  },

  resumeSimulation: () => {
    set({ isPaused: false });
  },

  stopSimulation: () => {
    set({ 
      isRunning: false, 
      isPaused: false,
      progress: 0,
      currentCapital: get().config.initialCapital,
      currentRound: 0
    });
  },

  setSimulationSpeed: (speed) => {
    set({ simulationSpeed: speed });
    // 自动保存速度设置
    get().saveConfig();
  },

  resetSimulation: () => {
    const { config } = get();
    set({
      isRunning: false,
      currentRun: null,
      batchResult: null,
      progress: 0,
      currentCapital: config.initialCapital,
      currentRound: 0,
      isPaused: false
    });
  },

  saveConfig: async () => {
    try {
      const { config, simulationSpeed } = get();
      await indexedDBManager.saveSimulationConfig(config, simulationSpeed);
      console.log('配置已保存到 IndexedDB');
    } catch (error) {
      console.error('保存配置失败:', error);
    }
  },

  restoreConfig: async () => {
    try {
      const savedData = await indexedDBManager.getSimulationConfig();
      if (savedData) {
        set({
          config: savedData.config,
          simulationSpeed: savedData.simulationSpeed,
          isConfigLoaded: true
        });
        console.log('配置已从 IndexedDB 恢复');
      }
    } catch (error) {
      console.error('恢复配置失败:', error);
    }
    set({ isConfigLoaded: true });
  }
}));

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForResume(get: () => SimulationStore): Promise<void> {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      if (!get().isPaused || !get().isRunning) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 50);
  });
}

export default useSimulationStore;