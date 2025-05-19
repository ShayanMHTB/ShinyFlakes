export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Initialize auth if not already done
  if (!authStore.isInitialized) {
    authStore.initAuth();
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Store the intended destination
    const redirectPath = to.fullPath !== '/dashboard' ? to.fullPath : undefined;

    return navigateTo({
      path: '/auth/login',
      query: redirectPath ? { redirect: redirectPath } : undefined,
    });
  }
});
