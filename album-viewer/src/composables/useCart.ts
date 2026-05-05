import { computed, ref } from 'vue'
import type { Album } from '../types/album'
import type { CartItem } from '../types/cart'

export const addAlbumToItems = (items: CartItem[], album: Album): CartItem[] => {
  const existingItem = items.find((item) => item.album.id === album.id)

  if (!existingItem) {
    return [...items, { album, quantity: 1 }]
  }

  return items.map((item) =>
    item.album.id === album.id
      ? { ...item, quantity: item.quantity + 1 }
      : item
  )
}

export const removeAlbumFromItems = (items: CartItem[], albumId: number): CartItem[] => {
  return items
    .map((item) =>
      item.album.id === albumId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0)
}

export const getCartCount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export const getCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.album.price * item.quantity, 0)
}

export const useCart = () => {
  const items = ref<CartItem[]>([])

  const cartCount = computed(() => getCartCount(items.value))
  const cartTotal = computed(() => getCartTotal(items.value))

  const addToCart = (album: Album): void => {
    items.value = addAlbumToItems(items.value, album)
  }

  const removeFromCart = (albumId: number): void => {
    items.value = removeAlbumFromItems(items.value, albumId)
  }

  return {
    items,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart
  }
}
