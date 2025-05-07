import Product from '#models/product';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  async run() {
    // Clear existing products
    await Product.query().delete();

    const products = [
      {
        name: 'Blue Sky Crystal',
        description:
          "The finest quality crystals straight from Walter's lab. 99.1% pure satisfaction guaranteed! Say my name... and add this to your cart. Heisenberg approved.",
        price: 99.99,
        category: 'premium',
        image: '/products/blue-sky.jpg',
        images: ['/products/blue-sky.jpg', '/products/blue-sky-2.jpg'],
        inStock: true,
        quantity: 42,
        rating: 4.9,
        reviewCount: 187,
        slug: 'blue-sky-crystal',
        featured: true,
      },
      {
        name: "Jesse's Special Mix",
        description:
          "Yo, science! This one's pure fire 🔥 Jesse Pinkman's signature blend. Guaranteed to make you say 'Yeah, Science!' Perfect for those late-night coding sessions.",
        price: 79.99,
        category: 'special',
        image: '/products/jesse-mix.jpg',
        images: ['/products/jesse-mix.jpg', '/products/jesse-mix-2.jpg'],
        inStock: true,
        quantity: 25,
        rating: 4.7,
        reviewCount: 94,
        slug: 'jesse-special-mix',
        featured: true,
      },
      {
        name: "Saul's Legal Powder",
        description:
          'Better call Saul! Totally legal, we swear. This powder is so legitimate, it comes with its own lawyer. No questions asked, no papers needed.',
        price: 59.99,
        category: 'legal',
        image: '/products/saul-powder.jpg',
        images: ['/products/saul-powder.jpg'],
        inStock: false,
        quantity: 0,
        rating: 4.2,
        reviewCount: 156,
        slug: 'saul-legal-powder',
        featured: false,
      },
      {
        name: "Gus's Professional Grade",
        description:
          'Los Pollos Hermanos quality standards applied to crystals. Precision, perfection, and a taste that will blow your mind. Literally.',
        price: 149.99,
        category: 'professional',
        image: '/products/gus-grade.jpg',
        images: ['/products/gus-grade.jpg', '/products/gus-grade-2.jpg'],
        inStock: true,
        quantity: 15,
        rating: 5.0,
        reviewCount: 67,
        slug: 'gus-professional-grade',
        featured: true,
      },
      {
        name: "Hank's Evidence Bag Special",
        description:
          'Straight from the DEA evidence locker (just kidding, Hank!). These minerals will rock your world. Marie approved purple packaging included.',
        price: 39.99,
        category: 'minerals',
        image: '/products/hank-minerals.jpg',
        images: ['/products/hank-minerals.jpg'],
        inStock: true,
        quantity: 33,
        rating: 4.1,
        reviewCount: 89,
        slug: 'hank-evidence-bag-special',
        featured: false,
      },
      {
        name: "Skyler's Accounting Special",
        description:
          'Money laundering not included. This special edition helps you keep your books clean while your conscience stays dirty. Ted not recommended.',
        price: 69.99,
        category: 'accounting',
        image: '/products/skyler-special.jpg',
        images: ['/products/skyler-special.jpg'],
        inStock: true,
        quantity: 18,
        rating: 3.8,
        reviewCount: 45,
        slug: 'skyler-accounting-special',
        featured: false,
      },
      {
        name: "Mike's Security Grade",
        description:
          'No half measures. This product is so secure, it comes with its own private security detail. Mike Ehrmantraut tested and approved.',
        price: 119.99,
        category: 'security',
        image: '/products/mike-security.jpg',
        images: [
          '/products/mike-security.jpg',
          '/products/mike-security-2.jpg',
        ],
        inStock: true,
        quantity: 12,
        rating: 4.8,
        reviewCount: 72,
        slug: 'mike-security-grade',
        featured: true,
      },
      {
        name: "Combo's Street Special",
        description:
          'RIP Combo. This street-tested formula is perfect for those who want that authentic experience. Comes with a free bandana.',
        price: 29.99,
        category: 'street',
        image: '/products/combo-special.jpg',
        images: ['/products/combo-special.jpg'],
        inStock: true,
        quantity: 50,
        rating: 4.0,
        reviewCount: 123,
        slug: 'combo-street-special',
        featured: false,
      },
      {
        name: "Badger's Basement Batch",
        description:
          "Cooked up in Badger's basement with love and questionable hygiene. Star Trek references included in every package. Engage!",
        price: 34.99,
        category: 'basement',
        image: '/products/badger-batch.jpg',
        images: ['/products/badger-batch.jpg'],
        inStock: true,
        quantity: 28,
        rating: 3.9,
        reviewCount: 91,
        slug: 'badger-basement-batch',
        featured: false,
      },
      {
        name: "Skinny Pete's Piano Edition",
        description:
          'Music to your ears, literally. Each package comes with a free piano lesson from Skinny Pete. Church, yo!',
        price: 44.99,
        category: 'music',
        image: '/products/skinny-pete-piano.jpg',
        images: ['/products/skinny-pete-piano.jpg'],
        inStock: true,
        quantity: 21,
        rating: 4.3,
        reviewCount: 76,
        slug: 'skinny-pete-piano-edition',
        featured: false,
      },
    ];

    // Insert all products
    await Product.createMany(products);

    console.log('✅ Products seeded successfully!');
  }
}
