/**
 * 持久化功能测试组件
 * 用于验证 IndexedDB 功能是否正常工作
 */

import React, { useState } from 'react';
import { indexedDBManager } from '../utils/indexedDB';
import useSimulationStore from '../store/simulationStore';
import styles from './PersistenceTest.module.css';

const PersistenceTest: React.FC = () => {
  const { config, simulationSpeed, saveConfig, restoreConfig } = useSimulationStore();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testIndexedDBConnection = async () => {
    setIsLoading(true);
    addTestResult('开始测试 IndexedDB 连接...');
    
    try {
      await indexedDBManager.init();
      addTestResult('✅ IndexedDB 初始化成功');
      
      // 测试保存数据
      const testData = {
        testValue: 'Hello IndexedDB',
        timestamp: Date.now()
      };
      
      await indexedDBManager.saveData('userPreferences', 'test', testData);
      addTestResult('✅ 数据保存成功');
      
      // 测试读取数据
      const retrievedData = await indexedDBManager.getData('userPreferences', 'test');
      if (retrievedData && (retrievedData as { testValue: string }).testValue === 'Hello IndexedDB') {
        addTestResult('✅ 数据读取成功');
      } else {
        addTestResult('❌ 数据读取失败');
      }
      
      // 测试删除数据
      await indexedDBManager.deleteData('userPreferences', 'test');
      addTestResult('✅ 数据删除成功');
      
      // 测试存储信息
      const storageInfo = await indexedDBManager.getStorageInfo();
      addTestResult(`📊 存储使用情况: ${(storageInfo.used / 1024).toFixed(2)} KB / ${(storageInfo.available / 1024 / 1024).toFixed(2)} MB`);
      
    } catch (error) {
      addTestResult(`❌ 测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConfigPersistence = async () => {
    setIsLoading(true);
    addTestResult('开始测试配置持久化...');
    
    try {
      // 保存当前配置
      await saveConfig();
      addTestResult('✅ 配置保存成功');
      
      // 修改配置
      const originalConfig = { ...config } as typeof config;
      useSimulationStore.setState({
        config: {
          ...config,
          initialCapital: 999,
          targetCapital: 1999
        }
      });
      addTestResult('✅ 配置已修改');
      
      // 恢复配置
      await restoreConfig();
      addTestResult('✅ 配置恢复成功');
      
      // 验证恢复结果
      const currentConfig = useSimulationStore.getState().config;
      if (currentConfig.initialCapital === originalConfig.initialCapital) {
        addTestResult('✅ 配置恢复验证成功');
      } else {
        addTestResult('❌ 配置恢复验证失败');
      }
      
    } catch (error) {
      addTestResult(`❌ 配置持久化测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const clearAllData = async () => {
    setIsLoading(true);
    addTestResult('开始清理所有数据...');
    
    try {
      await indexedDBManager.clearStore('simulationConfig');
      await indexedDBManager.clearStore('visualizationSettings');
      await indexedDBManager.clearStore('exportSettings');
      await indexedDBManager.clearStore('userPreferences');
      addTestResult('✅ 所有数据已清理');
    } catch (error) {
      addTestResult(`❌ 清理数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.testPanel}>
      <h2 className={styles.title}>持久化功能测试</h2>
      
      <div className={styles.buttonGroup}>
        <button
          onClick={testIndexedDBConnection}
          disabled={isLoading}
          className={styles.testButton}
        >
          {isLoading ? '测试中...' : '测试 IndexedDB'}
        </button>
        
        <button
          onClick={testConfigPersistence}
          disabled={isLoading}
          className={styles.testButton}
        >
          {isLoading ? '测试中...' : '测试配置持久化'}
        </button>
        
        <button
          onClick={clearTestResults}
          className={styles.clearButton}
        >
          清空测试结果
        </button>
        
        <button
          onClick={clearAllData}
          disabled={isLoading}
          className={styles.dangerButton}
        >
          {isLoading ? '清理中...' : '清理所有数据'}
        </button>
      </div>
      
      <div className={styles.resultsSection}>
        <h3 className={styles.resultsTitle}>测试结果</h3>
        <div className={styles.resultsList}>
          {testResults.length === 0 ? (
            <div className={styles.noResults}>暂无测试结果</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className={styles.resultItem}>
                {result}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>当前配置信息</h3>
        <div className={styles.configInfo}>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>初始资金:</span>
            <span className={styles.configValue}>{config.initialCapital}</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>目标资金:</span>
            <span className={styles.configValue}>{config.targetCapital}</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>投注大小:</span>
            <span className={styles.configValue}>{config.betSize}</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>模拟速度:</span>
            <span className={styles.configValue}>{simulationSpeed}x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersistenceTest;
