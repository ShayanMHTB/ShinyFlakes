/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

router
  .group(() => {
    // Health check
    router.get('/health', async () => {
      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'ShinyFlakes API',
      };
    });

    // Auth routes
    router
      .group(() => {
        router.post('/register', '#controllers/auth_controller.register');
        router.post('/login', '#controllers/auth_controller.login');
        router
          .delete('/logout', '#controllers/auth_controller.logout')
          .use('auth:api');
        router.get('/me', '#controllers/auth_controller.me').use('auth:api');
        router
          .put('/profile', '#controllers/auth_controller.updateProfile')
          .use('auth:api');
      })
      .prefix('/auth');

    // Product routes
    router
      .group(() => {
        router.get('/', '#controllers/products_controller.index');
        router.get('/featured', '#controllers/products_controller.featured');
        router.get(
          '/categories',
          '#controllers/products_controller.categories',
        );
        router.get(
          '/category/:category',
          '#controllers/products_controller.byCategory',
        );
        router.get('/:id', '#controllers/products_controller.show');
      })
      .prefix('/products');

    // Cart routes (protected)
    router
      .group(() => {
        router.get('/', '#controllers/cart_controller.index');
        router.post('/add', '#controllers/cart_controller.add');
        router.put('/:id', '#controllers/cart_controller.update');
        router.delete('/:id', '#controllers/cart_controller.remove');
      })
      .prefix('/cart')
      .use('auth:api');

    // Order routes (protected)
    router
      .group(() => {
        router.get('/', '#controllers/orders_controller.index');
        router.post('/', '#controllers/orders_controller.store');
        router.get('/:id', '#controllers/orders_controller.show');
      })
      .prefix('/orders')
      .use('auth:api');
  })
  .prefix('/api');

// Catch-all route for API - return 404 JSON instead of HTML
router.any('*', async ({ response }) => {
  return response.status(404).json({
    error: 'Route not found',
    message: 'The requested API endpoint does not exist',
  });
});
