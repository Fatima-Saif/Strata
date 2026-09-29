const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Construct the file URI for local HTML file
    const filePath = 'file:///' + path.resolve('mockup-realistic.html').replace(/\\/g, '/');
    console.log('Opening HTML file:', filePath);
    
    // Set a large viewport for a high-res image
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(filePath, { waitUntil: 'networkidle' });
    
    // Wait for the local images to load
    await page.waitForTimeout(2000);
    
    console.log('Taking high-quality JPG screenshot...');
    await page.screenshot({ path: 'final-mockup.jpg', type: 'jpeg', quality: 100 });
    
    await browser.close();
    console.log('Final mockup saved successfully as final-mockup.jpg');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
