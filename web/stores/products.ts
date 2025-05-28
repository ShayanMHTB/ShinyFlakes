import type { Product } from '~/types';

// Product filter interface
interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  featured?: boolean;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

// Pagination interface
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([]);
  const filteredProducts = ref<Product[]>([]);
  const categories = ref<string[]>([]);
  const isLoading = ref(false);
  const isSearching = ref(false);
  const error = ref<string | null>(null);

  // Filters and pagination
  const filters = ref<ProductFilters>({
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    featured: undefined,
    inStock: undefined,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const pagination = ref<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // API instance
  const api = useApi();

  // Computed
  const hasProducts = computed(() => products.value.length > 0);
  const hasFilteredProducts = computed(() => filteredProducts.value.length > 0);
  const totalProducts = computed(() => products.value.length);
  const isFiltered = computed(() => {
    return !!(
      filters.value.search ||
      filters.value.category ||
      filters.value.minPrice ||
      filters.value.maxPrice ||
      filters.value.minRating !== undefined ||
      filters.value.featured !== undefined ||
      filters.value.inStock !== undefined
    );
  });

  const priceRange = computed(() => {
    if (!hasProducts.value) return { min: 0, max: 1000 };

    const prices = products.value.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  });

  // Actions
  const fetchProducts = async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.products.getAll(params);

      if (params?.page && params.page > 1) {
        // Append for pagination
        products.value.push(...response.data);
      } else {
        // Replace for new search/filter
        products.value = response.data;
      }

      // Update pagination meta
      if (response.meta) {
        pagination.value = {
          page: response.meta.page || 1,
          limit: response.meta.limit || 12,
          total: response.meta.total || response.data.length,
          totalPages: Math.ceil(
            (response.meta.total || response.data.length) /
              (response.meta.limit || 12),
          ),
        };
      }

      // Apply local filters if any
      applyFilters();
    } catch (err) {
      error.value = 'Failed to fetch products';
      console.error('Products fetch error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.products.categories();
      categories.value = response.categories;
    } catch (err) {
      console.error('Categories fetch error:', err);
      // Fallback categories
      categories.value = ['electronics', 'chemicals', 'equipment', 'supplies'];
    }
  };

  const searchProducts = async (query: string) => {
    isSearching.value = true;
    filters.value.search = query;

    try {
      if (query.trim()) {
        await fetchProducts({ search: query, limit: 50 });
      } else {
        await fetchProducts({ limit: 50 });
      }
    } finally {
      isSearching.value = false;
    }
  };

  const applyFilters = () => {
    let filtered = [...products.value];

    // Search filter (client-side backup)
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm),
      );
    }

    // Category filter
    if (filters.value.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.value.category,
      );
    }

    // Price filters
    if (filters.value.minPrice !== undefined) {
      filtered = filtered.filter(
        (product) => product.price >= filters.value.minPrice!,
      );
    }
    if (filters.value.maxPrice !== undefined) {
      filtered = filtered.filter(
        (product) => product.price <= filters.value.maxPrice!,
      );
    }

    // Rating filter
    if (filters.value.minRating !== undefined) {
      filtered = filtered.filter(
        (product) => product.rating >= filters.value.minRating!,
      );
    }

    // Featured filter
    if (filters.value.featured !== undefined) {
      filtered = filtered.filter(
        (product) => !!product.featured === filters.value.featured,
      );
    }

    // Stock filter
    if (filters.value.inStock !== undefined) {
      filtered = filtered.filter(
        (product) => product.inStock === filters.value.inStock,
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.value.sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'newest':
          // Assume higher ID = newer (fallback)
          aValue = a.id;
          bValue = b.id;
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }

      if (filters.value.sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    filteredProducts.value = filtered;
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    Object.assign(filters.value, newFilters);
    applyFilters();
  };

  const clearFilters = () => {
    filters.value = {
      search: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      featured: undefined,
      inStock: undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    };
    filteredProducts.value = [...products.value];
  };

  const getProductById = (id: number): Product | undefined => {
    return products.value.find((product) => product.id === id);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.value.find(
      (product) => product.slug === slug || `product-${product.id}` === slug,
    );
  };

  const getFeaturedProducts = (limit: number = 6): Product[] => {
    return products.value.filter((product) => product.featured).slice(0, limit);
  };

  const getProductsByCategory = (
    category: string,
    limit?: number,
  ): Product[] => {
    const categoryProducts = products.value.filter(
      (product) => product.category === category,
    );
    return limit ? categoryProducts.slice(0, limit) : categoryProducts;
  };

  const getRelatedProducts = (
    productId: number,
    limit: number = 4,
  ): Product[] => {
    const product = getProductById(productId);
    if (!product) return [];

    return products.value
      .filter((p) => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  };

  const loadMoreProducts = async () => {
    if (pagination.value.page < pagination.value.totalPages) {
      await fetchProducts({
        page: pagination.value.page + 1,
        limit: pagination.value.limit,
        search: filters.value.search,
        category: filters.value.category,
      });
    }
  };

  // Initialize store
  const init = async () => {
    await Promise.all([fetchProducts({ limit: 50 }), fetchCategories()]);
  };

  return {
    // State
    products: readonly(products),
    filteredProducts: readonly(filteredProducts),
    categories: readonly(categories),
    isLoading: readonly(isLoading),
    isSearching: readonly(isSearching),
    error: readonly(error),
    filters: readonly(filters),
    pagination: readonly(pagination),

    // Computed
    hasProducts,
    hasFilteredProducts,
    totalProducts,
    isFiltered,
    priceRange,

    // Actions
    fetchProducts,
    fetchCategories,
    searchProducts,
    applyFilters,
    updateFilters,
    clearFilters,
    getProductById,
    getProductBySlug,
    getFeaturedProducts,
    getProductsByCategory,
    getRelatedProducts,
    loadMoreProducts,
    init,
  };
});
