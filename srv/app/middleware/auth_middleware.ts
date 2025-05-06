import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await ctx.auth.authenticate();
      await next();
    } catch (error) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'Unauthorized',
      });
    }
  }
}
