import { test, expect } from '@playwright/test';

test.describe('Core E2E Flows', () => {
  test('Login Flow', async ({ page }) => {
    await page.goto('/login');
    
    // Fill credentials
    await page.fill('input[type="email"]', 'admin@acme.inc');
    await page.fill('input[type="password"]', 'password123');
    
    // Click login
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    // Verify dashboard content loads
    await expect(page.locator('h1', { hasText: 'Dashboard' })).toBeVisible();
  });

  test('Navigate via Command Palette', async ({ page }) => {
    // Go directly to dashboard (assuming mock auth or we're logged in if state is shared, but Next.js mock might not enforce auth block on /dashboard)
    await page.goto('/dashboard');
    
    // Open command palette via shortcut
    await page.keyboard.press('Control+K');
    // For Mac it would be Meta+K, we can just click the search button
    // Or we trigger via the button to be safe across OS in headless
    await page.click('button[aria-label="Search"]');

    const searchInput = page.getByPlaceholder('Type a command or search...');
    await expect(searchInput).toBeVisible();
    
    // Type and navigate
    await searchInput.fill('Settings');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // Verify we arrived at settings
    await expect(page).toHaveURL(/\/settings/);
  });
  
  test('Invite Team Member', async ({ page }) => {
    await page.goto('/team');
    
    // Open invite dialog
    await page.click('button:has-text("Invite Members")');
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // Fill emails
    await page.fill('textarea[placeholder*="email@example.com"]', 'test@acme.inc');
    
    // Send
    await page.click('button:has-text("Send Invites")');
    
    // Verify toast or updated UI
    await expect(page.locator('text=Invitation sent')).toBeVisible();
  });
});
