import { HttpContext } from '@adonisjs/core/http';
import Product from '#models/product';

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 20, category, search, featured } = request.qs();

      let query = Product.query();

      // Filter by category
      if (category) {
        query = query.where('category', category);
      }

      // Filter by featured
      if (featured === 'true') {
        query = query.where('featured', true);
      }

      // Search functionality
      if (search) {
        query = query.where((builder) => {
          builder
            .where('name', 'LIKE', `%${search}%`)
            .orWhere('description', 'LIKE', `%${search}%`);
        });
      }

      // Only show in-stock products by default
      query = query.where('in_stock', true);

      // Paginate results
      const products = await query.paginate(page, limit);

      return response.json({
        data: products.all(),
        meta: {
          page: products.currentPage,
          limit: products.perPage,
          total: products.total,
          totalPages: products.lastPage,
          category,
          search,
          featured,
        },
      });
    } catch (error) {
      return response.status(500).json({
        error: 'Failed to fetch products',
        message: error.message,
      });
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const { id } = params;

      // Try to find by ID first, then by slug
      let product = await Product.find(id);

      if (!product && isNaN(Number(id))) {
        // If ID is not a number, try to find by slug
        product = await Product.findBySlug(id);
      }

      if (!product) {
        return response.status(404).json({
          error: 'Product not found',
          message: `Product with identifier ${id} does not exist`,
        });
      }

      return response.json({
        data: product,
      });
    } catch (error) {
      return response.status(500).json({
        error: 'Failed to fetch product',
        message: error.message,
      });
    }
  }

  async byCategory({ params, request, response }: HttpContext) {
    try {
      const { category } = params;
      const { page = 1, limit = 20 } = request.qs();

      const products = await Product.query()
        .where('category', category)
        .where('in_stock', true)
        .paginate(page, limit);

      return response.json({
        data: products.all(),
        meta: {
          page: products.currentPage,
          limit: products.perPage,
          total: products.total,
          totalPages: products.lastPage,
          category,
        },
      });
    } catch (error) {
      return response.status(500).json({
        error: 'Failed to fetch products by category',
        message: error.message,
      });
    }
  }

  async categories({ response }: HttpContext) {
    try {
      // Get unique categories with product counts
      const categories = await Product.query()
        .select('category')
        .count('* as count')
        .where('in_stock', true)
        .groupBy('category')
        .orderBy('category');

      return response.json({
        data: categories.map((cat) => ({
          name: cat.category,
          count: Number(cat.$extras.count),
          slug: cat.category.toLowerCase().replace(/\s+/g, '-'),
        })),
      });
    } catch (error) {
      return response.status(500).json({
        error: 'Failed to fetch categories',
        message: error.message,
      });
    }
  }

  async featured({ response }: HttpContext) {
    try {
      const products = await Product.getFeatured();

      return response.json({
        data: products,
      });
    } catch (error) {
      return response.status(500).json({
        error: 'Failed to fetch featured products',
        message: error.message,
      });
    }
  }
}
