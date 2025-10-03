/**
 * 边界值和异常情况测试
 * 
 * 测试范围：
 * - 输入极小值（如初始资金为1）
 * - 输入极大值（如最大轮数为999999）
 * - 输入无效值（如负数、非数字）
 * - 胜率边界值测试（0, 1）
 * - 目标资金小于初始资金的情况
 * - 下注金额大于初始资金的情况
 * - 空字符串和特殊字符输入
 */

import { test, expect } from '@playwright/test';

test.describe('边界值和异常情况测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('测试初始资金为极小值(1)', async ({ page }) => {
    // 设置初始资金为1
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('1');
    
    // 设置目标资金
    const targetCapitalInput = page.locator('input[type="number"]').nth(1);
    await targetCapitalInput.clear();
    await targetCapitalInput.fill('10');
    
    // 设置单轮赌注为1
    const betSizeInput = page.locator('input[type="number"]').nth(2);
    await betSizeInput.clear();
    await betSizeInput.fill('1');
    
    // 等待一下确保值已更新
    await page.waitForTimeout(500);
    
    // 检查是否没有错误提示
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    
    if (errorCount > 0) {
      console.log('发现错误提示，测试失败');
      const firstError = await errorMessages.first().textContent();
      console.log('错误内容:', firstError);
    }
    
    // 开始模拟按钮应该可用
    const startButton = page.getByRole('button', { name: '开始模拟' });
    await expect(startButton).toBeEnabled();
  });

  test('测试最大轮数为极大值(999999)', async ({ page }) => {
    // 找到最大轮数输入框
    const maxRoundsInput = page.locator('input[type="number"]').nth(4);
    await maxRoundsInput.clear();
    await maxRoundsInput.fill('999999');
    
    await page.waitForTimeout(500);
    
    // 检查是否没有错误
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
    
    // 验证值已保存
    const value = await maxRoundsInput.inputValue();
    expect(value).toBe('999999');
  });

  test('测试超大轮数(超过1000万)', async ({ page }) => {
    // 设置超过限制的值
    const maxRoundsInput = page.locator('input[type="number"]').nth(4);
    await maxRoundsInput.clear();
    await maxRoundsInput.fill('20000000');
    
    await page.waitForTimeout(500);
    
    // 应该显示错误提示
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
    
    // 开始按钮应该被禁用
    const startButton = page.getByRole('button', { name: '开始模拟' });
    await expect(startButton).toBeDisabled();
  });

  test('测试负数输入', async ({ page }) => {
    // 尝试输入负数初始资金
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('-100');
    
    await page.waitForTimeout(500);
    
    // 应该有错误提示
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
    
    // 检查验证摘要
    const validationSummary = page.locator('.validationSummary');
    await expect(validationSummary).toBeVisible();
  });

  test('测试胜率边界值 - 0', async ({ page }) => {
    const winProbInput = page.locator('input[type="number"]').nth(3);
    await winProbInput.clear();
    await winProbInput.fill('0');
    
    await page.waitForTimeout(500);
    
    // 胜率为0应该是合法的
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
    
    const value = await winProbInput.inputValue();
    expect(value).toBe('0');
  });

  test('测试胜率边界值 - 1', async ({ page }) => {
    const winProbInput = page.locator('input[type="number"]').nth(3);
    await winProbInput.clear();
    await winProbInput.fill('1');
    
    await page.waitForTimeout(500);
    
    // 胜率为1应该是合法的
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  });

  test('测试胜率超出范围 - 大于1', async ({ page }) => {
    const winProbInput = page.locator('input[type="number"]').nth(3);
    await winProbInput.clear();
    await winProbInput.fill('1.5');
    
    await page.waitForTimeout(500);
    
    // 应该有错误提示
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('测试胜率为负数', async ({ page }) => {
    const winProbInput = page.locator('input[type="number"]').nth(3);
    await winProbInput.clear();
    await winProbInput.fill('-0.5');
    
    await page.waitForTimeout(500);
    
    // 应该有错误提示
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('测试目标资金小于初始资金', async ({ page }) => {
    // 设置初始资金为100
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('100');
    
    // 设置目标资金为50（小于初始资金）
    const targetCapitalInput = page.locator('input[type="number"]').nth(1);
    await targetCapitalInput.clear();
    await targetCapitalInput.fill('50');
    
    await page.waitForTimeout(500);
    
    // 应该显示错误
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
    
    // 验证错误消息内容
    const validationSummary = page.locator('.validationSummary');
    await expect(validationSummary).toBeVisible();
    
    const errorText = await validationSummary.textContent();
    expect(errorText).toContain('目标资金必须大于初始资金');
  });

  test('测试单轮赌注大于初始资金', async ({ page }) => {
    // 设置初始资金为10
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('10');
    
    // 设置单轮赌注为100（大于初始资金）
    const betSizeInput = page.locator('input[type="number"]').nth(2);
    await betSizeInput.clear();
    await betSizeInput.fill('100');
    
    await page.waitForTimeout(500);
    
    // 应该显示错误
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
    
    // 验证错误消息
    const validationSummary = page.locator('.validationSummary');
    await expect(validationSummary).toBeVisible();
    
    const errorText = await validationSummary.textContent();
    expect(errorText).toContain('单轮赌注不能大于初始资金');
  });

  test('测试空字符串输入', async ({ page }) => {
    // 清空初始资金
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    
    await page.waitForTimeout(500);
    
    // 应该显示错误或使用默认值
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    
    // 空值应该被处理为默认值或显示错误
    if (errorCount > 0) {
      console.log('空值被视为错误（正确行为）');
    } else {
      // 检查是否使用了默认值
      const value = await initialCapitalInput.inputValue();
      console.log('使用默认值:', value);
      expect(value).toBeTruthy();
    }
  });

  test('测试非数字输入', async ({ page }) => {
    // 尝试输入文本（HTML5 number input通常会阻止）
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    
    // 尝试输入字母
    await initialCapitalInput.type('abc');
    await page.waitForTimeout(500);
    
    // 检查输入值
    const value = await initialCapitalInput.inputValue();
    console.log('非数字输入后的值:', value);
    
    // HTML5 number input通常会拒绝非数字输入
    expect(value).not.toBe('abc');
  });

  test('测试批量模拟次数超限', async ({ page }) => {
    // 找到批量模拟次数输入框
    const runsInput = page.locator('input[type="number"]').last();
    await runsInput.clear();
    await runsInput.fill('2000000'); // 超过100万限制
    
    await page.waitForTimeout(500);
    
    // 应该显示错误
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
    
    // 验证错误消息
    const validationSummary = page.locator('.validationSummary');
    await expect(validationSummary).toBeVisible();
  });

  test('测试比例策略的投注比例边界', async ({ page }) => {
    // 选择比例策略
    const strategySelect = page.locator('select');
    await strategySelect.selectOption('proportional');
    
    await page.waitForTimeout(500);
    
    // 应该出现投注比例输入框
    const proportionInput = page.getByLabel(/投注比例/i);
    await expect(proportionInput).toBeVisible();
    
    // 测试超出范围的值
    await proportionInput.clear();
    await proportionInput.fill('1.5');
    
    await page.waitForTimeout(500);
    
    // 应该有错误
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('测试比例策略的投注比例为0', async ({ page }) => {
    // 选择比例策略
    const strategySelect = page.locator('select');
    await strategySelect.selectOption('proportional');
    
    await page.waitForTimeout(500);
    
    // 设置比例为0
    const proportionInput = page.getByLabel(/投注比例/i);
    await proportionInput.clear();
    await proportionInput.fill('0');
    
    await page.waitForTimeout(500);
    
    // 应该有错误（比例必须大于0）
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('测试所有字段同时有错误', async ({ page }) => {
    // 制造多个错误
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('-10');
    
    const targetCapitalInput = page.locator('input[type="number"]').nth(1);
    await targetCapitalInput.clear();
    await targetCapitalInput.fill('5');
    
    const betSizeInput = page.locator('input[type="number"]').nth(2);
    await betSizeInput.clear();
    await betSizeInput.fill('1000');
    
    const winProbInput = page.locator('input[type="number"]').nth(3);
    await winProbInput.clear();
    await winProbInput.fill('2');
    
    await page.waitForTimeout(500);
    
    // 应该有多个错误
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(2);
    
    // 验证摘要应该可见
    const validationSummary = page.locator('.validationSummary');
    await expect(validationSummary).toBeVisible();
    
    // 开始按钮应该被禁用
    const startButton = page.getByRole('button', { name: '开始模拟' });
    await expect(startButton).toBeDisabled();
    
    const batchButton = page.getByRole('button', { name: '批量模拟' });
    await expect(batchButton).toBeDisabled();
  });

  test('测试修复错误后按钮恢复可用', async ({ page }) => {
    // 先制造错误
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('-10');
    
    await page.waitForTimeout(500);
    
    // 按钮应该被禁用
    let startButton = page.getByRole('button', { name: '开始模拟' });
    await expect(startButton).toBeDisabled();
    
    // 修复错误
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('10');
    
    await page.waitForTimeout(500);
    
    // 按钮应该恢复可用
    startButton = page.getByRole('button', { name: '开始模拟' });
    await expect(startButton).toBeEnabled();
    
    // 错误提示应该消失
    const validationSummary = page.locator('.validationSummary');
    await expect(validationSummary).not.toBeVisible();
  });

  test('测试极端组合：最小资金+最大轮数', async ({ page }) => {
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('1');
    
    const maxRoundsInput = page.locator('input[type="number"]').nth(4);
    await maxRoundsInput.clear();
    await maxRoundsInput.fill('9999999');
    
    await page.waitForTimeout(500);
    
    // 应该没有错误（虽然组合极端，但都在合法范围内）
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
    
    const startButton = page.getByRole('button', { name: '开始模拟' });
    await expect(startButton).toBeEnabled();
  });

  test('测试科学计数法输入', async ({ page }) => {
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('1e5'); // 100000
    
    await page.waitForTimeout(500);
    
    // 应该被正确解析
    const value = await initialCapitalInput.inputValue();
    console.log('科学计数法解析结果:', value);
    
    // 检查是否有错误
    const errorMessages = page.locator('.errorMessage');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  });

  test('测试小数点输入整数字段', async ({ page }) => {
    const initialCapitalInput = page.locator('input[type="number"]').first();
    await initialCapitalInput.clear();
    await initialCapitalInput.fill('10.5');
    
    await page.waitForTimeout(500);
    
    // 应该被处理（可能取整或保持）
    const value = await initialCapitalInput.inputValue();
    console.log('小数输入整数字段结果:', value);
    
    // 验证最终值
    expect(value).toBeTruthy();
  });
});

