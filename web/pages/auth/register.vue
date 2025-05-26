<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h2 class="text-2xl font-bold tracking-tight">Create account</h2>
      <p class="text-muted-foreground">Join the ShinyFlakes community</p>
    </div>

    <!-- Register Form -->
    <form class="space-y-4" @submit.prevent="handleRegister">
      <!-- Name Field -->
      <div class="space-y-2">
        <Label for="name">Full name</Label>
        <Input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Walter White"
          required
          :class="errors.name ? 'border-destructive' : ''"
        />
        <p v-if="errors.name" class="text-sm text-destructive">
          {{ errors.name }}
        </p>
      </div>

      <!-- Email Field -->
      <div class="space-y-2">
        <Label for="email">Email address</Label>
        <Input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="walter@example.com"
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
            placeholder="Choose a strong password"
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

        <!-- Password Strength Indicator -->
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <div class="flex-1 bg-muted rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-300"
                :class="passwordStrengthClass"
                :style="{ width: passwordStrengthWidth }"
              ></div>
            </div>
            <span class="text-xs text-muted-foreground min-w-fit">
              {{ passwordStrengthText }}
            </span>
          </div>
        </div>
      </div>

      <!-- Confirm Password Field -->
      <div class="space-y-2">
        <Label for="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          :class="errors.confirmPassword ? 'border-destructive' : ''"
        />
        <p v-if="errors.confirmPassword" class="text-sm text-destructive">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Terms Agreement -->
      <div class="space-y-2">
        <div class="flex items-start space-x-2">
          <Checkbox
            id="terms"
            v-model:checked="form.agreedToTerms"
            required
            :class="errors.terms ? 'border-destructive' : ''"
          />
          <Label for="terms" class="text-sm leading-relaxed">
            I agree to the
            <Button variant="link" class="h-auto p-0 text-sm underline">
              Terms of Service
            </Button>
            and
            <Button variant="link" class="h-auto p-0 text-sm underline">
              Privacy Policy
            </Button>
          </Label>
        </div>
        <p v-if="errors.terms" class="text-sm text-destructive ml-6">
          {{ errors.terms }}
        </p>
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
        <Icon v-else name="lucide:user-plus" class="mr-2 h-4 w-4" />
        {{ loading ? 'Creating account...' : 'Create account' }}
      </Button>
    </form>

    <!-- Login Link -->
    <div class="text-center">
      <p class="text-sm text-muted-foreground">
        Already have an account?
        <Button variant="link" class="h-auto p-0" asChild>
          <NuxtLink to="/auth/login">Sign in</NuxtLink>
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
import { Alert, AlertDescription } from '@/components/ui/alert';

// Page meta
definePageMeta({
  layout: 'auth',
});

// SEO
useSeoMeta({
  title: 'Register | ShinyFlakes',
  description: 'Create your ShinyFlakes account',
});

// Reactive state
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
  general: '',
});

const loading = ref(false);
const showPassword = ref(false);

// Password strength computation
const passwordStrength = computed(() => {
  const password = form.password;
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'bg-destructive';
  if (strength <= 2) return 'bg-orange-500';
  if (strength <= 3) return 'bg-yellow-500';
  if (strength <= 4) return 'bg-blue-500';
  return 'bg-green-500';
});

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 5) * 100}%`;
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'Weak';
  if (strength <= 2) return 'Fair';
  if (strength <= 3) return 'Good';
  if (strength <= 4) return 'Strong';
  return 'Very Strong';
});

// Methods
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => (errors[key] = ''));

  let isValid = true;

  if (!form.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  }

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

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  if (!form.agreedToTerms) {
    errors.terms = 'You must agree to the terms and conditions';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errors.general = '';

  try {
    await authStore.register({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
    });

    // Redirect to dashboard
    await router.push('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    errors.general = 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Redirect if already logged in
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard');
  }
});
</script>
