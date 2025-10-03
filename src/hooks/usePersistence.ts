/**
 * 数据持久化 Hook
 * 提供便捷的数据保存和恢复功能
 */

import { useEffect, useCallback, useState } from 'react';
import { indexedDBManager } from '../utils/indexedDB';

export interface UsePersistenceOptions {
  /** 存储键名 */
  key: string;
  /** 存储类型 */
  storeType: 'simulationConfig' | 'visualizationSettings' | 'exportSettings' | 'userPreferences';
  /** 是否自动保存 */
  autoSave?: boolean;
  /** 保存延迟（毫秒） */
  saveDelay?: number;
  /** 是否在组件挂载时自动恢复 */
  autoRestore?: boolean;
}

/**
 * 数据持久化 Hook
 */
export function usePersistence<T>(
  data: T,
  options: UsePersistenceOptions
) {
  const {
    key,
    storeType,
    autoSave = true,
    saveDelay = 1000,
    autoRestore = true
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  // 保存数据
  const saveData = useCallback(async (dataToSave: T) => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      await indexedDBManager.saveData(storeType, key, dataToSave);
      setLastSaved(Date.now());
      console.log(`数据已保存: ${key}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '保存失败';
      setError(errorMessage);
      console.error(`保存数据失败: ${key}`, err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [key, storeType]);

  // 恢复数据
  const restoreData = useCallback(async (): Promise<T | null> => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const savedData = await indexedDBManager.getData(storeType, key);
      if (savedData) {
        console.log(`数据已恢复: ${key}`);
        return savedData;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '恢复失败';
      setError(errorMessage);
      console.error(`恢复数据失败: ${key}`, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [key, storeType]);

  // 删除数据
  const deleteData = useCallback(async (): Promise<boolean> => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      await indexedDBManager.deleteData(storeType, key);
      setLastSaved(null);
      console.log(`数据已删除: ${key}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除失败';
      setError(errorMessage);
      console.error(`删除数据失败: ${key}`, err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [key, storeType]);

  // 自动保存
  useEffect(() => {
    if (!autoSave || !data) return;

    const timeoutId = setTimeout(() => {
      saveData(data);
    }, saveDelay);

    return () => clearTimeout(timeoutId);
  }, [data, autoSave, saveDelay, saveData]);

  // 自动恢复（仅在组件挂载时执行一次）
  useEffect(() => {
    if (autoRestore) {
      restoreData();
    }
  }, [autoRestore, restoreData]);

  return {
    saveData,
    restoreData,
    deleteData,
    isLoading,
    isSaving,
    error,
    lastSaved,
    clearError: () => setError(null)
  };
}

/**
 * 模拟配置持久化 Hook
 */
export function useSimulationPersistence(config: Record<string, unknown>, simulationSpeed: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveConfig = useCallback(async () => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      await indexedDBManager.saveSimulationConfig(config, simulationSpeed);
      console.log('模拟配置已保存');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '保存失败';
      setError(errorMessage);
      console.error('保存模拟配置失败', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [config, simulationSpeed]);

  const restoreConfig = useCallback(async () => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const savedData = await indexedDBManager.getSimulationConfig();
      if (savedData) {
        console.log('模拟配置已恢复');
        return savedData;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '恢复失败';
      setError(errorMessage);
      console.error('恢复模拟配置失败', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 自动保存配置
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveConfig();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [config, simulationSpeed, saveConfig]);

  return {
    saveConfig,
    restoreConfig,
    isLoading,
    isSaving,
    error,
    clearError: () => setError(null)
  };
}

/**
 * 可视化设置持久化 Hook
 */
export function useVisualizationPersistence(chartTypes: string[], chartSettings: Record<string, string | number | boolean>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSettings = useCallback(async () => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      await indexedDBManager.saveVisualizationSettings(chartTypes, chartSettings);
      console.log('可视化设置已保存');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '保存失败';
      setError(errorMessage);
      console.error('保存可视化设置失败', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [chartTypes, chartSettings]);

  const restoreSettings = useCallback(async () => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const savedData = await indexedDBManager.getVisualizationSettings();
      if (savedData) {
        console.log('可视化设置已恢复');
        return savedData;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '恢复失败';
      setError(errorMessage);
      console.error('恢复可视化设置失败', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 自动保存设置
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveSettings();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [chartTypes, chartSettings, saveSettings]);

  return {
    saveSettings,
    restoreSettings,
    isLoading,
    isSaving,
    error,
    clearError: () => setError(null)
  };
}

/**
 * 导出设置持久化 Hook
 */
export function useExportPersistence(exportSettings: Record<string, string | number | boolean>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSettings = useCallback(async () => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      await indexedDBManager.saveExportSettings(exportSettings);
      console.log('导出设置已保存');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '保存失败';
      setError(errorMessage);
      console.error('保存导出设置失败', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [exportSettings]);

  const restoreSettings = useCallback(async () => {
    if (!indexedDBManager) {
      setError('IndexedDB 不可用');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const savedData = await indexedDBManager.getExportSettings();
      if (savedData) {
        console.log('导出设置已恢复');
        return savedData;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '恢复失败';
      setError(errorMessage);
      console.error('恢复导出设置失败', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 自动保存设置
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveSettings();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [exportSettings, saveSettings]);

  return {
    saveSettings,
    restoreSettings,
    isLoading,
    isSaving,
    error,
    clearError: () => setError(null)
  };
}

