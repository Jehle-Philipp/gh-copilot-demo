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
          aria-label="Open shopping cart"
          @click="toggleCart"
        >
          <span aria-hidden="true">🛒</span>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>
      </div>
    </header>

    <aside
      v-if="isCartOpen"
      class="cart-panel"
      aria-label="Shopping cart details"
    >
      <div class="cart-header">
        <h2>Your Cart</h2>
        <button
          class="close-cart"
          aria-label="Close shopping cart"
          @click="isCartOpen = false"
        >
          ✕
        </button>
      </div>

      <p v-if="cartItems.length === 0" class="cart-empty">Your cart is empty.</p>

      <ul v-else class="cart-list">
        <li v-for="item in cartItems" :key="item.album.id" class="cart-item">
          <div>
            <p class="cart-item-title">{{ item.album.title }}</p>
            <p class="cart-item-meta">
              {{ item.album.artist }} · ${{ item.album.price.toFixed(2) }} x {{ item.quantity }}
            </p>
          </div>
          <button
            class="remove-btn"
            :aria-label="`Remove ${item.album.title} from cart`"
            @click="removeFromCart(item.album.id)"
          >
            Remove
          </button>
        </li>
      </ul>

      <p v-if="cartItems.length > 0" class="cart-total">
        Total: ${{ cartTotal.toFixed(2) }}
      </p>
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
import { onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import AlbumCard from './components/AlbumCard.vue'
import { useCart } from './composables/useCart'
import type { Album } from './types/album'

const albums = ref<Album[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const isCartOpen = ref<boolean>(false)

const { items: cartItems, cartCount, cartTotal, addToCart, removeFromCart } = useCart()

  // Fetch albums from the API
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

onMounted(() => {
  fetchAlbums()
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

const toggleCart = (): void => {
  isCartOpen.value = !isCartOpen.value
}

const onKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    isCartOpen.value = false
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
}

.header {
  margin-bottom: 3rem;
  color: white;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
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
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cart-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.cart-button:focus-visible,
.close-cart:focus-visible,
.remove-btn:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
}

.cart-panel {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: min(420px, calc(100vw - 2rem));
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: 1rem;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  z-index: 10;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.cart-header h2 {
  margin: 0;
  color: #111827;
}

.close-cart {
  border: none;
  background: #e5e7eb;
  color: #111827;
  border-radius: 8px;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}

.cart-empty {
  margin: 0;
  color: #374151;
}

.cart-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.cart-item {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.cart-item-title {
  margin: 0;
  font-weight: 700;
  color: #111827;
}

.cart-item-meta {
  margin: 0.25rem 0 0;
  color: #4b5563;
  font-size: 0.9rem;
}

.remove-btn {
  border: none;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-weight: 600;
}

.cart-total {
  margin: 1rem 0 0;
  font-weight: 700;
  color: #111827;
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
    align-items: flex-start;
  }
  
  .header h1 {
    font-size: 2rem;
  }

  .cart-panel {
    top: 0.75rem;
    right: 0.75rem;
    width: calc(100vw - 1.5rem);
    max-height: calc(100vh - 1.5rem);
  }
  
  .albums-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
