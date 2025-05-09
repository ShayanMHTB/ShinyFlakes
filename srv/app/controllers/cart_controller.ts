import { HttpContext } from '@adonisjs/core/http';

export default class CartController {
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail();

    // Mock cart data
    const mockCart = [
      {
        id: 1,
        product_id: 1,
        product_name: 'Blue Sky Crystals',
        price: 99.99,
        quantity: 2,
        subtotal: 199.98,
        image: '/products/blue-sky.jpg',
      },
    ];

    return response.json({
      data: mockCart,
      user_id: user.id,
      total: mockCart.reduce((sum, item) => sum + item.subtotal, 0),
    });
  }

  async add({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const { product_id, quantity = 1 } = request.only([
      'product_id',
      'quantity',
    ]);

    return response.json({
      message: 'Item added to cart',
      product_id,
      quantity,
      user_id: user.id,
    });
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params;
    const { quantity } = request.only(['quantity']);

    return response.json({
      message: `Cart item ${id} updated`,
      quantity,
    });
  }

  async remove({ params, response }: HttpContext) {
    const { id } = params;

    return response.json({
      message: `Cart item ${id} removed`,
    });
  }
}
