const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Construct the file URI for local HTML file
    const filePath = 'file:///' + path.resolve('composite-mockup.html').replace(/\\/g, '/');
    console.log('Opening HTML file:', filePath);
    
    // Set viewport to match the container size in HTML for a perfectly framed shot
    await page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto(filePath, { waitUntil: 'networkidle' });
    
    // Wait for the background image and screenshots to fully load
    await page.waitForTimeout(3000);
    
    console.log('Taking high-quality JPG screenshot...');
    await page.screenshot({ path: 'final-composite-mockup.jpg', type: 'jpeg', quality: 100 });
    
    await browser.close();
    console.log('Final composite mockup saved successfully as final-composite-mockup.jpg');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
