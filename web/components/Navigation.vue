<template>
  <nav class="flex items-center space-x-1">
    <Button
      v-for="item in navigationItems"
      :key="item.to"
      variant="ghost"
      asChild
      :class="isActiveRoute(item.to) ? 'bg-muted' : ''"
    >
      <NuxtLink :to="item.to" class="flex items-center space-x-2">
        <Icon :name="item.icon" class="h-4 w-4" />
        <span class="hidden md:block">{{ item.label }}</span>
      </NuxtLink>
    </Button>
  </nav>
</template>

<script setup>
import { Button } from '@/components/ui/button';

const route = useRoute();

const navigationItems = [
  {
    to: '/',
    label: 'Home',
    icon: 'lucide:home',
  },
  {
    to: '/about',
    label: 'About',
    icon: 'lucide:info',
  },
  {
    to: '/products',
    label: 'Products',
    icon: 'lucide:shopping-bag',
  },
  {
    to: '/contact',
    label: 'Contact',
    icon: 'lucide:mail',
  },
];

const isActiveRoute = (path) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path));
};
</script>
