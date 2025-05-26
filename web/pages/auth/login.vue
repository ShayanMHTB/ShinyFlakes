<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h2 class="text-2xl font-bold tracking-tight">Welcome back</h2>
      <p class="text-muted-foreground">Sign in to your account</p>
    </div>

    <!-- Login Form -->
    <form class="space-y-4" @submit.prevent="handleLogin">
      <!-- Email Field -->
      <div class="space-y-2">
        <Label for="email">Email address</Label>
        <Input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="heisenberg@example.com"
          required
          :class="errors.email ? 'border-destructive' : ''"
        />
        <p v-if="errors.email" class="text-sm text-destructive">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Field -->
      <div class="space-y-2">
        <Label for="password">Password</Label>
        <div class="relative">
          <Input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Your password"
            required
            class="pr-10"
            :class="errors.password ? 'border-destructive' : ''"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            @click="showPassword = !showPassword"
          >
            <Icon
              :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
              class="h-4 w-4 text-muted-foreground"
            />
          </Button>
        </div>
        <p v-if="errors.password" class="text-sm text-destructive">
          {{ errors.password }}
        </p>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Checkbox id="remember" v-model:checked="form.remember" />
          <Label
            for="remember"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </Label>
        </div>
        <Button variant="link" class="h-auto p-0 text-sm">
          Forgot password?
        </Button>
      </div>

      <!-- Error Alert -->
      <Alert v-if="errors.general" variant="destructive">
        <Icon name="lucide:alert-circle" class="h-4 w-4" />
        <AlertDescription>{{ errors.general }}</AlertDescription>
      </Alert>

      <!-- Submit Button -->
      <Button type="submit" :disabled="loading" class="w-full">
        <Icon
          v-if="loading"
          name="lucide:loader-2"
          class="mr-2 h-4 w-4 animate-spin"
        />
        <Icon v-else name="lucide:log-in" class="mr-2 h-4 w-4" />
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </Button>
    </form>

    <!-- Demo Credentials -->
    <Alert>
      <Icon name="lucide:info" class="h-4 w-4" />
      <AlertTitle>Demo Credentials</AlertTitle>
      <AlertDescription class="space-y-2">
        <div class="text-sm space-y-1">
          <p><strong>Email:</strong> walter@breakingbad.com</p>
          <p><strong>Password:</strong> saymyname123</p>
        </div>
        <Button variant="outline" size="sm" @click="fillDemoCredentials">
          Fill demo credentials
        </Button>
      </AlertDescription>
    </Alert>

    <!-- Register Link -->
    <div class="text-center">
      <p class="text-sm text-muted-foreground">
        Don't have an account?
        <Button variant="link" class="h-auto p-0" asChild>
          <NuxtLink to="/auth/register">Sign up</NuxtLink>
        </Button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Page meta
definePageMeta({
  layout: 'auth',
});

// SEO
useSeoMeta({
  title: 'Login | ShinyFlakes',
  description: 'Sign in to your ShinyFlakes account',
});

// Reactive state
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
  remember: false,
});

const errors = reactive({
  email: '',
  password: '',
  general: '',
});

const loading = ref(false);
const showPassword = ref(false);

// Methods
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => (errors[key] = ''));

  let isValid = true;

  if (!form.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errors.general = '';

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      remember: form.remember,
    });

    // Redirect to dashboard or intended page
    const redirect = router.currentRoute.value.query.redirect || '/dashboard';
    await router.push(redirect);
  } catch (error) {
    console.error('Login error:', error);
    errors.general = 'Invalid email or password. Please try again.';
  } finally {
    loading.value = false;
  }
};

const fillDemoCredentials = () => {
  form.email = 'walter@breakingbad.com';
  form.password = 'saymyname123';
};

// Redirect if already logged in
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard');
  }
});
</script>
