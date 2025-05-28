<template>
  <SidebarProvider>
    <AppSidebar
      :activePage="activePage"
      @update:activePage="activePage = $event"
    />
    <SidebarInset>
      <!-- Header -->
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#"> ShinyFlakes </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{{ getPageTitle() }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <!-- Main Content -->
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <!-- Overview Section -->
        <div v-show="activePage === 'overview'" class="space-y-4">
          <!-- Welcome Section -->
          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h1 class="text-2xl font-bold tracking-tight">
                    Welcome back, {{ authStore.user?.fullName }}! 👋
                  </h1>
                  <p class="text-muted-foreground mt-1">
                    Here's what's happening with your account today.
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <Badge variant="secondary" class="capitalize">
                    <Icon name="lucide:shield-check" class="h-3 w-3 mr-1" />
                    {{ authStore.user?.role }}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Stats Grid -->
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle class="text-sm font-medium">Cart Items</CardTitle>
                <Icon
                  name="lucide:shopping-cart"
                  class="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{{ stats.cartItems }}</div>
                <p class="text-xs text-muted-foreground">
                  {{
                    stats.cartItems > 0 ? 'Ready to checkout' : 'Start shopping'
                  }}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle class="text-sm font-medium">Cart Total</CardTitle>
                <Icon
                  name="lucide:credit-card"
                  class="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  ${{ stats.cartTotal.toFixed(2) }}
                </div>
                <p class="text-xs text-muted-foreground">
                  +$12.34 from last session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle class="text-sm font-medium">Total Orders</CardTitle>
                <Icon
                  name="lucide:package"
                  class="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{{ stats.totalOrders }}</div>
                <p class="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle class="text-sm font-medium">Favorites</CardTitle>
                <Icon
                  name="lucide:heart"
                  class="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{{ stats.favorites }}</div>
                <p class="text-xs text-muted-foreground">+1 this week</p>
              </CardContent>
            </Card>
          </div>

          <!-- Content Grid -->
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <!-- Chart Area -->
            <Card class="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>
                  Your shopping activity over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent class="pl-2">
                <div
                  class="h-[300px] flex items-center justify-center border border-dashed rounded-lg"
                >
                  <div class="text-center">
                    <Icon
                      name="lucide:bar-chart-3"
                      class="h-8 w-8 text-muted-foreground mx-auto mb-2"
                    />
                    <p class="text-sm text-muted-foreground">
                      Chart will be displayed here
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      Connect with real data for visualization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Recent Activity -->
            <Card class="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    class="flex items-center space-x-4"
                  >
                    <div
                      class="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
                    >
                      <Icon :name="activity.icon" class="h-4 w-4" />
                    </div>
                    <div class="space-y-1 flex-1">
                      <p class="text-sm font-medium leading-none">
                        {{ activity.title }}
                      </p>
                      <p class="text-sm text-muted-foreground">
                        {{ activity.description }}
                      </p>
                    </div>
                    <div class="text-xs text-muted-foreground">
                      {{ activity.time }}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Orders Section -->
        <div v-show="activePage === 'orders'" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription> Manage and track your orders </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="text-center py-12">
                <Icon
                  name="lucide:package"
                  class="h-12 w-12 text-muted-foreground mx-auto mb-4"
                />
                <h3 class="text-lg font-semibold">No orders yet</h3>
                <p class="text-muted-foreground mb-4">
                  Start shopping to see your orders here
                </p>
                <Button asChild>
                  <NuxtLink to="/products">
                    <Icon name="lucide:shopping-bag" class="h-4 w-4 mr-2" />
                    Browse Products
                  </NuxtLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Products Section -->
        <div v-show="activePage === 'products'" class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold tracking-tight">
                Featured Products
              </h2>
              <p class="text-muted-foreground">
                Discover our most popular items
              </p>
            </div>
            <Button asChild variant="outline">
              <NuxtLink to="/products">
                View All Products
                <Icon name="lucide:arrow-right" class="h-4 w-4 ml-2" />
              </NuxtLink>
            </Button>
          </div>

          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="product in featuredProducts"
              :key="product.id"
              class="overflow-hidden"
            >
              <div class="aspect-video overflow-hidden">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader class="pb-3">
                <CardTitle class="line-clamp-1">{{ product.name }}</CardTitle>
                <CardDescription class="line-clamp-2">
                  {{ product.description }}
                </CardDescription>
              </CardHeader>
              <CardContent class="pt-0">
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold">${{ product.price }}</span>
                  <Button size="sm">
                    <Icon name="lucide:plus" class="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Analytics Section -->
        <div v-show="activePage === 'analytics'" class="space-y-4">
          <div>
            <h2 class="text-2xl font-bold tracking-tight">Analytics</h2>
            <p class="text-muted-foreground">
              Insights into your shopping patterns and preferences
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Categories</CardTitle>
                <CardDescription>
                  Breakdown of your purchases by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  class="h-[300px] flex items-center justify-center border border-dashed rounded-lg"
                >
                  <div class="text-center">
                    <Icon
                      name="lucide:pie-chart"
                      class="h-8 w-8 text-muted-foreground mx-auto mb-2"
                    />
                    <p class="text-sm text-muted-foreground">
                      Category chart will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>
                  Your spending patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  class="h-[300px] flex items-center justify-center border border-dashed rounded-lg"
                >
                  <div class="text-center">
                    <Icon
                      name="lucide:trending-up"
                      class="h-8 w-8 text-muted-foreground mx-auto mb-2"
                    />
                    <p class="text-sm text-muted-foreground">
                      Trend chart will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Settings Section -->
        <div v-show="activePage === 'settings'" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and information
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="space-y-2">
                <Label for="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  v-model="settingsForm.fullName"
                  placeholder="Enter your full name"
                />
              </div>

              <div class="space-y-2">
                <Label for="email">Email Address</Label>
                <Input
                  id="email"
                  :value="authStore.user?.email"
                  disabled
                  class="bg-muted"
                />
                <p class="text-xs text-muted-foreground">
                  Email cannot be changed for security reasons
                </p>
              </div>

              <div class="space-y-2">
                <Label>Account Type</Label>
                <div class="flex items-center space-x-2">
                  <Badge variant="secondary" class="capitalize">
                    <Icon name="lucide:shield-check" class="h-3 w-3 mr-1" />
                    {{ authStore.user?.role }}
                  </Badge>
                </div>
              </div>

              <div class="space-y-2">
                <Label>Member Since</Label>
                <p class="text-sm text-muted-foreground">
                  {{ formatMemberSince(authStore.user?.createdAt) }}
                </p>
              </div>

              <Separator />

              <div class="flex items-center justify-between pt-4">
                <Button
                  @click="saveSettings"
                  :disabled="isLoading"
                  class="w-auto"
                >
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </Button>

                <Button
                  @click="handleLogout"
                  variant="outline"
                  class="text-red-600 hover:text-red-700"
                >
                  <Icon name="lucide:log-out" class="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppSidebar from '@/components/AppSidebar.vue';

// Page meta
definePageMeta({
  middleware: 'auth',
});

// SEO
useSeoMeta({
  title: 'Dashboard | ShinyFlakes',
  description: 'Your ShinyFlakes dashboard',
});

// Stores
const authStore = useAuthStore();
const router = useRouter();

// State
const activePage = ref('overview');
const isLoading = ref(false);

const settingsForm = reactive({
  fullName: '',
});

// Mock data
const stats = reactive({
  cartItems: 3,
  cartTotal: 89.97,
  totalOrders: 12,
  favorites: 8,
});

const recentActivity = ref([
  {
    id: 1,
    title: 'Account Created',
    description: 'Welcome to ShinyFlakes!',
    time: '2m ago',
    icon: 'lucide:user-plus',
  },
  {
    id: 2,
    title: 'Profile Updated',
    description: 'Account information changed',
    time: '1h ago',
    icon: 'lucide:settings',
  },
  {
    id: 3,
    title: 'Login Activity',
    description: 'Signed in successfully',
    time: '2h ago',
    icon: 'lucide:log-in',
  },
]);

const featuredProducts = ref([
  {
    id: 1,
    name: 'Premium Crystal Collection',
    description:
      'High-quality crystal formations perfect for collectors and enthusiasts',
    price: '29.99',
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'Blue Magic Crystals',
    description:
      'Rare blue crystals with unique optical properties and stunning clarity',
    price: '39.99',
    image:
      'https://images.unsplash.com/photo-1509814179829-b6d76da04862?w=400&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'Crystal Clear Formation',
    description:
      'Pure transparent crystal specimens with perfect geometric structure',
    price: '24.99',
    image:
      'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=200&fit=crop',
  },
]);

// Computed
const getPageTitle = () => {
  const pages = {
    overview: 'Overview',
    orders: 'Orders',
    products: 'Products',
    analytics: 'Analytics',
    settings: 'Settings',
  };
  return pages[activePage.value] || 'Dashboard';
};

// Methods
const formatMemberSince = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const saveSettings = async () => {
  isLoading.value = true;
  try {
    await authStore.updateProfile?.(settingsForm);
    console.log('Settings saved successfully');
    // You could add a toast notification here
  } catch (error) {
    console.error('Failed to save settings:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    await router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Initialize
onMounted(() => {
  settingsForm.fullName = authStore.user?.fullName || '';
});
</script>
