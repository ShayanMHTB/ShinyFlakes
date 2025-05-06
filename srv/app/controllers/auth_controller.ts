import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { registerValidator, loginValidator } from '#validators/auth';

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator);

      // Check if user already exists
      const existingUser = await User.findBy('email', data.email);
      if (existingUser) {
        return response.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      // Create user with default role
      const user = await User.create({
        ...data,
        role: 'user',
      });

      // Generate access token
      const token = await User.accessTokens.create(user);

      return response.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
        },
        token: {
          type: 'Bearer',
          value: token.value!.release(),
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      return response.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      });
    }
  }

  /**
   * Login user
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator);

      // Verify credentials
      const user = await User.verifyCredentials(email, password);

      // Create API token for the user
      const token = await User.accessTokens.create(user);

      return response.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
        },
        token: {
          type: 'Bearer',
          value: token.value!.release(),
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  }

  /**
   * Logout user
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail();
      await User.accessTokens.delete(user, user.currentAccessToken.identifier);

      return response.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      return response.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message,
      });
    }
  }

  /**
   * Get current authenticated user
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail();
      return response.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail();
      const data = await request.only(['fullName']);

      user.merge(data);
      await user.save();

      return response.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return response.status(500).json({
        success: false,
        message: 'Profile update failed',
        error: error.message,
      });
    }
  }
}
