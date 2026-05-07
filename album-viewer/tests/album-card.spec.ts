import { expect, test } from '@playwright/test'

const mockAlbums = [
  {
    id: 1,
    title: 'Discovery',
    artist: 'Daft Punk',
    price: 12.99,
    image_url: 'https://example.com/discovery.jpg'
  },
  {
    id: 2,
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    price: 15.99,
    image_url: 'https://example.com/ram.jpg'
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

test('renders album card with title, artist, and price', async ({ page }) => {
  const card = page.locator('.album-card').first()

  await expect(card.locator('.album-title')).toHaveText('Discovery')
  await expect(card.locator('.album-artist')).toHaveText('Daft Punk')
  await expect(card.locator('.price')).toHaveText('$12.99')
})

test('renders album image with correct alt text', async ({ page }) => {
  const img = page.locator('.album-card').first().locator('img')

  await expect(img).toHaveAttribute('alt', 'Discovery')
  await expect(img).toHaveAttribute('loading', 'lazy')
})

test('renders all album cards', async ({ page }) => {
  await expect(page.locator('.album-card')).toHaveCount(2)
})

test('renders Add to Cart button with correct aria-label', async ({ page }) => {
  const addToCartBtn = page.getByTestId('add-to-cart-1')

  await expect(addToCartBtn).toBeVisible()
  await expect(addToCartBtn).toHaveText('Add to Cart')
  await expect(addToCartBtn).toHaveAttribute('aria-label', 'Add Discovery to cart')
})

test('renders Preview button on each card', async ({ page }) => {
  const cards = page.locator('.album-card')

  for (const card of await cards.all()) {
    await expect(card.getByRole('button', { name: 'Preview' })).toBeVisible()
  }
})

test('clicking Add to Cart updates the cart badge', async ({ page }) => {
  await expect(page.getByTestId('cart-count-badge')).toHaveCount(0)

  await page.getByTestId('add-to-cart-1').click()

  await expect(page.getByTestId('cart-count-badge')).toBeVisible()
  await expect(page.getByTestId('cart-count-badge')).toHaveText('1')
})

test('clicking Add to Cart for the same album increments quantity', async ({ page }) => {
  await page.getByTestId('add-to-cart-1').click()
  await page.getByTestId('add-to-cart-1').click()

  await expect(page.getByTestId('cart-count-badge')).toHaveText('2')
})

test('adding multiple different albums increments cart count correctly', async ({ page }) => {
  await page.getByTestId('add-to-cart-1').click()
  await page.getByTestId('add-to-cart-2').click()

  await expect(page.getByTestId('cart-count-badge')).toHaveText('2')
})

test('added album appears in cart panel with correct details', async ({ page }) => {
  await page.getByTestId('add-to-cart-1').click()
  await page.getByTestId('cart-toggle').click()

  const cartPanel = page.getByTestId('cart-panel')
  await expect(cartPanel).toBeVisible()
  await expect(cartPanel.getByText('Discovery')).toBeVisible()
  await expect(cartPanel.getByText('Daft Punk')).toBeVisible()
  await expect(cartPanel.locator('.cart-item-price')).toContainText('$12.99')
})

test('play overlay button is present inside the card', async ({ page }) => {
  const playButton = page.locator('.album-card').first().locator('.play-button')

  await expect(playButton).toHaveCount(1)
  await expect(playButton).toContainText('▶')
})

test('falls back to placeholder image when album image fails to load', async ({ page }) => {
  const img = page.locator('.album-card').first().locator('img')

  // Trigger onerror by dispatching an error event on the image
  await img.evaluate((el: HTMLImageElement) => {
    el.dispatchEvent(new Event('error'))
  })

  await expect(img).toHaveAttribute('src', /placeholder\.com/)
})

test('each card displays correct price for its album', async ({ page }) => {
  const cards = page.locator('.album-card')
  const prices = ['$12.99', '$15.99']

  for (let i = 0; i < prices.length; i++) {
    await expect(cards.nth(i).locator('.price')).toHaveText(prices[i])
  }
})
