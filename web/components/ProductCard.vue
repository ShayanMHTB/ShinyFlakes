<template>
  <Card
    class="overflow-hidden group hover:shadow-lg transition-all duration-200 h-full flex flex-col"
  >
    <!-- Product Image -->
    <div class="aspect-square overflow-hidden bg-muted relative">
      <div class="h-full w-full flex items-center justify-center">
        <NuxtImg
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <Icon
          v-else
          name="lucide:image"
          class="h-16 w-16 text-muted-foreground"
        />
      </div>

      <!-- Badges -->
      <div class="absolute top-2 left-2 space-y-1">
        <Badge v-if="product.featured" variant="default" class="text-xs">
          <Icon name="lucide:star" class="h-3 w-3 mr-1" />
          Featured
        </Badge>
        <Badge v-if="!product.inStock" variant="destructive" class="text-xs">
          Out of Stock
        </Badge>
        <Badge v-if="isOnSale" variant="secondary" class="text-xs">
          Sale
        </Badge>
      </div>

      <!-- Quick Actions -->
      <div
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              class="h-8 w-8 shadow-md"
              :class="
                isInWishlist ? 'bg-red-500 text-white hover:bg-red-600' : ''
              "
              @click="toggleWishlist"
            >
              <Icon
                :name="isInWishlist ? 'lucide:heart-filled' : 'lucide:heart'"
                class="h-4 w-4"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              class="h-8 w-8 shadow-md"
              @click="$emit('quickView', product.id)"
            >
              <Icon name="lucide:eye" class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Quick View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              class="h-8 w-8 shadow-md"
              @click="shareProduct"
            >
              <Icon name="lucide:share-2" class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Product</TooltipContent>
        </Tooltip>
      </div>

      <!-- Discount Badge -->
      <div v-if="discountPercentage > 0" class="absolute bottom-2 left-2">
        <Badge variant="destructive" class="text-xs font-bold">
          -{{ discountPercentage }}%
        </Badge>
      </div>
    </div>

    <CardContent class="p-4 space-y-3 flex-1 flex flex-col">
      <!-- Product Info -->
      <div class="space-y-2 flex-1">
        <div class="flex items-center justify-between">
          <Badge variant="outline" class="text-xs">{{
            formatCategory(product.category)
          }}</Badge>
          <div class="flex items-center space-x-1">
            <Icon
              name="lucide:star"
              class="h-3 w-3 text-yellow-400 fill-current"
            />
            <span class="text-xs text-muted-foreground">{{
              product.rating.toFixed(1)
            }}</span>
          </div>
        </div>

        <h3 class="font-semibold line-clamp-2 leading-tight">
          <Button
            variant="link"
            class="h-auto p-0 text-left font-semibold hover:text-primary"
            asChild
          >
            <NuxtLink :to="`/products/${product.slug || product.id}`">
              {{ product.name }}
            </NuxtLink>
          </Button>
        </h3>

        <p class="text-sm text-muted-foreground line-clamp-2">
          {{ product.description }}
        </p>
      </div>

      <!-- Rating -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-1">
          <div class="flex">
            <Icon
              v-for="i in 5"
              :key="i"
              name="lucide:star"
              :class="[
                'h-3 w-3',
                i <= Math.floor(product.rating || 0)
                  ? 'text-yellow-400 fill-current'
                  : 'text-muted-foreground',
              ]"
            />
          </div>
          <span class="text-xs text-muted-foreground">
            ({{ product.reviewCount || 0 }})
          </span>
        </div>

        <!-- Stock Status -->
        <div
          v-if="product.inStock && product.quantity"
          class="flex items-center text-xs"
        >
          <Icon name="lucide:package" class="h-3 w-3 mr-1 text-green-500" />
          <span class="text-green-600">{{ product.quantity }} left</span>
        </div>
      </div>

      <!-- Price and Actions -->
      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="text-xl font-bold text-primary">
                ${{ formatPrice(product.price) }}
              </span>
              <span
                v-if="isOnSale"
                class="text-sm text-muted-foreground line-through"
              >
                ${{ formatPrice(product.originalPrice) }}
              </span>
            </div>
            <p v-if="installmentPrice" class="text-xs text-muted-foreground">
              or {{ installmentPrice }}/month
            </p>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <Button
          :disabled="!product.inStock || isAddingToCart"
          :variant="product.inStock ? 'default' : 'secondary'"
          class="w-full"
          @click="handleAddToCart"
        >
          <Icon
            v-if="isAddingToCart"
            name="lucide:loader-2"
            class="h-4 w-4 mr-2 animate-spin"
          />
          <Icon v-else-if="isInCart" name="lucide:check" class="h-4 w-4 mr-2" />
          <Icon v-else name="lucide:plus" class="h-4 w-4 mr-2" />
          {{ buttonText }}
        </Button>

        <!-- Additional Action -->
        <Button
          v-if="product.inStock"
          variant="outline"
          size="sm"
          class="w-full"
          @click="$emit('quickView', product.id)"
        >
          <Icon name="lucide:eye" class="h-4 w-4 mr-2" />
          Quick View
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Props
defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// Emits
defineEmits(['addToCart', 'wishlist', 'quickView']);

// Stores
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

// State
const isAddingToCart = ref(false);

// Computed
const isOnSale = computed(() => {
  return (
    props.product.originalPrice &&
    props.product.originalPrice > props.product.price
  );
});

const discountPercentage = computed(() => {
  if (!isOnSale.value) return 0;
  return Math.round(
    ((props.product.originalPrice - props.product.price) /
      props.product.originalPrice) *
      100,
  );
});

const isInCart = computed(() => {
  return cartStore.isInCart(props.product.id);
});

const isInWishlist = computed(() => {
  return wishlistStore.isInWishlist(props.product.id);
});

const buttonText = computed(() => {
  if (isAddingToCart.value) return 'Adding...';
  if (!props.product.inStock) return 'Sold Out';
  if (isInCart.value) return 'Added to Cart';
  return 'Add to Cart';
});

const installmentPrice = computed(() => {
  if (props.product.price < 100) return null;
  return `$${(props.product.price / 12).toFixed(2)}`;
});

// Methods
const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : '0.00';
};

const formatCategory = (category) => {
  return (
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
  );
};

const handleAddToCart = async () => {
  if (isInCart.value) {
    // Navigate to cart if already added
    await navigateTo('/cart');
    return;
  }

  isAddingToCart.value = true;

  try {
    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    emit('addToCart', props.product);
  } finally {
    isAddingToCart.value = false;
  }
};

const toggleWishlist = () => {
  const success = wishlistStore.toggleItem(props.product);
  if (success) {
    const action = isInWishlist.value ? 'Added to' : 'Removed from';
    console.log(`${action} wishlist: ${props.product.name}`);
  }
};

const shareProduct = async () => {
  const url = `${window.location.origin}/products/${
    props.product.slug || props.product.id
  }`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: props.product.name,
        text: props.product.description,
        url: url,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      // You could show a toast here
      console.log('Link copied to clipboard');
    } catch (err) {
      console.log('Failed to copy link');
    }
  }
};
</script>
