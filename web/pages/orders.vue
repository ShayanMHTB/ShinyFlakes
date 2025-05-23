<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Order History
      </h1>
      <p class="text-muted-foreground">Track and manage your orders</p>
    </div>

    <!-- Filter and Search -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <Icon
                name="lucide:search"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                v-model="searchQuery"
                placeholder="Search orders by ID, product name..."
                class="pl-10"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <Select v-model="statusFilter">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <!-- Date Range -->
          <Select v-model="dateFilter">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i">
        <Skeleton class="h-32 w-full" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="text-center py-16">
      <div
        class="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Icon name="lucide:package" class="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 class="text-2xl font-bold mb-2">No orders found</h3>
      <p class="text-muted-foreground mb-8 max-w-md mx-auto">
        {{
          searchQuery || statusFilter
            ? 'No orders match your current filters. Try adjusting your search criteria.'
            : "You haven't placed any orders yet. Start shopping to see your orders here!"
        }}
      </p>
      <Button size="lg" asChild v-if="!searchQuery && !statusFilter">
        <NuxtLink to="/products">
          <Icon name="lucide:shopping-bag" class="mr-2 h-5 w-5" />
          Start Shopping
        </NuxtLink>
      </Button>
      <Button v-else variant="outline" @click="clearFilters">
        <Icon name="lucide:filter-x" class="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <Card
        v-for="order in filteredOrders"
        :key="order.id"
        class="hover:shadow-md transition-shadow"
      >
        <CardContent class="p-6">
          <!-- Order Header -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between mb-4"
          >
            <div class="space-y-1">
              <div class="flex items-center space-x-3">
                <h3 class="font-semibold text-lg">Order #{{ order.id }}</h3>
                <Badge :variant="getStatusVariant(order.status)">
                  {{ formatStatus(order.status) }}
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground">
                Placed on {{ formatDate(order.created_at) }}
              </p>
            </div>

            <div class="flex items-center space-x-2 mt-4 sm:mt-0">
              <span class="text-xl font-bold text-primary">
                ${{ order.total.toFixed(2) }}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="lucide:more-horizontal" class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="viewOrderDetails(order)">
                    <Icon name="lucide:eye" class="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="trackOrder(order)">
                    <Icon name="lucide:truck" class="h-4 w-4 mr-2" />
                    Track Order
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-if="canReorder(order)"
                    @click="reorderItems(order)"
                  >
                    <Icon name="lucide:repeat" class="h-4 w-4 mr-2" />
                    Reorder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator v-if="canCancel(order)" />
                  <DropdownMenuItem
                    v-if="canCancel(order)"
                    @click="cancelOrder(order)"
                    class="text-destructive"
                  >
                    <Icon name="lucide:x-circle" class="h-4 w-4 mr-2" />
                    Cancel Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <!-- Order Progress -->
          <div v-if="order.status !== 'cancelled'" class="mb-4">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-sm font-medium">Order Progress</span>
            </div>
            <div class="flex items-center space-x-4">
              <div
                v-for="(step, index) in orderSteps"
                :key="step.status"
                class="flex items-center"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                      getStepStatus(order.status, step.status) === 'completed'
                        ? 'bg-green-500 text-white'
                        : getStepStatus(order.status, step.status) === 'current'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    ]"
                  >
                    <Icon
                      v-if="
                        getStepStatus(order.status, step.status) === 'completed'
                      "
                      name="lucide:check"
                      class="h-4 w-4"
                    />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                </div>
                <div
                  v-if="index < orderSteps.length - 1"
                  :class="[
                    'w-12 h-0.5 mx-2',
                    getStepStatus(order.status, step.status) === 'completed'
                      ? 'bg-green-500'
                      : 'bg-muted',
                  ]"
                />
              </div>
            </div>
            <div
              class="flex justify-between text-xs text-muted-foreground mt-2"
            >
              <span v-for="step in orderSteps" :key="step.status">
                {{ step.label }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-3">
            <h4 class="font-medium">Items ({{ order.items.length }})</h4>
            <div class="space-y-2">
              <div
                v-for="item in order.items"
                :key="item.product_name"
                class="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-muted rounded-md flex items-center justify-center"
                  >
                    <Icon
                      name="lucide:package"
                      class="h-6 w-6 text-muted-foreground"
                    />
                  </div>
                  <div>
                    <h5 class="font-medium">{{ item.product_name }}</h5>
                    <p class="text-sm text-muted-foreground">
                      Quantity: {{ item.quantity }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    ${{ item.price.toFixed(2) }} each
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estimated Delivery -->
          <div
            v-if="order.status === 'shipped'"
            class="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg"
          >
            <div class="flex items-center space-x-2">
              <Icon name="lucide:truck" class="h-4 w-4 text-blue-600" />
              <span
                class="text-sm font-medium text-blue-800 dark:text-blue-200"
              >
                Estimated delivery: {{ getEstimatedDelivery(order) }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Order Details Modal -->
    <Dialog v-model:open="showOrderDetails">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order #{{ selectedOrder?.id }} Details</DialogTitle>
        </DialogHeader>
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Order Summary -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2">Order Information</h4>
              <div class="space-y-1 text-sm">
                <div>
                  Status:
                  <Badge :variant="getStatusVariant(selectedOrder.status)">
                    {{ formatStatus(selectedOrder.status) }}
                  </Badge>
                </div>
                <div>
                  Order Date: {{ formatDate(selectedOrder.created_at) }}
                </div>
                <div>Total: ${{ selectedOrder.total.toFixed(2) }}</div>
              </div>
            </div>
            <div>
              <h4 class="font-medium mb-2">Shipping Information</h4>
              <div class="space-y-1 text-sm text-muted-foreground">
                <div>Standard Shipping</div>
                <div>Est. 3-5 business days</div>
                <div v-if="selectedOrder.tracking_number">
                  Tracking: {{ selectedOrder.tracking_number }}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Items Detail -->
          <div>
            <h4 class="font-medium mb-3">Order Items</h4>
            <div class="space-y-3">
              <div
                v-for="item in selectedOrder.items"
                :key="item.product_name"
                class="flex justify-between items-center"
              >
                <div>
                  <div class="font-medium">{{ item.product_name }}</div>
                  <div class="text-sm text-muted-foreground">
                    Qty: {{ item.quantity }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    ${{ item.price.toFixed(2) }} each
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

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
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

// SEO
useSeoMeta({
  title: 'My Orders | ShinyFlakes',
  description: 'Track and manage your ShinyFlakes orders',
});

// State
const isLoading = ref(false);
const orders = ref([]);
const searchQuery = ref('');
const statusFilter = ref('');
const dateFilter = ref('');
const showOrderDetails = ref(false);
const selectedOrder = ref(null);
const showToast = ref(false);
const toastMessage = ref('');

// Mock orders data (replace with API call)
const mockOrders = [
  {
    id: 1001,
    status: 'delivered',
    total: 89.97,
    created_at: '2024-12-15T10:30:00Z',
    tracking_number: 'SF123456789',
    items: [
      { product_name: 'Premium Crystal Collection', quantity: 2, price: 29.99 },
      { product_name: 'Blue Magic Crystals', quantity: 1, price: 29.99 },
    ],
  },
  {
    id: 1002,
    status: 'shipped',
    total: 149.95,
    created_at: '2024-12-20T14:15:00Z',
    tracking_number: 'SF987654321',
    items: [
      { product_name: 'Crystal Clear Formation', quantity: 3, price: 24.99 },
      { product_name: 'Laboratory Equipment Set', quantity: 1, price: 74.98 },
    ],
  },
  {
    id: 1003,
    status: 'processing',
    total: 59.98,
    created_at: '2024-12-22T09:20:00Z',
    items: [
      { product_name: 'Premium Crystal Collection', quantity: 2, price: 29.99 },
    ],
  },
];

const orderSteps = [
  { status: 'pending', label: 'Pending' },
  { status: 'processing', label: 'Processing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
];

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.id.toString().includes(query) ||
        order.items.some((item) =>
          item.product_name.toLowerCase().includes(query),
        ),
    );
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter((order) => order.status === statusFilter.value);
  }

  // Date filter
  if (dateFilter.value) {
    const now = new Date();
    const filterDate = new Date();

    switch (dateFilter.value) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    filtered = filtered.filter(
      (order) => new Date(order.created_at) >= filterDate,
    );
  }

  return filtered;
});

// Methods
const loadOrders = async () => {
  isLoading.value = true;

  try {
    // TODO: Replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    orders.value = mockOrders;
  } catch (error) {
    console.error('Failed to load orders:', error);
  } finally {
    isLoading.value = false;
  }
};

const getStatusVariant = (status) => {
  const variants = {
    pending: 'secondary',
    processing: 'default',
    shipped: 'outline',
    delivered: 'default',
    cancelled: 'destructive',
  };
  return variants[status] || 'secondary';
};

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStepStatus = (orderStatus, stepStatus) => {
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const orderIndex = statusOrder.indexOf(orderStatus);
  const stepIndex = statusOrder.indexOf(stepStatus);

  if (orderIndex > stepIndex) return 'completed';
  if (orderIndex === stepIndex) return 'current';
  return 'pending';
};

const getEstimatedDelivery = (order) => {
  const orderDate = new Date(order.created_at);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + 5);

  return deliveryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const canReorder = (order) => {
  return ['delivered', 'cancelled'].includes(order.status);
};

const canCancel = (order) => {
  return ['pending', 'processing'].includes(order.status);
};

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  dateFilter.value = '';
};

const viewOrderDetails = (order) => {
  selectedOrder.value = order;
  showOrderDetails.value = true;
};

const trackOrder = (order) => {
  if (order.tracking_number) {
    showToastMessage(`Tracking number: ${order.tracking_number}`);
  } else {
    showToastMessage('Tracking information not available yet');
  }
};

const reorderItems = (order) => {
  // TODO: Add items to cart
  showToastMessage('Items added to cart for reorder!');
};

const cancelOrder = async (order) => {
  try {
    // TODO: Implement API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update order status locally
    const orderIndex = orders.value.findIndex((o) => o.id === order.id);
    if (orderIndex > -1) {
      orders.value[orderIndex].status = 'cancelled';
    }

    showToastMessage('Order cancelled successfully');
  } catch (error) {
    console.error('Failed to cancel order:', error);
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
  loadOrders();
});
</script>
