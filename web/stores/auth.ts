import type { User, AuthToken, LoginResponse, RegisterResponse, MeResponse } from '~/types'

interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Computed (preserving existing + adding new)
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const isAuthenticated = computed(() => !!user.value && !!token.value) // Alias for consistency
  const userRole = computed(() => (user.value as any)?.role || 'user') // Cast to any for role property
  const isAdmin = computed(() => userRole.value === 'admin')

  // API instance
  const api = useApi()

  // Storage helpers (enhanced from existing)
  const setAuthData = (userData: User, tokenData: AuthToken) => {
    user.value = userData
    token.value = tokenData.value
    
    if (process.client) {
      localStorage.setItem('auth_token', tokenData.value)
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
  }

  const clearAuthData = () => {
    user.value = null
    token.value = null
    
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  const saveToSessionStorage = () => {
    if (process.client && user.value && token.value) {
      sessionStorage.setItem('shinyflakes_auth', JSON.stringify({
        user: user.value,
        token: token.value,
        timestamp: Date.now()
      }))
    }
  }

  const loadFromStorage = () => {
    if (!process.client) return false
    
    // Try existing localStorage format first
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser) as User
        return true
      } catch (error) {
        console.error('Failed to load auth from storage:', error)
        clearAuthData()
      }
    }
    
    return false
  }

  // Actions (enhanced existing methods)
  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    isLoading.value = true
    
    try {
      // Use existing API structure
      const response = await api.auth.login({
        email: credentials.email,
        password: credentials.password
      })
      
      setAuthData(response.user, response.token)
      
      // Handle remember me functionality
      if (credentials.remember) {
        // Token already saved by setAuthData
        console.log('Login with remember me')
      } else {
        // For session-only, we could implement sessionStorage later
        saveToSessionStorage()
      }
      
      // Use fullName property that exists in User type
      console.log('Login successful:', user.value?.fullName)
      return response
    } catch (error) {
      clearAuthData()
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData): Promise<RegisterResponse> => {
    isLoading.value = true
    
    try {
      // Map new format to existing API format
      const response = await api.auth.register({
        fullName: data.name,
        email: data.email,
        password: data.password
      })
      
      // If registration returns user data, set it
      if ('user' in response && 'token' in response) {
        // Type assertion to handle the response type
        const loginResponse = response as unknown as LoginResponse
        setAuthData(loginResponse.user, loginResponse.token)
      }
      
      console.log('Registration successful')
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    isLoading.value = true
    
    try {
      await api.auth.logout()
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error)
    } finally {
      clearAuthData()
      isLoading.value = false
      console.log('Logged out successfully')
      await navigateTo('/')
    }
  }

  const fetchUser = async (): Promise<User> => {
    try {
      const response = await api.auth.me()
      user.value = response.user
      
      // Update localStorage with fresh user data
      if (process.client && token.value) {
        localStorage.setItem('auth_user', JSON.stringify(response.user))
      }
      
      return response.user
    } catch (error) {
      clearAuthData()
      throw error
    }
  }

  const checkAuth = async (): Promise<void> => {
    if (!token.value) return
    
    try {
      await fetchUser()
    } catch (error) {
      clearAuthData()
    }
  }

  // Enhanced profile management
  const updateProfile = async (profileData: Partial<User>) => {
    if (!user.value) throw new Error('No user logged in')
    
    isLoading.value = true
    
    try {
      // This would need to be added to the API service
      const response = await api.auth.updateProfile?.(profileData)
      
      if (response && response.user) {
        user.value = { ...user.value, ...response.user }
        
        // Update localStorage
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(user.value))
        }
        
        console.log('Profile updated successfully')
        return response
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    isLoading.value = true
    
    try {
      // This would need to be added to the API service
      const response = await api.auth.changePassword?.({
        currentPassword,
        newPassword
      })
      
      console.log('Password changed successfully')
      return response
    } catch (error) {
      console.error('Password change error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Initialize auth state from localStorage (preserving existing logic)
  const initAuth = () => {
    if (isInitialized.value) return
    
    loadFromStorage()
    isInitialized.value = true
  }

  // Reset password functionality
  const requestPasswordReset = async (email: string) => {
    isLoading.value = true
    
    try {
      // This would need to be added to the API service
      const response = await api.auth.requestPasswordReset?.({ email })
      console.log('Password reset email sent')
      return response
    } catch (error) {
      console.error('Password reset request error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    isLoading.value = true
    
    try {
      // This would need to be added to the API service
      const response = await api.auth.resetPassword?.({ token, password: newPassword })
      console.log('Password reset successful')
      return response
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    isInitialized: readonly(isInitialized),
    
    // Computed (both existing and new)
    isLoggedIn,
    isAuthenticated,
    userRole,
    isAdmin,
    
    // Actions (preserving existing + adding new)
    login,
    register,
    logout,
    fetchUser,
    checkAuth,
    initAuth,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword
  }
})
