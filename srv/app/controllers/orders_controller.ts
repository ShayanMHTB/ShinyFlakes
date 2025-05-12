import { HttpContext } from '@adonisjs/core/http';

export default class OrdersController {
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail();

    // Mock orders
    const mockOrders = [
      {
        id: 1,
        user_id: user.id,
        total: 199.98,
        status: 'shipped',
        created_at: '2025-01-15T10:30:00Z',
        items: [
          {
            product_name: 'Blue Sky Crystals',
            quantity: 2,
            price: 99.99,
          },
        ],
      },
    ];

    return response.json({
      data: mockOrders,
      user_id: user.id,
    });
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail();

    return response.status(201).json({
      message: 'Order created successfully',
      user_id: user.id,
      order_id: Math.floor(Math.random() * 1000),
    });
  }

  async show({ params, auth, response }: HttpContext) {
    const { id } = params;
    const user = auth.getUserOrFail();

    return response.json({
      data: {
        id: parseInt(id),
        user_id: user.id,
        status: 'shipped',
        total: 199.98,
      },
    });
  }
}
