import { test, expect } from '@playwright/test';

test.describe('页面布局和样式测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('检查页面主要组件是否正确显示', async ({ page }) => {
    // 检查配置面板
    const configPanel = await page.locator('[class*="configPanel"]');
    await expect(configPanel).toBeVisible();
    
    // 检查控制面板
    const controlPanel = await page.locator('[class*="controlPanel"]');
    await expect(controlPanel).toBeVisible();
    
    // 检查数据导出面板
    const dataExportPanel = await page.locator('[class*="dataExportPanel"]');
    await expect(dataExportPanel).toBeVisible();
    
    // 检查可视化面板
    const visualizationPanel = await page.locator('[class*="visualizationPanel"]');
    await expect(visualizationPanel).toBeVisible();
  });

  test('检查组件间距和布局', async ({ page }) => {
    // 获取所有面板组件
    const panels = await page.locator('[class*="Panel"]').all();
    
    // 检查相邻面板之间的间距
    for (let i = 0; i < panels.length - 1; i++) {
      const panel1Box = await panels[i].boundingBox();
      const panel2Box = await panels[i + 1].boundingBox();
      
      // 确保面板之间有适当的间距（至少20px）
      expect(panel2Box.y - (panel1Box.y + panel1Box.height)).toBeGreaterThanOrEqual(20);
    }
  });

  test('检查响应式布局', async ({ page }) => {
    // 设置不同的视口大小并检查布局
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 812 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // 检查所有面板是否仍然可见
      const panels = await page.locator('[class*="Panel"]').all();
      for (const panel of panels) {
        await expect(panel).toBeVisible();
      }
      
      // 检查内容是否溢出
      const body = await page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  test('检查配色方案', async ({ page }) => {
    // 检查背景色是否为淡蓝色系
    const body = await page.locator('body');
    const bodyColor = await body.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    
    // 将 RGB 值转换为 HSL 以检查色调
    const rgb = bodyColor.match(/\d+/g).map(Number);
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max === min) {
      h = 0;
    } else if (max === r) {
      h = 60 * ((g - b) / (max - min));
    } else if (max === g) {
      h = 60 * (2 + (b - r) / (max - min));
    } else {
      h = 60 * (4 + (r - g) / (max - min));
    }
    
    if (h < 0) h += 360;
    
    // 检查色调是否在蓝色范围内（180-240度）
    expect(h).toBeGreaterThanOrEqual(180);
    expect(h).toBeLessThanOrEqual(240);
  });
});