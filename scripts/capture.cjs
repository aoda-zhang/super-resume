const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  
  // Click German template
  const allBtns = await page.locator('button').all();
  for (const btn of allBtns) {
    const text = await btn.textContent();
    if (text && (text.includes('德式') || text.includes('German'))) {
      await btn.click();
      await page.waitForTimeout(500);
      break;
    }
  }
  
  // Fill sample data
  for (const btn of await page.locator('button').all()) {
    const text = await btn.textContent();
    if (text && (text.includes('填充') || text.includes('Fill'))) {
      await btn.click();
      await page.waitForTimeout(800);
      break;
    }
  }
  
  await page.waitForTimeout(1500);
  
  // Screenshot just the resume preview
  const preview = page.locator('[data-resume-preview]');
  if (await preview.count() > 0) {
    await preview.screenshot({ path: '/tmp/resume_current.png' });
    console.log('Resume preview screenshot saved!');
  } else {
    console.log('Preview element not found, taking full screenshot');
    await page.screenshot({ path: '/tmp/resume_current.png' });
  }
  
  await browser.close();
})();
