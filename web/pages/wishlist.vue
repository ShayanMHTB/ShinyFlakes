<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8 text-center md:text-left">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        My Wishlist
      </h1>
      <p class="text-muted-foreground">Save your favorite products for later</p>
    </div>

    <!-- Empty Wishlist -->
    <div v-if="wishlistStore.isEmpty" class="text-center py-16">
      <div
        class="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Icon name="lucide:heart" class="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 class="text-2xl font-bold mb-2">Your wishlist is empty</h3>
      <p class="text-muted-foreground mb-8 max-w-md mx-auto">
        Start browsing our products and save your favorites to see them here!
      </p>
      <Button size="lg" asChild>
        <NuxtLink to="/products">
          <Icon name="lucide:shopping-bag" class="mr-2 h-5 w-5" />
          Browse Products
        </NuxtLink>
      </Button>
    </div>

    <!-- Wishlist with Items -->
    <div v-else class="space-y-6">
      <!-- Wishlist Actions -->
      <Card>
        <CardContent class="p-4">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="flex items-center space-x-4">
              <Badge variant="secondary" class="text-sm">
                {{ wishlistStore.itemCount }}
                {{ wishlistStore.itemCount === 1 ? 'item' : 'items' }}
              </Badge>
              <Badge variant="outline" class="text-sm">
                {{ inStockCount }} in stock
              </Badge>
            </div>

            <div class="flex items-center space-x-2">
              <!-- Sort Options -->
              <Select v-model="sortBy" @update:model-value="handleSort">
                <SelectTrigger class="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateAdded">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>

              <!-- Bulk Actions -->
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Icon name="lucide:more-horizontal" class="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    @click="moveAllToCart"
                    :disabled="inStockCount === 0"
                  >
                    <Icon name="lucide:shopping-cart" class="h-4 w-4 mr-2" />
                    Add All to Cart
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="shareWishlist">
                    <Icon name="lucide:share-2" class="h-4 w-4 mr-2" />
                    Share Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="clearWishlist"
                    class="text-destructive"
                  >
                    <Icon name="lucide:trash-2" class="h-4 w-4 mr-2" />
                    Clear Wishlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Wishlist Items -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <Card
          v-for="item in wishlistStore.items"
          :key="item.id"
          class="group hover:shadow-lg transition-shadow relative"
        >
          <!-- Remove Button -->
          <Button
            variant="ghost"
            size="icon"
            class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
            @click="removeFromWishlist(item.id)"
          >
            <Icon name="lucide:x" class="h-4 w-4" />
          </Button>

          <!-- Product Image -->
          <div class="aspect-square overflow-hidden bg-muted">
            <NuxtLink :to="`/products/${item.product.slug || item.id}`">
              <div
                class="h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
              >
                <NuxtImg
                  v-if="item.product.image"
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <Icon
                  v-else
                  name="lucide:image"
                  class="h-16 w-16 text-muted-foreground"
                />
              </div>
            </NuxtLink>
          </div>

          <CardContent class="p-4 space-y-3">
            <!-- Product Info -->
            <div class="space-y-2">
              <Badge variant="outline" class="text-xs">{{
                formatCategory(item.product.category)
              }}</Badge>

              <h3 class="font-semibold line-clamp-2 leading-tight">
                <Button
                  variant="link"
                  class="h-auto p-0 text-left font-semibold hover:text-primary"
                  asChild
                >
                  <NuxtLink :to="`/products/${item.product.slug || item.id}`">
                    {{ item.product.name }}
                  </NuxtLink>
                </Button>
              </h3>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-1">
                  <div class="flex">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      name="lucide:star"
                      :class="[
                        'h-3 w-3',
                        i <= Math.floor(item.product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-foreground',
                      ]"
                    />
                  </div>
                  <span class="text-xs text-muted-foreground">
                    {{ item.product.rating.toFixed(1) }}
                  </span>
                </div>

                <div class="text-sm text-muted-foreground">
                  {{ formatDate(item.addedAt) }}
                </div>
              </div>
            </div>

            <!-- Price -->
            <div class="text-xl font-bold text-primary">
              ${{ formatPrice(item.product.price) }}
            </div>

            <!-- Stock Status -->
            <Alert
              :variant="item.product.inStock ? 'default' : 'destructive'"
              class="py-2"
            >
              <Icon
                :name="
                  item.product.inStock
                    ? 'lucide:check-circle'
                    : 'lucide:x-circle'
                "
                class="h-3 w-3"
              />
              <AlertDescription class="text-xs">
                {{
                  item.product.inStock
                    ? `${item.product.quantity} in stock`
                    : 'Out of stock'
                }}
              </AlertDescription>
            </Alert>

            <!-- Actions -->
            <div class="space-y-2">
              <Button
                :disabled="!item.product.inStock"
                class="w-full"
                @click="addToCart(item.product)"
              >
                <Icon name="lucide:shopping-cart" class="h-4 w-4 mr-2" />
                {{ item.product.inStock ? 'Add to Cart' : 'Out of Stock' }}
              </Button>

              <div class="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <NuxtLink :to="`/products/${item.product.slug || item.id}`">
                    <Icon name="lucide:eye" class="h-3 w-3 mr-1" />
                    View
                  </NuxtLink>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click="shareProduct(item.product)"
                >
                  <Icon name="lucide:share-2" class="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>You might also like</CardTitle>
            <CardDescription>
              Based on your wishlist preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="product in relatedProducts"
                :key="product.id"
                class="text-center space-y-2 p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div
                  class="aspect-square bg-muted rounded-md flex items-center justify-center"
                >
                  <Icon
                    name="lucide:image"
                    class="h-8 w-8 text-muted-foreground"
                  />
                </div>
                <h4 class="font-medium text-sm line-clamp-1">
                  {{ product.name }}
                </h4>
                <div class="text-sm font-bold text-primary">
                  ${{ formatPrice(product.price) }}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  @click="addToWishlist(product)"
                >
                  <Icon name="lucide:heart" class="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

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

    <!-- Confirmation Dialog -->
    <AlertDialog v-model:open="showConfirmDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Wishlist</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove all items from your wishlist? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="confirmClearWishlist"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Clear Wishlist
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Page meta
definePageMeta({
  layout: 'default',
});

// SEO
useSeoMeta({
  title: 'My Wishlist | ShinyFlakes',
  description: 'Save and manage your favorite ShinyFlakes products',
});

// Stores
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const productsStore = useProductsStore();

// State
const sortBy = ref('dateAdded');
const showToast = ref(false);
const toastMessage = ref('');
const showConfirmDialog = ref(false);
const relatedProducts = ref([]);

// Computed
const inStockCount = computed(() => {
  return wishlistStore.getInStockItems().length;
});

// Methods
const handleSort = () => {
  wishlistStore.sortItems(sortBy.value, 'desc');
};

const removeFromWishlist = (productId) => {
  wishlistStore.removeItem(productId);
  showToastMessage('Removed from wishlist');
};

const addToCart = (product) => {
  cartStore.addItem(product);
  showToastMessage(`${product.name} added to cart!`);
};

const addToWishlist = (product) => {
  if (wishlistStore.addItem(product)) {
    showToastMessage(`${product.name} added to wishlist!`);
  }
};

const moveAllToCart = () => {
  const count = wishlistStore.moveAllToCart();
  if (count > 0) {
    showToastMessage(`${count} items moved to cart!`);
  }
};

const clearWishlist = () => {
  showConfirmDialog.value = true;
};

const confirmClearWishlist = () => {
  wishlistStore.clearWishlist();
  showToastMessage('Wishlist cleared');
  showConfirmDialog.value = false;
};

const shareWishlist = async () => {
  const url = `${window.location.origin}/wishlist`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My ShinyFlakes Wishlist',
        text: 'Check out my favorite products on ShinyFlakes!',
        url: url,
      });
    } catch (err) {
      console.log('Error sharing wishlist:', err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      showToastMessage('Wishlist link copied to clipboard!');
    } catch (err) {
      console.log('Failed to copy link');
    }
  }
};

const shareProduct = async (product) => {
  const url = `${window.location.origin}/products/${
    product.slug || product.id
  }`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: url,
      });
    } catch (err) {
      console.log('Error sharing product:', err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      showToastMessage('Product link copied to clipboard!');
    } catch (err) {
      console.log('Failed to copy link');
    }
  }
};

const loadRelatedProducts = () => {
  // Get categories from wishlist items
  const categories = [
    ...new Set(wishlistStore.items.map((item) => item.product.category)),
  ];

  // Get related products from different categories
  const related = [];
  categories.forEach((category) => {
    const categoryProducts = productsStore.getProductsByCategory(category, 2);
    categoryProducts.forEach((product) => {
      if (!wishlistStore.isInWishlist(product.id) && related.length < 4) {
        related.push(product);
      }
    });
  });

  relatedProducts.value = related;
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : '0.00';
};

const formatCategory = (category) => {
  return (
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Initialize
onMounted(() => {
  // Load related products if we have wishlist items
  if (!wishlistStore.isEmpty) {
    loadRelatedProducts();
  }
});

// Watch for changes in wishlist to update related products
watch(
  () => wishlistStore.itemCount,
  () => {
    if (!wishlistStore.isEmpty) {
      loadRelatedProducts();
    } else {
      relatedProducts.value = [];
    }
  },
);
</script>
