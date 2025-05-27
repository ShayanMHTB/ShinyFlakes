<template>
  <Card class="overflow-hidden hover:shadow-md transition-shadow">
    <CardContent class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <!-- Product Image -->
        <div
          class="aspect-square md:aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden"
        >
          <NuxtImg
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <Icon
            v-else
            name="lucide:image"
            class="h-12 w-12 text-muted-foreground"
          />
        </div>

        <!-- Product Info -->
        <div class="md:col-span-2 space-y-2">
          <div class="flex items-center space-x-2">
            <Badge variant="outline">{{ product.category }}</Badge>
            <Badge v-if="product.featured">Featured</Badge>
            <Badge v-if="!product.inStock" variant="destructive"
              >Out of Stock</Badge
            >
          </div>
          <h3 class="text-xl font-semibold">
            <Button
              variant="link"
              class="h-auto p-0 text-left font-semibold text-xl"
              asChild
            >
              <NuxtLink :to="`/products/${product.slug || product.id}`">
                {{ product.name }}
              </NuxtLink>
            </Button>
          </h3>
          <p class="text-muted-foreground line-clamp-2">
            {{ product.description }}
          </p>
          <div class="flex items-center space-x-1">
            <div class="flex">
              <Icon
                v-for="i in 5"
                :key="i"
                name="lucide:star"
                :class="[
                  'h-4 w-4',
                  i <= Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-muted-foreground',
                ]"
              />
            </div>
            <span class="text-sm text-muted-foreground"
              >({{ product.reviewCount || 0 }})</span
            >
          </div>
        </div>

        <!-- Price and Actions -->
        <div class="text-right space-y-4">
          <div class="space-y-1">
            <div class="text-2xl font-bold">
              ${{ formatPrice(product.price) }}
            </div>
            <p
              v-if="
                product.originalPrice && product.originalPrice > product.price
              "
              class="text-sm text-muted-foreground line-through"
            >
              ${{ formatPrice(product.originalPrice) }}
            </p>
          </div>

          <div
            v-if="product.inStock"
            class="flex items-center justify-end text-sm"
          >
            <Icon
              name="lucide:check-circle"
              class="h-4 w-4 mr-1 text-green-500"
            />
            <span class="text-green-600">{{ product.quantity }} in stock</span>
          </div>

          <div class="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="icon"
              @click="$emit('wishlist', product.id)"
            >
              <Icon name="lucide:heart" class="h-4 w-4" />
            </Button>
            <Button
              @click="$emit('addToCart', product)"
              :disabled="!product.inStock"
              :variant="product.inStock ? 'default' : 'secondary'"
            >
              <Icon name="lucide:shopping-cart" class="h-4 w-4 mr-2" />
              {{ product.inStock ? 'Add to Cart' : 'Sold Out' }}
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Props
defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// Emits
defineEmits(['addToCart', 'wishlist']);

// Utils
const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : '0.00';
};
</script>
