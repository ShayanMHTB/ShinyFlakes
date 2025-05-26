<template>
  <Sidebar variant="inset">
    <!-- Header -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <NuxtLink to="/" class="font-semibold">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-sidebar-primary-foreground"
              >
                <Icon name="lucide:sparkles" class="size-4 text-white" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">ShinyFlakes</span>
                <span class="truncate text-xs">Premium Store</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- Main Navigation -->
    <SidebarContent>
      <!-- Main Menu -->
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in mainNavItems" :key="item.title">
            <SidebarMenuButton
              @click="setActivePage(item.page)"
              :isActive="props.activePage === item.page"
              :tooltip="item.title"
            >
              <Icon :name="item.icon" />
              <span>{{ item.title }}</span>
              <SidebarMenuBadge v-if="item.badge">{{
                item.badge
              }}</SidebarMenuBadge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <!-- Shopping Menu -->
      <SidebarGroup>
        <SidebarGroupLabel>Shopping</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in shoppingNavItems" :key="item.title">
            <SidebarMenuButton asChild>
              <NuxtLink :to="item.url">
                <Icon :name="item.icon" />
                <span>{{ item.title }}</span>
                <SidebarMenuBadge v-if="item.badge">{{
                  item.badge
                }}</SidebarMenuBadge>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <!-- Quick Actions -->
      <SidebarGroup class="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NuxtLink to="/products" class="w-full">
                <Icon name="lucide:search" />
                <span>Browse Products</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NuxtLink to="/cart" class="w-full">
                <Icon name="lucide:shopping-cart" />
                <span>View Cart</span>
                <SidebarMenuBadge>{{ cartItemCount }}</SidebarMenuBadge>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div
                  class="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-sidebar-primary-foreground"
                >
                  <span class="text-white font-semibold text-sm">{{
                    getUserInitials()
                  }}</span>
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{
                    authStore.user?.fullName
                  }}</span>
                  <span class="truncate text-xs">{{
                    authStore.user?.email
                  }}</span>
                </div>
                <Icon name="lucide:chevron-up" class="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset="4"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div
                  class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                >
                  <div
                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-sidebar-primary-foreground"
                  >
                    <span class="text-white font-semibold text-sm">{{
                      getUserInitials()
                    }}</span>
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{
                      authStore.user?.fullName
                    }}</span>
                    <span class="truncate text-xs">{{
                      authStore.user?.email
                    }}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem @click="setActivePage('settings')">
                  <Icon name="lucide:settings" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NuxtLink to="/profile">
                    <Icon name="lucide:user" />
                    Profile
                  </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NuxtLink to="/orders">
                    <Icon name="lucide:package" />
                    My Orders
                  </NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout" class="text-red-600">
                <Icon name="lucide:log-out" />
                {{ authStore.isLoading ? 'Logging out...' : 'Log out' }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup>
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Props
const props = defineProps({
  activePage: {
    type: String,
    default: 'overview',
  },
});

// Emits
const emit = defineEmits(['update:activePage']);

// Stores
const authStore = useAuthStore();
const router = useRouter();

// Mock cart count (replace with real cart store)
const cartItemCount = ref(3);

// Methods
const setActivePage = (page) => {
  emit('update:activePage', page);
};

// Navigation items
const mainNavItems = computed(() => [
  {
    title: 'Overview',
    page: 'overview',
    icon: 'lucide:layout-dashboard',
  },
  {
    title: 'Orders',
    page: 'orders',
    icon: 'lucide:package',
    badge: 12,
  },
  {
    title: 'Products',
    page: 'products',
    icon: 'lucide:shopping-bag',
  },
  {
    title: 'Analytics',
    page: 'analytics',
    icon: 'lucide:bar-chart-3',
  },
  {
    title: 'Settings',
    page: 'settings',
    icon: 'lucide:settings',
  },
]);

const shoppingNavItems = computed(() => [
  {
    title: 'Browse Products',
    url: '/products',
    icon: 'lucide:search',
  },
  {
    title: 'Shopping Cart',
    url: '/cart',
    icon: 'lucide:shopping-cart',
    badge: cartItemCount.value,
  },
  {
    title: 'Wishlist',
    url: '/wishlist',
    icon: 'lucide:heart',
    badge: 5,
  },
  {
    title: 'Categories',
    url: '/categories',
    icon: 'lucide:grid-3x3',
  },
]);

// Methods
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

// Watch for page changes and update local state
// No longer needed since we're using props
</script>
