/**
 * IndexedDB 工具类
 * 用于持久化存储用户配置和状态数据
 */

export interface StoredData {
  id: string;
  data: unknown;
  timestamp: number;
  version: number;
}

export interface SimulationPersistenceData {
  config: Record<string, unknown>;
  simulationSpeed: number;
  lastUsed: number;
}

export interface VisualizationPersistenceData {
  chartTypes: string[];
  chartSettings: Record<string, string | number | boolean>;
  lastUsed: number;
}

export interface ExportPersistenceData {
  exportSettings: Record<string, string | number | boolean>;
  lastUsed: number;
}

class IndexedDBManager {
  private dbName = 'GamblerRuinDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('IndexedDB 初始化失败:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB 初始化成功');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建对象存储
        if (!db.objectStoreNames.contains('simulationConfig')) {
          const simulationStore = db.createObjectStore('simulationConfig', { keyPath: 'id' });
          simulationStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('visualizationSettings')) {
          const visualizationStore = db.createObjectStore('visualizationSettings', { keyPath: 'id' });
          visualizationStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('exportSettings')) {
          const exportStore = db.createObjectStore('exportSettings', { keyPath: 'id' });
          exportStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          const preferencesStore = db.createObjectStore('userPreferences', { keyPath: 'id' });
          preferencesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        console.log('IndexedDB 数据库结构创建完成');
      };
    });
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('数据库初始化失败');
    }
    return this.db;
  }

  /**
   * 保存数据到指定存储
   */
  async saveData(storeName: string, id: string, data: unknown): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const storedData: StoredData = {
        id,
        data,
        timestamp: Date.now(),
        version: this.version
      };

      const request = store.put(storedData);

      request.onsuccess = () => {
        console.log(`数据已保存到 ${storeName}:`, id);
        resolve();
      };

      request.onerror = () => {
        console.error(`保存数据到 ${storeName} 失败:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 从指定存储获取数据
   */
  async getData(storeName: string, id: string): Promise<unknown> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          console.log(`从 ${storeName} 获取数据:`, id);
          resolve(result.data);
        } else {
          console.log(`在 ${storeName} 中未找到数据:`, id);
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error(`从 ${storeName} 获取数据失败:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 删除指定存储中的数据
   */
  async deleteData(storeName: string, id: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`从 ${storeName} 删除数据:`, id);
        resolve();
      };

      request.onerror = () => {
        console.error(`从 ${storeName} 删除数据失败:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 获取存储中的所有数据
   */
  async getAllData(storeName: string): Promise<StoredData[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        console.log(`从 ${storeName} 获取所有数据:`, request.result.length, '条记录');
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`从 ${storeName} 获取所有数据失败:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 清空指定存储
   */
  async clearStore(storeName: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log(`清空存储 ${storeName} 成功`);
        resolve();
      };

      request.onerror = () => {
        console.error(`清空存储 ${storeName} 失败:`, request.error);
        reject(request.error);
      };
    });
  }

  // 专门的方法用于保存和获取各种配置

  /**
   * 保存模拟配置
   */
  async saveSimulationConfig(config: Record<string, unknown>, simulationSpeed: number): Promise<void> {
    const data: SimulationPersistenceData = {
      config,
      simulationSpeed,
      lastUsed: Date.now()
    };
    await this.saveData('simulationConfig', 'current', data);
  }

  /**
   * 获取模拟配置
   */
  async getSimulationConfig(): Promise<SimulationPersistenceData | null> {
    return await this.getData('simulationConfig', 'current');
  }

  /**
   * 保存可视化设置
   */
  async saveVisualizationSettings(chartTypes: string[], chartSettings: Record<string, string | number | boolean>): Promise<void> {
    const data: VisualizationPersistenceData = {
      chartTypes,
      chartSettings,
      lastUsed: Date.now()
    };
    await this.saveData('visualizationSettings', 'current', data);
  }

  /**
   * 获取可视化设置
   */
  async getVisualizationSettings(): Promise<VisualizationPersistenceData | null> {
    return await this.getData('visualizationSettings', 'current');
  }

  /**
   * 保存导出设置
   */
  async saveExportSettings(exportSettings: Record<string, string | number | boolean>): Promise<void> {
    const data: ExportPersistenceData = {
      exportSettings,
      lastUsed: Date.now()
    };
    await this.saveData('exportSettings', 'current', data);
  }

  /**
   * 获取导出设置
   */
  async getExportSettings(): Promise<ExportPersistenceData | null> {
    return await this.getData('exportSettings', 'current');
  }

  /**
   * 保存用户偏好设置
   */
  async saveUserPreferences(preferences: Record<string, unknown>): Promise<void> {
    const data = {
      preferences,
      lastUsed: Date.now()
    };
    await this.saveData('userPreferences', 'current', data);
  }

  /**
   * 获取用户偏好设置
   */
  async getUserPreferences(): Promise<unknown> {
    return await this.getData('userPreferences', 'current');
  }

  /**
   * 检查浏览器是否支持 IndexedDB
   */
  static isSupported(): boolean {
    return 'indexedDB' in window;
  }

  /**
   * 获取数据库使用情况
   */
  async getStorageInfo(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0
      };
    }
    return { used: 0, available: 0 };
  }
}

// 创建单例实例
export const indexedDBManager = new IndexedDBManager();

// 自动初始化
if (IndexedDBManager.isSupported()) {
  indexedDBManager.init().catch(console.error);
} else {
  console.warn('浏览器不支持 IndexedDB，数据持久化功能将不可用');
}

