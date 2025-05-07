import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'products';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('name', 255).notNullable();
      table.text('description').notNullable();

      table.decimal('price', 10, 2).notNullable();

      table.string('category', 100).notNullable();

      table.string('image', 500).notNullable;
      table.json('images').nullable();

      table.boolean('in_stock').defaultTo(true);
      table.integer('quantity').defaultTo(0);

      table.decimal('rating', 3, 2).defaultTo(0.0);
      table.integer('review_count').defaultTo(0);

      table.string('slug', 255).unique().notNullable();
      table.boolean('featured').defaultTo(false);

      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
