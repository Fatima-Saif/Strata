const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const filePath = 'file:///' + path.resolve('crop-image.html').replace(/\\/g, '/');
    console.log('Opening HTML for cropping:', filePath);
    
    // Set viewport exactly to 1600x1000 (16:10 ratio)
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto(filePath, { waitUntil: 'networkidle' });
    
    console.log('Cropping and saving as JPG...');
    const element = page.locator('#cropper');
    await element.screenshot({ path: 'cropped-mockup-16x10.jpg', type: 'jpeg', quality: 100 });
    
    await browser.close();
    console.log('Cropped image saved successfully!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
