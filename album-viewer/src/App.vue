<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div>
          <h1>🎵 Album Collection</h1>
          <p>Discover amazing music albums</p>
        </div>
        <button
          class="cart-button"
          type="button"
          @click="toggleCart"
          :aria-label="isCartOpen ? 'Close cart details' : `Open cart details (${cartCount} items)`"
          data-testid="cart-toggle"
        >
          🛒
          <span v-if="cartCount > 0" class="cart-badge" data-testid="cart-count-badge">{{ cartCount }}</span>
        </button>
      </div>
    </header>

    <aside v-if="isCartOpen" class="cart-panel" data-testid="cart-panel">
      <div class="cart-panel-header">
        <h2>Your Cart</h2>
        <button
          class="cart-close"
          type="button"
          @click="isCartOpen = false"
          aria-label="Close cart details"
          data-testid="cart-close"
        >
          ✕
        </button>
      </div>

      <p v-if="cartItems.length === 0" class="cart-empty" data-testid="empty-cart-message">
        Your cart is empty.
      </p>

      <ul v-else class="cart-items">
        <li v-for="item in cartItems" :key="item.album.id" class="cart-item">
          <div class="cart-item-info">
            <p class="cart-item-title">{{ item.album.title }}</p>
            <p class="cart-item-artist">{{ item.album.artist }}</p>
            <p class="cart-item-price">
              ${{ item.album.price.toFixed(2) }}
              <span v-if="item.quantity > 1"> × {{ item.quantity }}</span>
            </p>
          </div>
          <button
            class="remove-btn"
            type="button"
            @click="removeFromCart(item.album.id)"
            :aria-label="`Remove ${item.album.title} from cart`"
            :data-testid="`remove-cart-item-${item.album.id}`"
          >
            Remove
          </button>
        </li>
      </ul>

      <p v-if="cartItems.length > 0" class="cart-total">Total: ${{ cartTotal.toFixed(2) }}</p>
    </aside>

    <main class="main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading albums...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchAlbums" class="retry-btn">Try Again</button>
      </div>

      <div v-else class="albums-grid">
        <AlbumCard 
          v-for="album in albums" 
          :key="album.id" 
          :album="album" 
          @add-to-cart="addToCart"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import AlbumCard from './components/AlbumCard.vue'
import type { Album } from './types/album'

interface CartItem {
  album: Album
  quantity: number
}

const albums = ref<Album[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const cart = ref<Record<number, CartItem>>({})
const isCartOpen = ref<boolean>(false)

const cartItems = computed<CartItem[]>(() => Object.values(cart.value))
const cartCount = computed<number>(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0)
)
const cartTotal = computed<number>(() =>
  cartItems.value.reduce((total, item) => total + (item.album.price * item.quantity), 0)
)

const fetchAlbums = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get<Album[]>('/albums')
    albums.value = response.data
  } catch (err) {
    error.value = 'Failed to load albums. Please make sure the API is running.'
    console.error('Error fetching albums:', err)
  } finally {
    loading.value = false
  }
}

const addToCart = (album: Album): void => {
  const existing = cart.value[album.id]
  if (existing) {
    existing.quantity += 1
    return
  }

  cart.value[album.id] = { album, quantity: 1 }
}

const removeFromCart = (albumId: number): void => {
  const { [albumId]: _removed, ...remainingItems } = cart.value
  cart.value = remainingItems
}

const toggleCart = (): void => {
  isCartOpen.value = !isCartOpen.value
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    isCartOpen.value = false
  }
}

onMounted(() => {
  fetchAlbums()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
}

.header {
  margin-bottom: 3rem;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.cart-button {
  position: relative;
  min-width: 64px;
  height: 48px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart-button:hover,
.cart-button:focus-visible {
  background: rgba(255, 255, 255, 0.3);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #ff4d4f;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.4rem;
}

.cart-panel {
  max-width: 1200px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cart-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.cart-panel-header h2 {
  margin: 0;
  color: #333;
}

.cart-close {
  border: none;
  background: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  color: #333;
}

.cart-empty {
  margin: 0;
  color: #555;
}

.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.75rem 1rem;
}

.cart-item-info p {
  margin: 0;
}

.cart-item-title {
  font-weight: 600;
  color: #222;
}

.cart-item-artist,
.cart-item-price {
  color: #666;
}

.remove-btn {
  border: none;
  background: #ff4d4f;
  color: white;
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
}

.cart-total {
  margin: 1rem 0 0;
  text-align: right;
  font-weight: 700;
  color: #333;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 4rem;
  color: white;
}

.error p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: white;
  color: #667eea;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header h1 {
    font-size: 2rem;
  }

  .cart-button {
    width: 72px;
  }
  
  .albums-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
