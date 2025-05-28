<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        My Profile
      </h1>
      <p class="text-muted-foreground">
        Manage your account settings and preferences
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Sidebar -->
      <div class="lg:col-span-1">
        <Card>
          <CardContent class="p-6 text-center">
            <!-- Avatar -->
            <div class="relative inline-block mb-4">
              <Avatar class="h-24 w-24">
                <AvatarImage
                  :src="profileForm.avatar"
                  :alt="authStore.user?.fullName"
                />
                <AvatarFallback
                  class="bg-primary text-primary-foreground text-2xl"
                >
                  {{ getUserInitials() }}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                class="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                @click="$refs.avatarInput.click()"
              >
                <Icon name="lucide:camera" class="h-4 w-4" />
              </Button>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
              />
            </div>

            <h3 class="text-xl font-semibold mb-1">
              {{ authStore.user?.fullName }}
            </h3>
            <p class="text-muted-foreground mb-4">
              {{ authStore.user?.email }}
            </p>

            <!-- Account Stats -->
            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="space-y-1">
                <div class="text-2xl font-bold text-primary">
                  {{ accountStats.orders }}
                </div>
                <div class="text-xs text-muted-foreground">Orders</div>
              </div>
              <div class="space-y-1">
                <div class="text-2xl font-bold text-primary">
                  {{ accountStats.wishlist }}
                </div>
                <div class="text-xs text-muted-foreground">Wishlist</div>
              </div>
            </div>

            <!-- Member Since -->
            <div class="mt-6 pt-4 border-t">
              <div
                class="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
              >
                <Icon name="lucide:calendar" class="h-4 w-4" />
                <span
                  >Member since
                  {{ formatMemberSince(authStore.user?.createdAt) }}</span
                >
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Actions -->
        <Card class="mt-6">
          <CardHeader>
            <CardTitle class="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button variant="outline" class="w-full justify-start" asChild>
              <NuxtLink to="/orders">
                <Icon name="lucide:package" class="mr-2 h-4 w-4" />
                View Orders
              </NuxtLink>
            </Button>
            <Button variant="outline" class="w-full justify-start" asChild>
              <NuxtLink to="/wishlist">
                <Icon name="lucide:heart" class="mr-2 h-4 w-4" />
                My Wishlist
              </NuxtLink>
            </Button>
            <Button variant="outline" class="w-full justify-start" asChild>
              <NuxtLink to="/cart">
                <Icon name="lucide:shopping-cart" class="mr-2 h-4 w-4" />
                Shopping Cart
              </NuxtLink>
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Profile Forms -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="updateProfile" class="space-y-4">
              <!-- Name -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    v-model="profileForm.firstName"
                    placeholder="Walter"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <Label for="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    v-model="profileForm.lastName"
                    placeholder="White"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <Label for="email">Email Address</Label>
                <Input
                  id="email"
                  :value="authStore.user?.email"
                  disabled
                  class="bg-muted"
                />
                <p class="text-xs text-muted-foreground">
                  Email cannot be changed for security reasons. Contact support
                  if needed.
                </p>
              </div>

              <!-- Phone -->
              <div class="space-y-2">
                <Label for="phone">Phone Number</Label>
                <Input
                  id="phone"
                  v-model="profileForm.phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <!-- Bio -->
              <div class="space-y-2">
                <Label for="bio">Bio</Label>
                <Textarea
                  id="bio"
                  v-model="profileForm.bio"
                  placeholder="Tell us a bit about yourself..."
                  rows="3"
                />
              </div>

              <!-- Submit Button -->
              <Button type="submit" :disabled="isUpdatingProfile">
                <Icon
                  v-if="isUpdatingProfile"
                  name="lucide:loader-2"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                {{ isUpdatingProfile ? 'Updating...' : 'Update Profile' }}
              </Button>
            </form>
          </CardContent>
        </Card>

        <!-- Security Settings -->
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="changePassword" class="space-y-4">
              <!-- Current Password -->
              <div class="space-y-2">
                <Label for="currentPassword">Current Password</Label>
                <div class="relative">
                  <Input
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    :type="showPasswords.current ? 'text' : 'password'"
                    placeholder="Enter current password"
                    required
                    class="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    @click="showPasswords.current = !showPasswords.current"
                  >
                    <Icon
                      :name="
                        showPasswords.current ? 'lucide:eye-off' : 'lucide:eye'
                      "
                      class="h-4 w-4"
                    />
                  </Button>
                </div>
              </div>

              <!-- New Password -->
              <div class="space-y-2">
                <Label for="newPassword">New Password</Label>
                <div class="relative">
                  <Input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    :type="showPasswords.new ? 'text' : 'password'"
                    placeholder="Enter new password"
                    required
                    class="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    @click="showPasswords.new = !showPasswords.new"
                  >
                    <Icon
                      :name="
                        showPasswords.new ? 'lucide:eye-off' : 'lucide:eye'
                      "
                      class="h-4 w-4"
                    />
                  </Button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-2">
                <Label for="confirmPassword">Confirm New Password</Label>
                <div class="relative">
                  <Input
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    :type="showPasswords.confirm ? 'text' : 'password'"
                    placeholder="Confirm new password"
                    required
                    class="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    @click="showPasswords.confirm = !showPasswords.confirm"
                  >
                    <Icon
                      :name="
                        showPasswords.confirm ? 'lucide:eye-off' : 'lucide:eye'
                      "
                      class="h-4 w-4"
                    />
                  </Button>
                </div>
              </div>

              <!-- Password Requirements -->
              <div class="space-y-2">
                <p class="text-sm font-medium">Password Requirements:</p>
                <ul class="text-xs text-muted-foreground space-y-1">
                  <li class="flex items-center space-x-2">
                    <Icon
                      :name="
                        passwordRequirements.length
                          ? 'lucide:check'
                          : 'lucide:x'
                      "
                      :class="
                        passwordRequirements.length
                          ? 'text-green-500'
                          : 'text-red-500'
                      "
                      class="h-3 w-3"
                    />
                    <span>At least 8 characters long</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <Icon
                      :name="
                        passwordRequirements.uppercase
                          ? 'lucide:check'
                          : 'lucide:x'
                      "
                      :class="
                        passwordRequirements.uppercase
                          ? 'text-green-500'
                          : 'text-red-500'
                      "
                      class="h-3 w-3"
                    />
                    <span>Contains uppercase letter</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <Icon
                      :name="
                        passwordRequirements.lowercase
                          ? 'lucide:check'
                          : 'lucide:x'
                      "
                      :class="
                        passwordRequirements.lowercase
                          ? 'text-green-500'
                          : 'text-red-500'
                      "
                      class="h-3 w-3"
                    />
                    <span>Contains lowercase letter</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <Icon
                      :name="
                        passwordRequirements.number
                          ? 'lucide:check'
                          : 'lucide:x'
                      "
                      :class="
                        passwordRequirements.number
                          ? 'text-green-500'
                          : 'text-red-500'
                      "
                      class="h-3 w-3"
                    />
                    <span>Contains number</span>
                  </li>
                </ul>
              </div>

              <!-- Submit Button -->
              <Button
                type="submit"
                :disabled="isChangingPassword || !isPasswordValid"
                variant="outline"
              >
                <Icon
                  v-if="isChangingPassword"
                  name="lucide:loader-2"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                <Icon v-else name="lucide:shield" class="mr-2 h-4 w-4" />
                {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
              </Button>
            </form>
          </CardContent>
        </Card>

        <!-- Preferences -->
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your shopping experience
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Email Notifications -->
            <div class="space-y-3">
              <Label class="text-base font-medium">Email Notifications</Label>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-sm font-medium">Order Updates</Label>
                    <p class="text-xs text-muted-foreground">
                      Receive emails about order status and shipping
                    </p>
                  </div>
                  <Switch
                    v-model:checked="preferences.emailNotifications.orders"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-sm font-medium">Promotions</Label>
                    <p class="text-xs text-muted-foreground">
                      Get notified about sales and special offers
                    </p>
                  </div>
                  <Switch
                    v-model:checked="preferences.emailNotifications.promotions"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-sm font-medium">Product Updates</Label>
                    <p class="text-xs text-muted-foreground">
                      New products and restocked items
                    </p>
                  </div>
                  <Switch
                    v-model:checked="preferences.emailNotifications.products"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <!-- Privacy Settings -->
            <div class="space-y-3">
              <Label class="text-base font-medium">Privacy Settings</Label>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-sm font-medium"
                      >Profile Visibility</Label
                    >
                    <p class="text-xs text-muted-foreground">
                      Allow others to see your public profile
                    </p>
                  </div>
                  <Switch v-model:checked="preferences.privacy.publicProfile" />
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-sm font-medium">Activity Tracking</Label>
                    <p class="text-xs text-muted-foreground">
                      Help us improve your shopping experience
                    </p>
                  </div>
                  <Switch
                    v-model:checked="preferences.privacy.activityTracking"
                  />
                </div>
              </div>
            </div>

            <!-- Save Preferences -->
            <Button
              @click="updatePreferences"
              :disabled="isUpdatingPreferences"
            >
              <Icon
                v-if="isUpdatingPreferences"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              {{ isUpdatingPreferences ? 'Saving...' : 'Save Preferences' }}
            </Button>
          </CardContent>
        </Card>

        <!-- Danger Zone -->
        <Card class="border-destructive">
          <CardHeader>
            <CardTitle class="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              class="flex items-center justify-between p-4 border border-destructive/20 rounded-lg"
            >
              <div>
                <h4 class="font-medium">Delete Account</h4>
                <p class="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" @click="showDeleteDialog = true">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert class="border-green-500 bg-green-50 dark:bg-green-950">
        <Icon name="lucide:check-circle" class="h-4 w-4 text-green-600" />
        <AlertTitle class="text-green-800 dark:text-green-200"
          >Success!</AlertTitle
        >
        <AlertDescription class="text-green-700 dark:text-green-300">
          {{ toastMessage }}
        </AlertDescription>
      </Alert>
    </div>

    <!-- Delete Account Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteAccount"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

// SEO
useSeoMeta({
  title: 'My Profile | ShinyFlakes',
  description: 'Manage your ShinyFlakes account settings and preferences',
});

// Stores
const authStore = useAuthStore();
const wishlistStore = useWishlistStore();

// State
const isUpdatingProfile = ref(false);
const isChangingPassword = ref(false);
const isUpdatingPreferences = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const showDeleteDialog = ref(false);

const profileForm = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  bio: '',
  avatar: '',
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const showPasswords = reactive({
  current: false,
  new: false,
  confirm: false,
});

const preferences = reactive({
  emailNotifications: {
    orders: true,
    promotions: false,
    products: true,
  },
  privacy: {
    publicProfile: false,
    activityTracking: true,
  },
});

// Computed
const accountStats = computed(() => ({
  orders: 0, // TODO: Connect to real data
  wishlist: wishlistStore.itemCount,
}));

const passwordRequirements = computed(() => {
  const password = passwordForm.newPassword;
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
});

const isPasswordValid = computed(() => {
  return (
    Object.values(passwordRequirements.value).every((req) => req) &&
    passwordForm.newPassword === passwordForm.confirmPassword
  );
});

// Methods
const getUserInitials = () => {
  const name = authStore.user?.fullName || 'User';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const formatMemberSince = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // TODO: Implement image upload
    console.log('Avatar upload:', file);
    showToastMessage('Avatar upload not implemented yet');
  }
};

const updateProfile = async () => {
  isUpdatingProfile.value = true;

  try {
    // TODO: Implement API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Profile update:', profileForm);
    showToastMessage('Profile updated successfully!');
  } catch (error) {
    console.error('Profile update failed:', error);
  } finally {
    isUpdatingProfile.value = false;
  }
};

const changePassword = async () => {
  if (!isPasswordValid.value) return;

  isChangingPassword.value = true;

  try {
    // TODO: Implement API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Password change successful');
    showToastMessage('Password changed successfully!');

    // Reset form
    Object.keys(passwordForm).forEach((key) => {
      passwordForm[key] = '';
    });
  } catch (error) {
    console.error('Password change failed:', error);
  } finally {
    isChangingPassword.value = false;
  }
};

const updatePreferences = async () => {
  isUpdatingPreferences.value = true;

  try {
    // TODO: Implement API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Preferences update:', preferences);
    showToastMessage('Preferences saved successfully!');
  } catch (error) {
    console.error('Preferences update failed:', error);
  } finally {
    isUpdatingPreferences.value = false;
  }
};

const deleteAccount = async () => {
  try {
    // TODO: Implement API call
    console.log('Account deletion requested');
    showToastMessage('Account deletion request submitted');
    showDeleteDialog.value = false;
  } catch (error) {
    console.error('Account deletion failed:', error);
  }
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Initialize
onMounted(() => {
  // Initialize profile form with user data
  if (authStore.user) {
    const names = authStore.user.fullName.split(' ');
    profileForm.firstName = names[0] || '';
    profileForm.lastName = names.slice(1).join(' ') || '';
  }
});
</script>
