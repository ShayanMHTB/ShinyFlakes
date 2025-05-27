<template>
  <div class="space-y-6">
    <!-- Search Bar -->
    <div class="relative">
      <div class="relative">
        <Icon
          name="lucide:search"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="Search for products... (e.g., 'blue crystals', 'equipment')"
          class="pl-10 pr-10"
          @input="handleSearchInput"
        />
        <Button
          v-if="searchQuery"
          variant="ghost"
          size="icon"
          class="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          @click="clearSearch"
        >
          <Icon name="lucide:x" class="h-4 w-4" />
        </Button>
      </div>

      <!-- Search Suggestions -->
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
      >
        <div class="p-2">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
            @click="selectSuggestion(suggestion)"
          >
            <div
              class="w-10 h-10 bg-muted rounded-md flex items-center justify-center flex-shrink-0"
            >
              <Icon name="lucide:image" class="h-5 w-5 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ suggestion.name }}</p>
              <p class="text-xs text-muted-foreground truncate">
                {{ suggestion.category }}
              </p>
            </div>
            <div class="text-sm font-medium">${{ suggestion.price }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <CardTitle class="text-lg">Filters</CardTitle>
          <Button
            v-if="productsStore.isFiltered"
            variant="ghost"
            size="sm"
            @click="clearAllFilters"
          >
            <Icon name="lucide:x" class="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Quick Filters -->
        <div class="space-y-3">
          <Label class="text-sm font-medium">Quick Filters</Label>
          <div class="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              :class="
                filters.featured === true
                  ? 'bg-primary text-primary-foreground'
                  : ''
              "
              @click="toggleFilter('featured', true)"
            >
              <Icon name="lucide:star" class="h-3 w-3 mr-1" />
              Featured
            </Button>
            <Button
              variant="outline"
              size="sm"
              :class="
                filters.inStock === true
                  ? 'bg-primary text-primary-foreground'
                  : ''
              "
              @click="toggleFilter('inStock', true)"
            >
              <Icon name="lucide:check-circle" class="h-3 w-3 mr-1" />
              In Stock
            </Button>
            <Button
              variant="outline"
              size="sm"
              :class="
                filters.minRating === 4
                  ? 'bg-primary text-primary-foreground'
                  : ''
              "
              @click="toggleFilter('minRating', 4)"
            >
              <Icon name="lucide:star" class="h-3 w-3 mr-1" />
              4+ Stars
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Category Filter -->
        <div class="space-y-3">
          <Label class="text-sm font-medium">Category</Label>
          <Select
            v-model="filters.category"
            @update:model-value="updateFilters"
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem
                v-for="category in productsStore.categories"
                :key="category"
                :value="category"
              >
                {{ formatCategoryName(category) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Price Range -->
        <div class="space-y-3">
          <Label class="text-sm font-medium">Price Range</Label>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <Label class="text-xs text-muted-foreground">Min Price</Label>
              <Input
                v-model.number="filters.minPrice"
                type="number"
                placeholder="$0"
                :min="productsStore.priceRange.min"
                :max="productsStore.priceRange.max"
                @input="updateFilters"
              />
            </div>
            <div class="space-y-1">
              <Label class="text-xs text-muted-foreground">Max Price</Label>
              <Input
                v-model.number="filters.maxPrice"
                type="number"
                placeholder="$1000"
                :min="productsStore.priceRange.min"
                :max="productsStore.priceRange.max"
                @input="updateFilters"
              />
            </div>
          </div>
          <div class="text-xs text-muted-foreground">
            Range: ${{ productsStore.priceRange.min }} - ${{
              productsStore.priceRange.max
            }}
          </div>
        </div>

        <!-- Rating Filter -->
        <div class="space-y-3">
          <Label class="text-sm font-medium">Minimum Rating</Label>
          <div class="grid grid-cols-5 gap-1">
            <Button
              v-for="rating in [1, 2, 3, 4, 5]"
              :key="rating"
              variant="outline"
              size="sm"
              :class="
                filters.minRating === rating
                  ? 'bg-primary text-primary-foreground'
                  : ''
              "
              @click="setMinRating(rating)"
              class="aspect-square p-0"
            >
              {{ rating }}★
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Sort Options -->
        <div class="space-y-3">
          <Label class="text-sm font-medium">Sort By</Label>
          <div class="grid grid-cols-2 gap-3">
            <Select
              v-model="filters.sortBy"
              @update:model-value="updateFilters"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            <Select
              v-model="filters.sortOrder"
              @update:model-value="updateFilters"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">
                  {{ filters.sortBy === 'price' ? 'Low to High' : 'A to Z' }}
                </SelectItem>
                <SelectItem value="desc">
                  {{ filters.sortBy === 'price' ? 'High to Low' : 'Z to A' }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Active Filters -->
    <div v-if="activeFilters.length > 0" class="space-y-2">
      <Label class="text-sm font-medium">Active Filters:</Label>
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="filter in activeFilters"
          :key="filter.key"
          variant="secondary"
          class="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
          @click="removeFilter(filter.key)"
        >
          {{ filter.label }}
          <Icon name="lucide:x" class="h-3 w-3 ml-1" />
        </Badge>
      </div>
    </div>

    <!-- Search Results Summary -->
    <div class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        <span v-if="productsStore.isSearching" class="flex items-center">
          <Icon name="lucide:loader-2" class="h-4 w-4 mr-2 animate-spin" />
          Searching...
        </span>
        <span v-else>
          {{ resultsText }}
        </span>
      </div>

      <Button
        v-if="productsStore.isFiltered"
        variant="outline"
        size="sm"
        @click="clearAllFilters"
      >
        <Icon name="lucide:filter-x" class="h-4 w-4 mr-1" />
        Reset
      </Button>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Store
const productsStore = useProductsStore();

// Reactive state
const searchQuery = ref('');
const showSuggestions = ref(false);
const suggestions = ref([]);
const searchTimeout = ref(null);

const filters = reactive({
  category: '',
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  featured: undefined,
  inStock: undefined,
  sortBy: 'name',
  sortOrder: 'asc',
});

// Computed
const activeFilters = computed(() => {
  const active = [];

  if (searchQuery.value) {
    active.push({ key: 'search', label: `Search: "${searchQuery.value}"` });
  }
  if (filters.category) {
    active.push({
      key: 'category',
      label: `Category: ${formatCategoryName(filters.category)}`,
    });
  }
  if (filters.minPrice !== undefined) {
    active.push({ key: 'minPrice', label: `Min: $${filters.minPrice}` });
  }
  if (filters.maxPrice !== undefined) {
    active.push({ key: 'maxPrice', label: `Max: $${filters.maxPrice}` });
  }
  if (filters.minRating !== undefined) {
    active.push({ key: 'minRating', label: `${filters.minRating}+ Stars` });
  }
  if (filters.featured === true) {
    active.push({ key: 'featured', label: 'Featured' });
  }
  if (filters.inStock === true) {
    active.push({ key: 'inStock', label: 'In Stock' });
  }

  return active;
});

const resultsText = computed(() => {
  const count = productsStore.hasFilteredProducts
    ? productsStore.filteredProducts.length
    : productsStore.totalProducts;
  const total = productsStore.totalProducts;

  if (searchQuery.value || productsStore.isFiltered) {
    return `Found ${count} of ${total} products`;
  }
  return `Showing ${count} products`;
});

// Methods
const handleSearchInput = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.length >= 2) {
      showSuggestions.value = true;
      await loadSuggestions();
      await productsStore.searchProducts(searchQuery.value);
    } else if (searchQuery.value.length === 0) {
      showSuggestions.value = false;
      suggestions.value = [];
      await productsStore.searchProducts('');
    }
  }, 300);
};

const loadSuggestions = async () => {
  // Simple suggestion logic - filter existing products
  const query = searchQuery.value.toLowerCase();
  suggestions.value = productsStore.products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    )
    .slice(0, 5);
};

const selectSuggestion = (product) => {
  searchQuery.value = product.name;
  showSuggestions.value = false;
  productsStore.searchProducts(product.name);
};

const clearSearch = () => {
  searchQuery.value = '';
  showSuggestions.value = false;
  suggestions.value = [];
  productsStore.searchProducts('');
};

const updateFilters = () => {
  productsStore.updateFilters(filters);
};

const toggleFilter = (key, value) => {
  if (filters[key] === value) {
    filters[key] = undefined;
  } else {
    filters[key] = value;
  }
  updateFilters();
};

const setMinRating = (rating) => {
  filters.minRating = filters.minRating === rating ? undefined : rating;
  updateFilters();
};

const removeFilter = (filterKey) => {
  switch (filterKey) {
    case 'search':
      clearSearch();
      break;
    case 'category':
      filters.category = '';
      break;
    case 'minPrice':
      filters.minPrice = undefined;
      break;
    case 'maxPrice':
      filters.maxPrice = undefined;
      break;
    case 'minRating':
      filters.minRating = undefined;
      break;
    case 'featured':
      filters.featured = undefined;
      break;
    case 'inStock':
      filters.inStock = undefined;
      break;
  }
  updateFilters();
};

const clearAllFilters = () => {
  searchQuery.value = '';
  Object.keys(filters).forEach((key) => {
    if (key === 'sortBy') {
      filters[key] = 'name';
    } else if (key === 'sortOrder') {
      filters[key] = 'asc';
    } else {
      filters[key] = key === 'category' ? '' : undefined;
    }
  });
  showSuggestions.value = false;
  suggestions.value = [];
  productsStore.clearFilters();
};

const formatCategoryName = (category) => {
  return (
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
  );
};

// Handle clicks outside to close suggestions
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>
