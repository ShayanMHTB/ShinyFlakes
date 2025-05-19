import type { 
  LoginResponse, 
  RegisterResponse, 
  MeResponse,
  ProductsResponse,
  ProductResponse,
  CartResponse,
  OrdersResponse,
  OrderResponse,
  HealthResponse
} from '~/types'

// Define additional types to avoid TypeScript issues
interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}

interface FetchOptions {
  method?: string
  body?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}

export const useApi = () => {
  const config = useRuntimeConfig()
  
  // Get auth token from localStorage (fixed type issue)
  const getAuthHeader = (): Record<string, string> => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      return token ? { Authorization: `Bearer ${token}` } : {}
    }
    return {}
  }
  
  // Create a simplified API call function to avoid TypeScript recursion issues
  const apiCall = async <T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const baseURL = config.public.apiBase as string
    
    // Build headers more explicitly to avoid type issues
    const authHeaders = getAuthHeader()
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...authHeaders
    }
    
    const fetchOptions: FetchOptions = {
      method: options.method || 'GET',
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }

    // Add body for non-GET requests
    if (options.body && options.method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body)
    }

    // Add query parameters
    let url = `${baseURL}${endpoint}`
    if (options.params) {
      const searchParams = new URLSearchParams()
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    try {
      const response = await fetch(url, fetchOptions)
      
      // Handle non-JSON responses
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // If response is not JSON, use the default error message
        }
        
        // Handle unauthorized
        if (response.status === 401 && process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          await navigateTo('/auth/login')
        }
        
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  return {
    // Auth methods (preserving existing + adding new optional methods)
    auth: {
      login: (credentials: { email: string; password: string }): Promise<LoginResponse> =>
        apiCall<LoginResponse>('/auth/login', { method: 'POST', body: credentials }),
      
      register: (data: { fullName: string; email: string; password: string }): Promise<RegisterResponse> =>
        apiCall<RegisterResponse>('/auth/register', { method: 'POST', body: data }),
      
      logout: (): Promise<{ message: string }> =>
        apiCall<{ message: string }>('/auth/logout', { method: 'DELETE' }),
      
      me: (): Promise<MeResponse> =>
        apiCall<MeResponse>('/auth/me'),

      // Optional new methods (only if backend supports them)
      updateProfile: (profileData: any): Promise<{ user: any }> =>
        apiCall<{ user: any }>('/auth/profile', { method: 'PUT', body: profileData }),

      changePassword: (data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> =>
        apiCall<{ message: string }>('/auth/change-password', { method: 'POST', body: data }),

      requestPasswordReset: (data: { email: string }): Promise<{ message: string }> =>
        apiCall<{ message: string }>('/auth/forgot-password', { method: 'POST', body: data }),

      resetPassword: (data: { token: string; password: string }): Promise<{ message: string }> =>
        apiCall<{ message: string }>('/auth/reset-password', { method: 'POST', body: data })
    },

    // Product methods (preserving existing)
    products: {
      getAll: (params?: { page?: number; limit?: number; category?: string; search?: string; featured?: boolean }): Promise<ProductsResponse> =>
        apiCall<ProductsResponse>('/products', { params }),
      
      getById: (id: string | number): Promise<ProductResponse> =>
        apiCall<ProductResponse>(`/products/${id}`),
      
      getByCategory: (category: string): Promise<ProductsResponse> =>
        apiCall<ProductsResponse>(`/products/category/${category}`),

      // Additional product methods for admin functionality
      categories: (): Promise<{ categories: string[] }> =>
        apiCall<{ categories: string[] }>('/products/categories'),

      create: (productData: any): Promise<{ message: string; product: any }> =>
        apiCall<{ message: string; product: any }>('/products', { method: 'POST', body: productData }),

      update: (id: string | number, productData: any): Promise<{ message: string; product: any }> =>
        apiCall<{ message: string; product: any }>(`/products/${id}`, { method: 'PUT', body: productData }),

      delete: (id: string | number): Promise<{ message: string }> =>
        apiCall<{ message: string }>(`/products/${id}`, { method: 'DELETE' })
    },

    // Cart methods (preserving existing)
    cart: {
      get: (): Promise<CartResponse> =>
        apiCall<CartResponse>('/cart'),
      
      add: (data: { product_id: string | number; quantity?: number }): Promise<{ message: string }> =>
        apiCall<{ message: string }>('/cart/add', { method: 'POST', body: data }),
      
      update: (id: string | number, data: { quantity: number }): Promise<{ message: string }> =>
        apiCall<{ message: string }>(`/cart/${id}`, { method: 'PUT', body: data }),
      
      remove: (id: string | number): Promise<{ message: string }> =>
        apiCall<{ message: string }>(`/cart/${id}`, { method: 'DELETE' }),

      clear: (): Promise<{ message: string }> =>
        apiCall<{ message: string }>('/cart/clear', { method: 'DELETE' })
    },

    // Order methods (preserving existing + enhancing)
    orders: {
      getAll: (params?: { page?: number; limit?: number; status?: string }): Promise<OrdersResponse> =>
        apiCall<OrdersResponse>('/orders', { params }),
      
      create: (data: any): Promise<{ message: string; order_id: number }> =>
        apiCall<{ message: string; order_id: number }>('/orders', { method: 'POST', body: data }),
      
      getById: (id: string | number): Promise<OrderResponse> =>
        apiCall<OrderResponse>(`/orders/${id}`),

      updateStatus: (id: string | number, status: string): Promise<{ message: string }> =>
        apiCall<{ message: string }>(`/orders/${id}/status`, { method: 'PUT', body: { status } }),

      cancel: (id: string | number): Promise<{ message: string }> =>
        apiCall<{ message: string }>(`/orders/${id}/cancel`, { method: 'POST' })
    },

    // Users methods (for admin functionality)
    users: {
      getAll: (params?: { page?: number; limit?: number; role?: string }): Promise<{ users: any[]; total: number }> =>
        apiCall<{ users: any[]; total: number }>('/users', { params }),
      
      getById: (id: string | number): Promise<{ user: any }> =>
        apiCall<{ user: any }>(`/users/${id}`),
      
      update: (id: string | number, userData: any): Promise<{ message: string; user: any }> =>
        apiCall<{ message: string; user: any }>(`/users/${id}`, { method: 'PUT', body: userData }),
      
      delete: (id: string | number): Promise<{ message: string }> =>
        apiCall<{ message: string }>(`/users/${id}`, { method: 'DELETE' }),

      updateRole: (id: string | number, role: string): Promise<{ message: string }> =>
        apiCall<{ message: string }>(`/users/${id}/role`, { method: 'PUT', body: { role } })
    },

    // Analytics/Dashboard methods (for admin)
    analytics: {
      overview: (): Promise<{ 
        totalUsers: number; 
        totalOrders: number; 
        totalRevenue: number; 
        totalProducts: number 
      }> =>
        apiCall<{
          totalUsers: number; 
          totalOrders: number; 
          totalRevenue: number; 
          totalProducts: number 
        }>('/analytics/overview'),

      sales: (params?: { period?: string; startDate?: string; endDate?: string }): Promise<{
        sales: any[];
        total: number;
      }> =>
        apiCall<{ sales: any[]; total: number }>('/analytics/sales', { params }),

      topProducts: (params?: { limit?: number; period?: string }): Promise<{
        products: any[];
      }> =>
        apiCall<{ products: any[] }>('/analytics/top-products', { params })
    },

    // Health check (preserving existing)
    health: (): Promise<HealthResponse> =>
      apiCall<HealthResponse>('/health'),

    // Direct API call method for custom requests
    call: apiCall
  }
}
