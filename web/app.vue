<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script>
export default {
  setup() {
    // Initialize stores on app start
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()
    const productsStore = useProductsStore()

    onMounted(() => {
      // Initialize authentication
      authStore.initAuth()
      authStore.checkAuth()

      // Initialize cart from localStorage
      cartStore.initCart()

      // Initialize wishlist from localStorage
      wishlistStore.initWishlist()

      // Initialize products
      productsStore.fetchCategories()
    })

    return {}
  },
}
</script>
