import { DateTime } from 'luxon';
import { BaseModel, column, computed } from '@adonisjs/lucid/orm';

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare description: string;

  @column()
  declare price: number;

  @column()
  declare category: string;

  @column()
  declare image: string | null;

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value || '[]'),
  })
  declare images: string[];

  @column()
  declare inStock: boolean;

  @column()
  declare quantity: number;

  @column()
  declare rating: number;

  @column()
  declare reviewCount: number;

  @column()
  declare slug: string;

  @column()
  declare featured: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  // Computed properties
  @computed()
  get isAvailable() {
    return this.inStock && this.quantity > 0;
  }

  @computed()
  get formattedPrice() {
    return `$${this.price.toFixed(2)}`;
  }

  // Methods
  static async findBySlug(slug: string) {
    return await this.query().where('slug', slug).first();
  }

  static async getFeatured() {
    return await this.query().where('featured', true).where('in_stock', true);
  }

  static async getByCategory(category: string) {
    return await this.query()
      .where('category', category)
      .where('in_stock', true);
  }

  static async search(query: string) {
    return await this.query()
      .where('name', 'LIKE', `%${query}`)
      .orWhere('description', 'LIKE', `%${query}`)
      .where('in_stock', true);
  }
}
