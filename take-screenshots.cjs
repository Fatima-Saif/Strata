const { chromium } = require('@playwright/test');
(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('Navigating to login...');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Wait for the dashboard charts and data to render
    await page.waitForTimeout(3000); 

    console.log('Taking desktop screenshot...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: 'screenshot-desktop.png' });
    
    console.log('Taking tablet screenshot...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'screenshot-tablet.png' });
    
    console.log('Taking mobile screenshot...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({ path: 'screenshot-mobile.png' });
    
    await browser.close();
    console.log('Screenshots saved successfully.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
