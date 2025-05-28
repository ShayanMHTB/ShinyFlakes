<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8 text-center md:text-left">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Shopping Cart
      </h1>
      <p class="text-muted-foreground">Review your items before checkout</p>
    </div>

    <!-- Empty Cart -->
    <div v-if="cartStore.isEmpty" class="text-center py-16">
      <div
        class="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Icon
          name="lucide:shopping-cart"
          class="h-12 w-12 text-muted-foreground"
        />
      </div>
      <h3 class="text-2xl font-bold mb-2">Your cart is empty</h3>
      <p class="text-muted-foreground mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Start shopping
        to discover amazing products!
      </p>
      <Button size="lg" asChild>
        <NuxtLink to="/products">
          <Icon name="lucide:shopping-bag" class="mr-2 h-5 w-5" />
          Start Shopping
        </NuxtLink>
      </Button>
    </div>

    <!-- Cart with Items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center justify-between">
              <span>Cart Items</span>
              <Badge variant="secondary">{{ cartStore.itemCount }} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent class="p-0">
            <Separator />
            <div class="divide-y">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="p-6 flex items-center space-x-4"
              >
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <div
                    class="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden"
                  >
                    <NuxtImg
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                    <Icon
                      v-else
                      name="lucide:image"
                      class="h-8 w-8 text-muted-foreground"
                    />
                  </div>
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0 space-y-1">
                  <h3 class="font-semibold text-lg">
                    <Button
                      variant="link"
                      class="h-auto p-0 text-left font-semibold"
                      asChild
                    >
                      <NuxtLink :to="`/products/${item.slug}`">
                        {{ item.name }}
                      </NuxtLink>
                    </Button>
                  </h3>
                  <Badge variant="outline" class="text-xs">{{
                    item.category
                  }}</Badge>
                  <p class="text-lg font-bold">${{ item.price.toFixed(2) }}</p>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center">
                  <div class="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      :disabled="item.quantity <= 1"
                      @click="decreaseQuantity(item.id, item.quantity)"
                      class="h-10 w-10 rounded-r-none"
                    >
                      <Icon name="lucide:minus" class="h-4 w-4" />
                    </Button>
                    <div class="px-4 py-2 min-w-[3rem] text-center font-medium">
                      {{ item.quantity }}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      :disabled="item.quantity >= item.maxStock"
                      @click="increaseQuantity(item.id, item.quantity)"
                      class="h-10 w-10 rounded-l-none"
                    >
                      <Icon name="lucide:plus" class="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <!-- Item Total & Remove -->
                <div class="text-right space-y-2">
                  <p class="text-lg font-bold">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="removeFromCart(item.id)"
                    class="text-destructive hover:text-destructive"
                  >
                    <Icon name="lucide:trash-2" class="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6"
        >
          <Button variant="outline" asChild>
            <NuxtLink to="/products">
              <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
              Continue Shopping
            </NuxtLink>
          </Button>

          <Button
            variant="outline"
            @click="clearCart"
            class="text-destructive hover:text-destructive"
          >
            <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <Card class="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-muted-foreground"
                  >Subtotal ({{ cartStore.itemCount }} items)</span
                >
                <span class="font-medium"
                  >${{ cartStore.totalPrice.toFixed(2) }}</span
                >
              </div>

              <div class="flex justify-between">
                <span class="text-muted-foreground">Shipping</span>
                <span class="font-medium">$9.99</span>
              </div>

              <div class="flex justify-between">
                <span class="text-muted-foreground">Tax</span>
                <span class="font-medium"
                  >${{ (cartStore.totalPrice * 0.08).toFixed(2) }}</span
                >
              </div>

              <Separator />

              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="text-primary">
                  ${{
                    (
                      cartStore.totalPrice +
                      9.99 +
                      cartStore.totalPrice * 0.08
                    ).toFixed(2)
                  }}
                </span>
              </div>
            </div>

            <div class="space-y-3 pt-4">
              <Button size="lg" class="w-full" @click="proceedToCheckout">
                <Icon name="lucide:credit-card" class="mr-2 h-5 w-5" />
                Proceed to Checkout
              </Button>

              <Button size="lg" variant="outline" class="w-full">
                <Icon name="lucide:shield-check" class="mr-2 h-5 w-5" />
                Secure Checkout
              </Button>
            </div>

            <!-- Security Info -->
            <Alert class="mt-6">
              <Icon name="lucide:lock" class="h-4 w-4 text-green-600" />
              <AlertDescription class="text-sm">
                Your information is secure and encrypted with 256-bit SSL
                protection
              </AlertDescription>
            </Alert>

            <!-- Trust Badges -->
            <div class="flex justify-center space-x-4 pt-4 opacity-60">
              <div class="text-xs text-center">
                <Icon name="lucide:shield" class="h-6 w-6 mx-auto mb-1" />
                <div>SSL Secure</div>
              </div>
              <div class="text-xs text-center">
                <Icon name="lucide:truck" class="h-6 w-6 mx-auto mb-1" />
                <div>Fast Delivery</div>
              </div>
              <div class="text-xs text-center">
                <Icon
                  name="lucide:heart-handshake"
                  class="h-6 w-6 mx-auto mb-1"
                />
                <div>Support</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Page meta
definePageMeta({
  layout: 'default',
});

// SEO
useSeoMeta({
  title: 'Shopping Cart | ShinyFlakes',
  description: 'Review your cart items before checkout',
});

// Get cart store
const cartStore = useCartStore();

// Methods
const increaseQuantity = (itemId, currentQuantity) => {
  cartStore.updateQuantity(itemId, currentQuantity + 1);
};

const decreaseQuantity = (itemId, currentQuantity) => {
  cartStore.updateQuantity(itemId, currentQuantity - 1);
};

const removeFromCart = (itemId) => {
  cartStore.removeItem(itemId);
};

const clearCart = () => {
  // Using a more sophisticated confirmation
  if (
    confirm(
      'Are you sure you want to clear your entire cart? This action cannot be undone.',
    )
  ) {
    cartStore.clearCart();
  }
};

const proceedToCheckout = () => {
  // TODO: Implement checkout
  console.log('Proceeding to checkout...');
  navigateTo('/checkout');
};
</script>
