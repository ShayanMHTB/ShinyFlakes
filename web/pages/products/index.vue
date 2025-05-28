<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Products
      </h1>
      <p class="text-muted-foreground">
        Discover our premium collection of high-quality products
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar with Search and Filters -->
      <div class="lg:col-span-1">
        <div class="sticky top-4">
          <ProductSearch />
        </div>
      </div>

      <!-- Products Grid -->
      <div class="lg:col-span-3">
        <!-- View Toggle -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              :class="
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''
              "
              @click="viewMode = 'grid'"
            >
              <Icon name="lucide:grid-3x3" class="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              :class="
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''
              "
              @click="viewMode = 'list'"
            >
              <Icon name="lucide:list" class="h-4 w-4" />
            </Button>
          </div>

          <!-- Results count and pagination info -->
          <div class="text-sm text-muted-foreground">
            Page {{ productsStore.pagination.page }} of
            {{ productsStore.pagination.totalPages }}
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="productsStore.isLoading && !productsStore.hasProducts"
          class="space-y-6"
        >
          <div v-for="i in 6" :key="i" class="space-y-4">
            <Skeleton v-if="viewMode === 'grid'" class="aspect-square w-full" />
            <Skeleton v-else class="h-32 w-full" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-3/4" />
              <Skeleton class="h-4 w-1/2" />
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div
          v-else-if="
            !productsStore.hasFilteredProducts && !productsStore.isLoading
          "
          class="text-center py-16"
        >
          <div
            class="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Icon
              name="lucide:search-x"
              class="h-12 w-12 text-muted-foreground"
            />
          </div>
          <h3 class="text-2xl font-bold mb-2">No products found</h3>
          <p class="text-muted-foreground mb-8 max-w-md mx-auto">
            We couldn't find any products matching your criteria. Try adjusting
            your filters or search terms.
          </p>
          <Button @click="productsStore.clearFilters()">
            <Icon name="lucide:filter-x" class="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        </div>

        <!-- Products Grid View -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <ProductCard
            v-for="product in displayProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
            @wishlist="handleWishlist"
            @quick-view="handleQuickView"
          />
        </div>

        <!-- Products List View -->
        <div v-else class="space-y-4">
          <ProductListItem
            v-for="product in displayProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
            @wishlist="handleWishlist"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="canLoadMore" class="text-center mt-12">
          <Button
            :disabled="productsStore.isLoading"
            size="lg"
            variant="outline"
            @click="loadMore"
          >
            <Icon
              v-if="productsStore.isLoading"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <Icon v-else name="lucide:chevron-down" class="mr-2 h-4 w-4" />
            {{ productsStore.isLoading ? 'Loading...' : 'Load More Products' }}
          </Button>
        </div>

        <!-- Pagination Info -->
        <div
          v-if="productsStore.hasFilteredProducts"
          class="text-center mt-8 text-sm text-muted-foreground"
        >
          Showing {{ displayProducts.length }} of
          {{ productsStore.pagination.total }} products
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <Dialog v-model:open="showQuickView">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{{ selectedProduct?.name }}</DialogTitle>
        </DialogHeader>
        <div
          v-if="selectedProduct"
          class="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <!-- Product Image -->
          <div
            class="aspect-square bg-muted rounded-lg flex items-center justify-center"
          >
            <Icon name="lucide:image" class="h-16 w-16 text-muted-foreground" />
          </div>

          <!-- Product Details -->
          <div class="space-y-4">
            <div>
              <Badge variant="outline" class="mb-2">{{
                selectedProduct.category
              }}</Badge>
              <h3 class="text-2xl font-bold">{{ selectedProduct.name }}</h3>
              <p class="text-muted-foreground">
                {{ selectedProduct.description }}
              </p>
            </div>

            <!-- Rating -->
            <div class="flex items-center space-x-1">
              <div class="flex">
                <Icon
                  v-for="i in 5"
                  :key="i"
                  name="lucide:star"
                  :class="[
                    'h-4 w-4',
                    i <= Math.floor(selectedProduct.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-muted-foreground',
                  ]"
                />
              </div>
              <span class="text-sm text-muted-foreground">
                ({{ selectedProduct.reviewCount || 0 }} reviews)
              </span>
            </div>

            <!-- Price -->
            <div class="text-3xl font-bold text-primary">
              ${{ selectedProduct.price.toFixed(2) }}
            </div>

            <!-- Stock Status -->
            <Alert
              :variant="selectedProduct.inStock ? 'default' : 'destructive'"
            >
              <Icon
                :name="
                  selectedProduct.inStock
                    ? 'lucide:check-circle'
                    : 'lucide:x-circle'
                "
                class="h-4 w-4"
              />
              <AlertDescription>
                {{
                  selectedProduct.inStock
                    ? `${selectedProduct.quantity} items in stock`
                    : 'Currently out of stock'
                }}
              </AlertDescription>
            </Alert>

            <!-- Actions -->
            <div class="space-y-3">
              <Button
                :disabled="!selectedProduct.inStock"
                class="w-full"
                @click="handleAddToCart(selectedProduct)"
              >
                <Icon name="lucide:shopping-cart" class="mr-2 h-4 w-4" />
                Add to Cart
              </Button>

              <div class="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild>
                  <NuxtLink
                    :to="`/products/${
                      selectedProduct.slug || selectedProduct.id
                    }`"
                  >
                    <Icon name="lucide:eye" class="mr-2 h-4 w-4" />
                    View Details
                  </NuxtLink>
                </Button>
                <Button
                  variant="outline"
                  @click="handleWishlist(selectedProduct.id)"
                >
                  <Icon name="lucide:heart" class="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Success Toast -->
    <div v-if="showToast" class="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert class="border-green-500 bg-green-50 dark:bg-green-950">
        <Icon name="lucide:check-circle" class="h-4 w-4 text-green-600" />
        <AlertTitle class="text-green-800 dark:text-green-200"
          >Success!</AlertTitle
        >
        <AlertDescription class="text-green-700 dark:text-green-300">
          {{ toastMessage }}
        </AlertDescription>
      </Alert>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductCard from '@/components/ProductCard.vue';
import ProductListItem from '@/components/ProductListItem.vue';
import ProductSearch from '@/components/ProductSearch.vue';

// Page meta
definePageMeta({
  layout: 'default',
});

// SEO
useSeoMeta({
  title: 'Products | ShinyFlakes',
  description:
    'Browse our premium collection of high-quality products with advanced search and filtering options.',
});

// Stores
const productsStore = useProductsStore();
const cartStore = useCartStore();

// State
const viewMode = ref('grid');
const showQuickView = ref(false);
const selectedProduct = ref(null);
const showToast = ref(false);
const toastMessage = ref('');

// Computed
const displayProducts = computed(() => {
  return productsStore.hasFilteredProducts
    ? productsStore.filteredProducts
    : productsStore.products;
});

const canLoadMore = computed(() => {
  return (
    productsStore.pagination.page < productsStore.pagination.totalPages &&
    !productsStore.isFiltered
  );
});

// Methods
const handleAddToCart = (product) => {
  cartStore.addItem(product);
  showToastMessage(`${product.name} added to cart!`);
};

const handleWishlist = (productId) => {
  // TODO: Implement wishlist functionality
  console.log('Add to wishlist:', productId);
  showToastMessage('Added to wishlist!');
};

const handleQuickView = (productId) => {
  selectedProduct.value = productsStore.getProductById(productId);
  showQuickView.value = true;
};

const loadMore = async () => {
  await productsStore.loadMoreProducts();
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Initialize
onMounted(async () => {
  // Initialize the products store if not already done
  if (!productsStore.hasProducts) {
    await productsStore.init();
  }
});
</script>
