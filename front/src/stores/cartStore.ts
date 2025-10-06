import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types/index';

interface CartState {
  items: CartItem[];
  lastUpdated: number | null;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
  checkExpiration: () => void;
}

const CART_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora en milisegundos

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastUpdated: null,

      checkExpiration: () => {
        const { lastUpdated, items } = get();
        
        if (lastUpdated && items.length > 0) {
          const now = Date.now();
          const elapsed = now - lastUpdated;
          
          if (elapsed > CART_EXPIRATION_TIME) {
            // Carrito expirado, limpiar
            set({ items: [], lastUpdated: null });
            console.log('Carrito expirado y limpiado');
          }
        }
      },

      addItem: (product, quantity) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            lastUpdated: Date.now(),
          });
        } else {
          set({ 
            items: [...items, { product, quantity }],
            lastUpdated: Date.now(),
          });
        }
      },

      removeItem: (productId) => {
        const newItems = get().items.filter((item) => item.product.id !== productId);
        set({ 
          items: newItems,
          lastUpdated: newItems.length > 0 ? Date.now() : null,
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
          lastUpdated: Date.now(),
        });
      },

      clearCart: () => {
        set({ items: [], lastUpdated: null });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.product.price) * item.quantity,
          0
        );
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        // Verificar expiración al cargar el store
        if (state) {
          state.checkExpiration();
        }
      },
    }
  )
);

// Verificar expiración cada minuto
if (typeof window !== 'undefined') {
  setInterval(() => {
    useCartStore.getState().checkExpiration();
  }, 60000); // 1 minuto
}