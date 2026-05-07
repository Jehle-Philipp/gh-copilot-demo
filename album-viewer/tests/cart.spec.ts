import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const mockAlbums = [
  {
    id: 1,
    title: 'Discovery',
    artist: 'Daft Punk',
    price: 12.99,
    image_url: 'https://example.com/discovery.jpg'
  }
]

test.beforeEach(async ({ page }) => {
  await page.route('**/albums', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAlbums)
    })
  })

  await page.goto('/')
})

const screenshotDir = path.resolve(__dirname, 'screenshots')
fs.mkdirSync(screenshotDir, { recursive: true })

test('adds and removes an item from cart', async ({ page }) => {
  await page.getByTestId('add-to-cart-1').click()
  await expect(page.getByTestId('cart-count-badge')).toHaveText('1')
  await page.screenshot({ path: path.join(screenshotDir, 'cart-badge.png'), fullPage: true })

  await page.getByTestId('cart-toggle').click()
  await expect(page.getByTestId('cart-panel')).toBeVisible()
  await expect(page.getByTestId('cart-panel').getByText('Discovery')).toBeVisible()
  await page.screenshot({ path: path.join(screenshotDir, 'cart-panel.png'), fullPage: true })

  await page.getByTestId('remove-cart-item-1').click()
  await expect(page.getByTestId('empty-cart-message')).toBeVisible()
  await expect(page.getByTestId('cart-count-badge')).toHaveCount(0)
})

test('toggles cart details and closes with escape', async ({ page }) => {
  await page.getByTestId('cart-toggle').click()
  await expect(page.getByTestId('cart-panel')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('cart-panel')).toHaveCount(0)
})
