import type { Product } from '~/types';

// Wishlist item interface
interface WishlistItem {
  id: number;
  product: Product;
  addedAt: string;
}

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const items = ref<WishlistItem[]>([]);
  const isLoading = ref(false);

  // Computed
  const itemCount = computed(() => items.value.length);
  const isEmpty = computed(() => items.value.length === 0);
  const productIds = computed(() => items.value.map((item) => item.id));

  // Actions
  const addItem = (product: Product) => {
    // Check if product is already in wishlist
    if (isInWishlist(product.id)) {
      console.log('Product already in wishlist');
      return false;
    }

    const wishlistItem: WishlistItem = {
      id: product.id,
      product: product,
      addedAt: new Date().toISOString(),
    };

    items.value.unshift(wishlistItem); // Add to beginning
    saveToLocalStorage();

    console.log(`Added ${product.name} to wishlist`);
    return true;
  };

  const removeItem = (productId: number) => {
    const index = items.value.findIndex((item) => item.id === productId);
    if (index > -1) {
      const removedItem = items.value.splice(index, 1)[0];
      saveToLocalStorage();
      console.log(`Removed ${removedItem.product.name} from wishlist`);
      return true;
    }
    return false;
  };

  const toggleItem = (product: Product) => {
    if (isInWishlist(product.id)) {
      return removeItem(product.id);
    } else {
      return addItem(product);
    }
  };

  const clearWishlist = () => {
    items.value = [];
    saveToLocalStorage();
    console.log('Wishlist cleared');
  };

  const isInWishlist = (productId: number): boolean => {
    return items.value.some((item) => item.id === productId);
  };

  const getItem = (productId: number): WishlistItem | undefined => {
    return items.value.find((item) => item.id === productId);
  };

  const moveToCart = (productId: number) => {
    const wishlistItem = getItem(productId);
    if (wishlistItem) {
      const cartStore = useCartStore();
      cartStore.addItem(wishlistItem.product);
      removeItem(productId);
      return true;
    }
    return false;
  };

  const moveAllToCart = () => {
    const cartStore = useCartStore();
    const movedItems: number[] = [];

    items.value.forEach((item) => {
      if (item.product.inStock) {
        cartStore.addItem(item.product);
        movedItems.push(item.id);
      }
    });

    // Remove moved items from wishlist
    items.value = items.value.filter((item) => !movedItems.includes(item.id));
    saveToLocalStorage();

    return movedItems.length;
  };

  const sortItems = (
    sortBy: 'name' | 'price' | 'dateAdded' | 'rating',
    order: 'asc' | 'desc' = 'asc',
  ) => {
    items.value.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.product.name.toLowerCase();
          bValue = b.product.name.toLowerCase();
          break;
        case 'price':
          aValue = a.product.price;
          bValue = b.product.price;
          break;
        case 'rating':
          aValue = a.product.rating;
          bValue = b.product.rating;
          break;
        case 'dateAdded':
        default:
          aValue = new Date(a.addedAt);
          bValue = new Date(b.addedAt);
          break;
      }

      if (order === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
  };

  const getItemsByCategory = (category: string): WishlistItem[] => {
    return items.value.filter((item) => item.product.category === category);
  };

  const getInStockItems = (): WishlistItem[] => {
    return items.value.filter((item) => item.product.inStock);
  };

  const getOutOfStockItems = (): WishlistItem[] => {
    return items.value.filter((item) => !item.product.inStock);
  };

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('shinyflakes_wishlist', JSON.stringify(items.value));
    }
  };

  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('shinyflakes_wishlist');
      if (saved) {
        try {
          items.value = JSON.parse(saved) as WishlistItem[];
        } catch (error) {
          console.error('Failed to load wishlist from localStorage:', error);
          items.value = [];
        }
      }
    }
  };

  // Sync with backend (if user is authenticated)
  const syncWithBackend = async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    isLoading.value = true;

    try {
      // TODO: Implement API calls when backend supports wishlist
      // const response = await api.wishlist.get();
      // items.value = response.data;
      console.log('Wishlist sync with backend not implemented yet');
    } catch (error) {
      console.error('Failed to sync wishlist with backend:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const saveToBackend = async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    try {
      // TODO: Implement API calls when backend supports wishlist
      // await api.wishlist.sync(items.value);
      console.log('Wishlist save to backend not implemented yet');
    } catch (error) {
      console.error('Failed to save wishlist to backend:', error);
    }
  };

  // Initialize wishlist from localStorage
  const initWishlist = () => {
    loadFromLocalStorage();
  };

  // Watch for auth changes to sync
  const authStore = useAuthStore();
  watch(
    () => authStore.isAuthenticated,
    (isAuth) => {
      if (isAuth) {
        syncWithBackend();
      }
    },
  );

  return {
    // State
    items: readonly(items),
    isLoading: readonly(isLoading),

    // Computed
    itemCount,
    isEmpty,
    productIds,

    // Actions
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    isInWishlist,
    getItem,
    moveToCart,
    moveAllToCart,
    sortItems,
    getItemsByCategory,
    getInStockItems,
    getOutOfStockItems,
    initWishlist,
    syncWithBackend,
    saveToBackend,
  };
});
