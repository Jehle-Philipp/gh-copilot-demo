import { describe, expect, it } from 'vitest'
import type { Album } from '../types/album'
import {
  addAlbumToItems,
  getCartCount,
  getCartTotal,
  removeAlbumFromItems
} from './useCart'

const albumA: Album = {
  id: 1,
  title: 'Discovery',
  artist: 'Daft Punk',
  price: 10,
  image_url: 'https://example.com/a.jpg'
}

const albumB: Album = {
  id: 2,
  title: 'Random Access Memories',
  artist: 'Daft Punk',
  price: 15,
  image_url: 'https://example.com/b.jpg'
}

describe('useCart helpers', () => {
  it('adds an album and increments quantity for duplicate albums', () => {
    const withOne = addAlbumToItems([], albumA)
    const withTwo = addAlbumToItems(withOne, albumA)

    expect(withTwo).toHaveLength(1)
    expect(withTwo[0].quantity).toBe(2)
  })

  it('removes one quantity and deletes the item at zero', () => {
    const withOne = addAlbumToItems([], albumA)
    const withTwo = addAlbumToItems(withOne, albumA)

    const afterFirstRemove = removeAlbumFromItems(withTwo, albumA.id)
    expect(afterFirstRemove).toHaveLength(1)
    expect(afterFirstRemove[0].quantity).toBe(1)

    const afterSecondRemove = removeAlbumFromItems(afterFirstRemove, albumA.id)
    expect(afterSecondRemove).toHaveLength(0)
  })

  it('calculates cart count and total across multiple albums', () => {
    let items = addAlbumToItems([], albumA)
    items = addAlbumToItems(items, albumA)
    items = addAlbumToItems(items, albumB)

    expect(getCartCount(items)).toBe(3)
    expect(getCartTotal(items)).toBe(35)
  })
})
