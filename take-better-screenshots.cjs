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
    
    console.log('Waiting for login to complete...');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    console.log('Navigating to Templates page (looks much better!)...');
    await page.goto('http://localhost:3000/templates');
    await page.waitForTimeout(3000); // Wait for cards to load and animate
    
    console.log('Taking Desktop screenshot...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: 'screenshot-desktop-templates.png' });
    
    console.log('Taking Mobile screenshot...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({ path: 'screenshot-mobile-templates.png' });

    await browser.close();
    console.log('New screenshots saved successfully!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
