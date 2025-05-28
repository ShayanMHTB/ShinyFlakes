<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-8">
      <Skeleton class="h-4 w-64" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton class="aspect-square w-full" />
        <div class="space-y-4">
          <Skeleton class="h-8 w-3/4" />
          <Skeleton class="h-4 w-1/2" />
          <Skeleton class="h-6 w-1/4" />
          <Skeleton class="h-16 w-full" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div
        class="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Icon name="lucide:alert-circle" class="h-12 w-12 text-destructive" />
      </div>
      <h2 class="text-3xl font-bold mb-2">Product not found</h2>
      <p class="text-muted-foreground mb-8 max-w-md mx-auto">
        The product you're looking for doesn't exist or has been removed from
        our inventory.
      </p>
      <Button asChild>
        <NuxtLink to="/products">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Browse All Products
        </NuxtLink>
      </Button>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="space-y-8">
      <!-- Breadcrumbs -->
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NuxtLink to="/">Home</NuxtLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NuxtLink to="/products">Products</NuxtLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{{ product.name }}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <!-- Product Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div class="space-y-4">
          <div
            class="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center"
          >
            <Icon name="lucide:image" class="h-24 w-24 text-muted-foreground" />
          </div>

          <!-- Thumbnail gallery (placeholder) -->
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="i in 4"
              :key="i"
              class="aspect-square bg-muted/50 rounded-md"
            ></div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Title & Badges -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Badge v-if="product.featured" variant="default">Featured</Badge>
              <Badge variant="outline">{{ product.category }}</Badge>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
              {{ product.name }}
            </h1>
          </div>

          <!-- Rating -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <Icon
                v-for="i in 5"
                :key="i"
                name="lucide:star"
                :class="[
                  'h-5 w-5',
                  i <= Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-muted-foreground',
                ]"
              />
            </div>
            <span class="text-lg font-medium"
              >{{ product.rating }} out of 5</span
            >
            <span class="text-muted-foreground"
              >({{ product.reviewCount }} reviews)</span
            >
          </div>

          <!-- Price -->
          <div class="py-4 border-y">
            <span class="text-4xl font-bold"
              >${{ product.price.toFixed(2) }}</span
            >
          </div>

          <!-- Stock Status -->
          <Alert :variant="product.inStock ? 'default' : 'destructive'">
            <Icon
              :name="
                product.inStock ? 'lucide:check-circle' : 'lucide:x-circle'
              "
              class="h-4 w-4"
            />
            <AlertDescription>
              {{
                product.inStock
                  ? `${product.quantity} items in stock`
                  : 'Currently out of stock'
              }}
            </AlertDescription>
          </Alert>

          <!-- Quantity Selector -->
          <div v-if="product.inStock" class="space-y-2">
            <Label>Quantity:</Label>
            <div class="flex items-center space-x-4">
              <div class="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  :disabled="selectedQuantity <= 1"
                  @click="decreaseQuantity"
                  class="h-10 w-10 rounded-r-none"
                >
                  <Icon name="lucide:minus" class="h-4 w-4" />
                </Button>
                <div class="px-4 py-2 min-w-[3rem] text-center font-medium">
                  {{ selectedQuantity }}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  :disabled="selectedQuantity >= product.quantity"
                  @click="increaseQuantity"
                  class="h-10 w-10 rounded-l-none"
                >
                  <Icon name="lucide:plus" class="h-4 w-4" />
                </Button>
              </div>
              <span class="text-sm text-muted-foreground">
                Max {{ product.quantity }} available
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <Button
              :disabled="!product.inStock"
              size="lg"
              class="w-full"
              @click="addToCart"
            >
              <Icon name="lucide:shopping-cart" class="mr-2 h-5 w-5" />
              Add to Cart - ${{ (product.price * selectedQuantity).toFixed(2) }}
            </Button>

            <div class="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" @click="toggleWishlist">
                <Icon name="lucide:heart" class="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>

              <Button variant="outline" size="lg" @click="shareProduct">
                <Icon name="lucide:share-2" class="mr-2 h-5 w-5" />
                Share Product
              </Button>
            </div>
          </div>

          <!-- Product Description -->
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground leading-relaxed">
                {{ product.description }}
              </p>
            </CardContent>
          </Card>

          <!-- Product Details -->
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl class="grid grid-cols-1 gap-4">
                <div class="flex justify-between py-2 border-b">
                  <dt class="font-medium">SKU:</dt>
                  <dd class="text-muted-foreground">
                    SF-{{ product.id.toString().padStart(6, '0') }}
                  </dd>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <dt class="font-medium">Category:</dt>
                  <dd class="text-muted-foreground capitalize">
                    {{ product.category }}
                  </dd>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <dt class="font-medium">Rating:</dt>
                  <dd class="text-muted-foreground">
                    {{ product.rating }}/5 ({{ product.reviewCount }} reviews)
                  </dd>
                </div>
                <div class="flex justify-between py-2">
                  <dt class="font-medium">Availability:</dt>
                  <dd
                    :class="product.inStock ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Reviews Section -->
      <Card class="mt-12">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>Customer Reviews</span>
            <Badge variant="secondary">{{ product.reviewCount }} reviews</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Review Item 1 -->
          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <Avatar>
                <AvatarFallback class="bg-primary text-primary-foreground"
                  >H</AvatarFallback
                >
              </Avatar>
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Heisenberg</h4>
                    <div class="flex items-center">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        name="lucide:star"
                        class="h-4 w-4 text-yellow-400 fill-current"
                      />
                    </div>
                  </div>
                  <span class="text-sm text-muted-foreground">2 days ago</span>
                </div>
                <p class="text-muted-foreground">
                  Say my name! This is the one who knocks... your socks off!
                  Absolutely perfect quality, just like what I used to cook.
                  99.1% pure satisfaction guaranteed.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Review Item 2 -->
          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <Avatar>
                <AvatarFallback class="bg-blue-500 text-white"
                  >J</AvatarFallback
                >
              </Avatar>
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Jesse_P</h4>
                    <div class="flex items-center">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        name="lucide:star"
                        class="h-4 w-4 text-yellow-400 fill-current"
                      />
                    </div>
                  </div>
                  <span class="text-sm text-muted-foreground">1 week ago</span>
                </div>
                <p class="text-muted-foreground">
                  Yo Mr. White! This is some serious gourmet stuff! Science,
                  bitch! 🔥 Fast shipping and exactly what I expected.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div class="text-center">
            <Button variant="outline">
              <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
              Load More Reviews
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Page meta
definePageMeta({
  layout: 'default',
});

// Get route params
const route = useRoute();
const api = useApi();
const cartStore = useCartStore();

// Reactive state
const product = ref(null);
const loading = ref(true);
const error = ref(false);
const selectedQuantity = ref(1);

// Methods
const loadProduct = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await api.products.getById(route.params.slug);
    product.value = response.data;

    // Update SEO
    useSeoMeta({
      title: `${response.data.name} | ShinyFlakes`,
      description: response.data.description,
    });
  } catch (err) {
    error.value = true;
    console.error('Failed to load product:', err);
  } finally {
    loading.value = false;
  }
};

const increaseQuantity = () => {
  if (product.value && selectedQuantity.value < product.value.quantity) {
    selectedQuantity.value++;
  }
};

const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--;
  }
};

const addToCart = () => {
  if (product.value) {
    cartStore.addItem(product.value, selectedQuantity.value);
    console.log(
      'Added to cart:',
      product.value.name,
      'x',
      selectedQuantity.value,
    );
    // You could add a toast notification here
  }
};

const toggleWishlist = () => {
  if (product.value) {
    console.log('Toggle wishlist:', product.value.id);
    // TODO: Implement wishlist functionality
  }
};

const shareProduct = async () => {
  if (navigator.share && product.value) {
    try {
      await navigator.share({
        title: product.value.name,
        text: product.value.description,
        url: window.location.href,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(window.location.href);
    console.log('Link copied to clipboard');
  }
};

// Load product on mount
onMounted(() => {
  loadProduct();
});
</script>
