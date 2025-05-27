<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation Header -->
    <header
      class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="container flex h-16 items-center justify-between px-4">
        <!-- Logo -->
        <Button variant="ghost" asChild>
          <NuxtLink to="/" class="flex items-center space-x-2">
            <Icon name="lucide:sparkles" class="h-6 w-6 text-primary" />
            <span class="text-xl font-bold">ShinyFlakes</span>
          </NuxtLink>
        </Button>

        <!-- Main Navigation -->
        <nav class="hidden md:flex items-center space-x-1">
          <Button variant="ghost" asChild>
            <NuxtLink to="/">Home</NuxtLink>
          </Button>
          <Button variant="ghost" asChild>
            <NuxtLink to="/about">About</NuxtLink>
          </Button>
          <Button variant="ghost" asChild>
            <NuxtLink to="/products">Products</NuxtLink>
          </Button>
          <Button variant="ghost" asChild>
            <NuxtLink to="/contact">Contact</NuxtLink>
          </Button>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center space-x-2">
          <!-- Theme Toggle -->
          <Button variant="ghost" size="icon" @click="toggleTheme">
            <Icon
              name="lucide:sun"
              class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Icon
              name="lucide:moon"
              class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>

          <!-- Wishlist -->
          <Button variant="ghost" size="icon" asChild class="relative">
            <NuxtLink to="/wishlist">
              <Icon name="lucide:heart" class="h-4 w-4" />
              <Badge
                v-if="wishlistStore.itemCount > 0"
                variant="secondary"
                class="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {{ wishlistStore.itemCount }}
              </Badge>
            </NuxtLink>
          </Button>

          <!-- Cart -->
          <Button variant="ghost" size="icon" asChild class="relative">
            <NuxtLink to="/cart">
              <Icon name="lucide:shopping-cart" class="h-4 w-4" />
              <Badge
                v-if="cartStore.itemCount > 0"
                variant="destructive"
                class="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {{ cartStore.itemCount }}
              </Badge>
            </NuxtLink>
          </Button>

          <!-- Auth Section -->
          <div class="flex items-center space-x-2 ml-2">
            <!-- Authenticated User -->
            <template v-if="authStore.isAuthenticated">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" class="flex items-center space-x-2">
                    <Avatar class="h-8 w-8">
                      <AvatarFallback
                        class="bg-primary text-primary-foreground"
                      >
                        {{ getUserInitials() }}
                      </AvatarFallback>
                    </Avatar>
                    <span class="hidden md:block">{{
                      authStore.user?.fullName
                    }}</span>
                    <Icon name="lucide:chevron-down" class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NuxtLink to="/dashboard">
                      <Icon
                        name="lucide:layout-dashboard"
                        class="mr-2 h-4 w-4"
                      />
                      Dashboard
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NuxtLink to="/profile">
                      <Icon name="lucide:user" class="mr-2 h-4 w-4" />
                      Profile
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NuxtLink to="/orders">
                      <Icon name="lucide:package" class="mr-2 h-4 w-4" />
                      Orders
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="handleLogout"
                    class="text-destructive"
                  >
                    <Icon name="lucide:log-out" class="mr-2 h-4 w-4" />
                    {{ authStore.isLoading ? 'Logging out...' : 'Logout' }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </template>

            <!-- Guest User -->
            <template v-else>
              <Button variant="ghost" size="sm" asChild>
                <NuxtLink to="/auth/login">Login</NuxtLink>
              </Button>
              <Button size="sm" asChild>
                <NuxtLink to="/auth/register">Register</NuxtLink>
              </Button>
            </template>
          </div>

          <!-- Mobile Menu -->
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" class="md:hidden">
                <Icon name="lucide:menu" class="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle class="flex items-center space-x-2">
                  <Icon name="lucide:sparkles" class="h-5 w-5 text-primary" />
                  <span>ShinyFlakes</span>
                </SheetTitle>
              </SheetHeader>
              <div class="mt-6 space-y-2">
                <Button variant="ghost" asChild class="w-full justify-start">
                  <NuxtLink to="/">
                    <Icon name="lucide:home" class="mr-2 h-4 w-4" />
                    Home
                  </NuxtLink>
                </Button>
                <Button variant="ghost" asChild class="w-full justify-start">
                  <NuxtLink to="/about">
                    <Icon name="lucide:info" class="mr-2 h-4 w-4" />
                    About
                  </NuxtLink>
                </Button>
                <Button variant="ghost" asChild class="w-full justify-start">
                  <NuxtLink to="/products">
                    <Icon name="lucide:shopping-bag" class="mr-2 h-4 w-4" />
                    Products
                  </NuxtLink>
                </Button>
                <Button variant="ghost" asChild class="w-full justify-start">
                  <NuxtLink to="/contact">
                    <Icon name="lucide:mail" class="mr-2 h-4 w-4" />
                    Contact
                  </NuxtLink>
                </Button>
                <Button variant="ghost" asChild class="w-full justify-start">
                  <NuxtLink to="/wishlist">
                    <Icon name="lucide:heart" class="mr-2 h-4 w-4" />
                    Wishlist ({{ wishlistStore.itemCount }})
                  </NuxtLink>
                </Button>
                <Button variant="ghost" asChild class="w-full justify-start">
                  <NuxtLink to="/cart">
                    <Icon name="lucide:shopping-cart" class="mr-2 h-4 w-4" />
                    Cart ({{ cartStore.itemCount }})
                  </NuxtLink>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t bg-muted/50">
      <div class="container py-12 px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <Icon name="lucide:sparkles" class="h-6 w-6 text-primary" />
              <span class="text-xl font-bold">ShinyFlakes</span>
            </div>
            <p class="text-muted-foreground">
              A parody e-commerce inspired by "How to Sell Drugs Online (Fast)"
            </p>
            <div class="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Icon name="lucide:github" class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="lucide:twitter" class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h4 class="font-semibold">Quick Links</h4>
            <div class="space-y-2">
              <Button variant="link" class="h-auto p-0 justify-start" asChild>
                <NuxtLink to="/about">About Us</NuxtLink>
              </Button>
              <Button variant="link" class="h-auto p-0 justify-start" asChild>
                <NuxtLink to="/products">Products</NuxtLink>
              </Button>
              <Button variant="link" class="h-auto p-0 justify-start" asChild>
                <NuxtLink to="/contact">Contact</NuxtLink>
              </Button>
            </div>
          </div>

          <!-- Support -->
          <div class="space-y-4">
            <h4 class="font-semibold">Support</h4>
            <div class="space-y-2">
              <Button variant="link" class="h-auto p-0 justify-start">
                Help Center
              </Button>
              <Button variant="link" class="h-auto p-0 justify-start">
                Shipping Info
              </Button>
              <Button variant="link" class="h-auto p-0 justify-start">
                Returns
              </Button>
            </div>
          </div>

          <!-- Legal -->
          <div class="space-y-4">
            <h4 class="font-semibold">Legal</h4>
            <div class="space-y-2">
              <Button variant="link" class="h-auto p-0 justify-start">
                Privacy Policy
              </Button>
              <Button variant="link" class="h-auto p-0 justify-start">
                Terms of Service
              </Button>
              <Button variant="link" class="h-auto p-0 justify-start">
                Disclaimer
              </Button>
            </div>
          </div>
        </div>

        <Separator class="my-8" />

        <div class="text-center space-y-2">
          <p class="text-sm text-muted-foreground">
            &copy; 2025 ShinyFlakes. This is a parody project for educational
            purposes.
          </p>
          <p class="text-xs text-muted-foreground">
            Inspired by "How to Sell Drugs Online (Fast)" - No actual drugs
            involved! 😄
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const router = useRouter();
const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const getUserInitials = () => {
  const name = authStore.user?.fullName || 'User';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    await router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>
