<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background">
      <div class="container px-4 py-24 mx-auto">
        <div class="text-center space-y-8">
          <!-- Hero Title -->
          <div class="space-y-4">
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight">
              <span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ✨ ShinyFlakes
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Welcome to the parody e-commerce inspired by "How to Sell Drugs Online (Fast)"
            </p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              :disabled="apiLoading"
              class="min-w-[200px]"
              @click="testConnection"
            >
              <Icon v-if="apiLoading" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
              <Icon v-else name="lucide:zap" class="mr-2 h-4 w-4" />
              {{ apiLoading ? 'Testing...' : 'Test API Connection' }}
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <NuxtLink to="/products">
                <Icon name="lucide:shopping-bag" class="mr-2 h-4 w-4" />
                Browse Products
              </NuxtLink>
            </Button>

            <Button size="lg" variant="secondary" asChild>
              <NuxtLink to="/auth/login">
                <Icon name="lucide:log-in" class="mr-2 h-4 w-4" />
                Login
              </NuxtLink>
            </Button>
          </div>

          <!-- API Status -->
          <div v-if="apiStatus" class="max-w-md mx-auto">
            <Alert :variant="apiStatus.success ? 'default' : 'destructive'">
              <Icon 
                :name="apiStatus.success ? 'lucide:check-circle' : 'lucide:x-circle'" 
                class="h-4 w-4" 
              />
              <AlertDescription>{{ apiStatus.message }}</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section v-if="featuredProducts.length > 0" class="py-24 bg-muted/30">
      <div class="container px-4 mx-auto">
        <div class="text-center space-y-4 mb-12">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">Featured Products</h2>
          <p class="text-xl text-muted-foreground">Discover our most popular items</p>
        </div>
        
        <!-- Loading state for featured products -->
        <div v-if="productsStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div v-for="i in 6" :key="i" class="space-y-4">
            <Skeleton class="aspect-square w-full" />
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
          </div>
        </div>

        <!-- Featured Products Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product"
            @add-to-cart="handleAddToCart"
            @wishlist="handleWishlist"
            @quick-view="handleQuickView"
          />
        </div>
        
        <div class="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <NuxtLink to="/products">
              View All Products
              <Icon name="lucide:arrow-right" class="ml-2 h-4 w-4" />
            </NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24">
      <div class="container px-4 mx-auto">
        <div class="text-center space-y-4 mb-16">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">Why Choose ShinyFlakes?</h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the parody e-commerce with premium features and quality service
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card class="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent class="space-y-4">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="lucide:shield-check" class="h-6 w-6 text-primary" />
              </div>
              <h3 class="text-xl font-semibold">99.1% Pure Quality</h3>
              <p class="text-muted-foreground">
                Premium products with unmatched quality standards, just like Heisenberg's standards.
              </p>
            </CardContent>
          </Card>
          
          <Card class="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent class="space-y-4">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="lucide:zap" class="h-6 w-6 text-primary" />
              </div>
              <h3 class="text-xl font-semibold">Lightning Fast</h3>
              <p class="text-muted-foreground">
                Quick delivery and processing, because time is money in this business.
              </p>
            </CardContent>
          </Card>
          
          <Card class="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent class="space-y-4">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="lucide:lock" class="h-6 w-6 text-primary" />
              </div>
              <h3 class="text-xl font-semibold">Secure & Discreet</h3>
              <p class="text-muted-foreground">
                Your privacy and security are our top priorities. No DEA involved.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-muted/30">
      <div class="container px-4 mx-auto">
        <div class="max-w-4xl mx-auto text-center">
          <Card class="p-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent class="space-y-8">
              <div class="space-y-4">
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
                  Ready to Start Your Empire?
                </h2>
                <p class="text-xl text-muted-foreground leading-relaxed">
                  Join thousands of satisfied customers who trust ShinyFlakes for their premium product needs.
                  Quality guaranteed, satisfaction promised.
                </p>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <NuxtLink to="/products">
                    <Icon name="lucide:shopping-bag" class="mr-2 h-5 w-5" />
                    Shop Now
                  </NuxtLink>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <NuxtLink to="/about">
                    <Icon name="lucide:info" class="mr-2 h-5 w-5" />
                    Learn More
                  </NuxtLink>
                </Button>
              </div>

              <!-- Trust Indicators -->
              <div class="flex justify-center space-x-8 pt-8 opacity-60">
                <div class="text-center">
                  <Icon name="lucide:shield" class="h-8 w-8 mx-auto mb-2" />
                  <div class="text-sm">Secure</div>
                </div>
                <div class="text-center">
                  <Icon name="lucide:truck" class="h-8 w-8 mx-auto mb-2" />
                  <div class="text-sm">Fast Delivery</div>
                </div>
                <div class="text-center">
                  <Icon name="lucide:award" class="h-8 w-8 mx-auto mb-2" />
                  <div class="text-sm">Quality</div>
                </div>
                <div class="text-center">
                  <Icon name="lucide:headphones" class="h-8 w-8 mx-auto mb-2" />
                  <div class="text-sm">24/7 Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Success Toast -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <Alert class="border-green-500 bg-green-50 dark:bg-green-950">
        <Icon name="lucide:check-circle" class="h-4 w-4 text-green-600" />
        <AlertTitle class="text-green-800 dark:text-green-200">Success!</AlertTitle>
        <AlertDescription class="text-green-700 dark:text-green-300">
          {{ toastMessage }}
        </AlertDescription>
      </Alert>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/components/ProductCard.vue'

// Page meta
definePageMeta({
  layout: 'default'
})

// SEO
useSeoMeta({
  title: 'ShinyFlakes | Premium Marketplace',
  description: 'Welcome to ShinyFlakes - A parody e-commerce inspired by "How to Sell Drugs Online (Fast)"'
})

// Stores
const productsStore = useProductsStore()
const cartStore = useCartStore()

// State
const apiLoading = ref(false)
const apiStatus = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

// API instance
const api = useApi()

// Computed
const featuredProducts = computed(() => {
  return productsStore.getFeaturedProducts(6)
})

// Methods
const testConnection = async () => {
  apiLoading.value = true
  apiStatus.value = null
  
  try {
    // Test health endpoint
    const healthResponse = await api.health()
    apiStatus.value = {
      success: true,
      message: `✅ Connected to ${healthResponse.service} - ${healthResponse.status}`
    }

    // Load products if not already loaded
    if (!productsStore.hasProducts) {
      await productsStore.init()
    }
    
  } catch (error) {
    apiStatus.value = {
      success: false,
      message: `❌ Connection failed: ${error.message}`
    }
  } finally {
    apiLoading.value = false
  }
}

const handleAddToCart = (product) => {
  cartStore.addItem(product)
  showToastMessage(`${product.name} added to cart!`)
}

const handleWishlist = (productId) => {
  // TODO: Implement wishlist functionality
  console.log('Add to wishlist:', productId)
  showToastMessage('Added to wishlist!')
}

const handleQuickView = (productId) => {
  // Navigate to product detail page for now
  navigateTo(`/products/${productId}`)
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Initialize
onMounted(async () => {
  // Load featured products on page load
  if (!productsStore.hasProducts) {
    await productsStore.init()
  }
})
</script>
