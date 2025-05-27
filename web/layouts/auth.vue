<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4"
  >
    <div class="w-full max-w-md space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <Button variant="ghost" asChild class="mb-4">
          <NuxtLink to="/" class="flex items-center justify-center space-x-2">
            <Icon name="lucide:sparkles" class="h-10 w-10 text-primary" />
            <span class="text-3xl font-bold">ShinyFlakes</span>
          </NuxtLink>
        </Button>
        <p class="text-muted-foreground">Your premium marketplace</p>
      </div>

      <!-- Auth Content Card -->
      <Card class="border-0 shadow-2xl">
        <CardContent class="p-8">
          <slot />
        </CardContent>
      </Card>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-sm text-muted-foreground">
          By continuing, you agree to our
          <Button variant="link" class="h-auto p-0 text-sm">
            Terms of Service
          </Button>
          and
          <Button variant="link" class="h-auto p-0 text-sm">
            Privacy Policy
          </Button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
</script>
