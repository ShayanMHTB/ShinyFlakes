export interface User {
  id: number;
  email: string;
  fullName: string;
  createdAt?: string;
}

export interface AuthToken {
  type: string;
  value: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: AuthToken;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  inStock: boolean;
  quantity?: number;
  rating: number;
  reviews?: Review[];
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
}

export interface CartResponse {
  data: CartItem[];
  user_id: number;
  total: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    category?: string;
    search?: string;
  };
}

export interface ProductResponse {
  data: Product;
}

export interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  data: Order[];
  user_id: number;
}

export interface OrderResponse {
  data: Order;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

export interface ApiError {
  error: string;
  message: string;
}
