import type { Product } from '~/types';

// Cart item interface
interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  maxStock: number;
  category: string;
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([]);
  const isLoading = ref(false);

  // Computed
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  });

  const isEmpty = computed(() => items.value.length === 0);

  // Actions
  const addItem = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find((item) => item.id === product.id);
    const productStock = product.quantity || 0;

    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += quantity;
      // Make sure we don't exceed stock
      if (existingItem.quantity > productStock) {
        existingItem.quantity = productStock;
      }
    } else {
      // Add new item to cart
      items.value.push({
        id: product.id,
        name: product.name,
        slug: `product-${product.id}`, // Generate slug if not available
        price: product.price,
        image: product.image,
        quantity: Math.min(quantity, productStock),
        maxStock: productStock,
        category: product.category,
      });
    }

    saveToLocalStorage();

    // Show success message (we'll add toast notifications later)
    console.log(`Added ${product.name} to cart`);
  };

  const removeItem = (productId: number) => {
    const index = items.value.findIndex((item) => item.id === productId);
    if (index > -1) {
      items.value.splice(index, 1);
      saveToLocalStorage();
      console.log('Item removed from cart');
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    const item = items.value.find((item) => item.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        removeItem(productId);
      } else {
        // Make sure we don't exceed stock
        item.quantity = Math.min(newQuantity, item.maxStock);
        saveToLocalStorage();
      }
    }
  };

  const clearCart = () => {
    items.value = [];
    saveToLocalStorage();
    console.log('Cart cleared');
  };

  const saveToLocalStorage = () => {
    if (process.client) {
      localStorage.setItem('shinyflakes_cart', JSON.stringify(items.value));
    }
  };

  const loadFromLocalStorage = () => {
    if (process.client) {
      const saved = localStorage.getItem('shinyflakes_cart');
      if (saved) {
        try {
          items.value = JSON.parse(saved) as CartItem[];
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
          items.value = [];
        }
      }
    }
  };

  const isInCart = (productId: number): boolean => {
    return items.value.some((item) => item.id === productId);
  };

  const getItemQuantity = (productId: number): number => {
    const item = items.value.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Initialize cart from localStorage on store creation
  const initCart = () => {
    loadFromLocalStorage();
  };

  return {
    // State
    items: readonly(items),
    isLoading: readonly(isLoading),

    // Computed
    itemCount,
    totalPrice,
    isEmpty,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    initCart,
  };
});
