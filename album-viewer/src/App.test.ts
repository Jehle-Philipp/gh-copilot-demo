import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import App from './App.vue'
import type { Album } from './types/album'

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}))

const albums: Album[] = [
  {
    id: 1,
    title: 'Discovery',
    artist: 'Daft Punk',
    price: 12.99,
    image_url: 'https://example.com/discovery.jpg'
  }
]

const flushPromises = async (): Promise<void> => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('App cart management', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockResolvedValue({ data: albums })
  })

  it('add item increases cart count', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.get('[data-testid="add-to-cart-1"]').trigger('click')
    expect(wrapper.get('[data-testid="cart-count-badge"]').text()).toBe('1')
  })

  it('remove item decreases cart count', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.get('[data-testid="add-to-cart-1"]').trigger('click')
    await wrapper.get('[data-testid="cart-toggle"]').trigger('click')
    await wrapper.get('[data-testid="remove-cart-item-1"]').trigger('click')

    expect(wrapper.find('[data-testid="cart-count-badge"]').exists()).toBe(false)
  })

  it('cart detail toggles on icon click', async () => {
    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.find('[data-testid="cart-panel"]').exists()).toBe(false)
    await wrapper.get('[data-testid="cart-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="cart-panel"]').exists()).toBe(true)
    await wrapper.get('[data-testid="cart-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="cart-panel"]').exists()).toBe(false)
  })

  it('renders empty cart state', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.get('[data-testid="cart-toggle"]').trigger('click')
    expect(wrapper.get('[data-testid="empty-cart-message"]').text()).toContain('Your cart is empty')
  })
})
