# ShinyFlakes 🌟

A parody e-commerce website inspired by the German Netflix series "How to Sell Drugs Online (Fast)". This project serves as a tribute to the show while providing a learning platform for modern web development practices using the MEVN stack with AdonisJS and Nuxt.

## 🎯 Project Overview

ShinyFlakes is a full-stack e-commerce parody application that mimics the fictional drug marketplace from the Netflix series. It's built for educational purposes to showcase modern web development skills and pay homage to the brilliant show that combines dark comedy with tech startup culture.

**⚠️ Disclaimer**: This is purely a parody/educational project. No actual products are sold, and all content is fictional and humorous in nature.

## 🛠️ Tech Stack

### Backend (`srv/`)

- **AdonisJS 6**: TypeScript-first Node.js framework
- **SQLite**: Development database (migration path to Supabase planned)
- **Lucid ORM**: Database abstraction layer
- **Session-based Authentication**: Built-in user management
- **RESTful API**: Clean API endpoints for frontend consumption

### Frontend (`web/`)

- **Nuxt 3**: Vue.js meta-framework with SSR capabilities
- **Vue 3**: Frontend framework with Composition API
- **TypeScript**: Type-safe development
- **Pinia**: State management
- **Tailwind CSS + Headless UI**: Styling and components
- **Nuxt UI**: Additional component library

### Testing & Quality

- **Cypress**: End-to-end testing (staying true to the show's tech stack)
- **Vitest**: Unit and integration testing
- **@vue/test-utils**: Vue component testing
- **ESLint + Prettier**: Code quality and formatting

## 🏗️ Project Structure

```
ShinyFlakes/
├── srv/                          # AdonisJS Backend
│   ├── app/
│   │   ├── controllers/http/     # API controllers
│   │   ├── models/              # Database models
│   │   ├── middleware/          # Custom middleware
│   │   ├── services/            # Business logic
│   │   └── validators/          # Request validation
│   ├── database/
│   │   ├── migrations/          # Database schema
│   │   └── seeders/            # Sample data
│   ├── config/                  # App configuration
│   ├── tests/                   # Backend tests
│   └── start/                   # Application bootstrap
│
├── web/                         # Nuxt 3 Frontend
│   ├── components/              # Vue components
│   │   ├── Product/            # Product-related components
│   │   ├── Cart/               # Shopping cart components
│   │   ├── Auth/               # Authentication components
│   │   └── UI/                 # Reusable UI components
│   ├── pages/                   # Application routes
│   │   ├── index.vue           # Homepage
│   │   ├── products/           # Product catalog
│   │   ├── cart.vue            # Shopping cart
│   │   └── auth/               # Login/Register
│   ├── stores/                  # Pinia state stores
│   │   ├── auth.ts             # Authentication state
│   │   ├── cart.ts             # Shopping cart state
│   │   └── products.ts         # Product management
│   ├── composables/            # Vue composables
│   ├── tests/                  # Frontend tests
│   │   ├── e2e/               # Cypress E2E tests
│   │   └── unit/              # Vitest unit tests
│   └── nuxt.config.ts          # Nuxt configuration
│
├── README.md                    # This file
├── LICENSE                      # Project license
├── .gitignore                  # Git ignore rules
└── docker-compose.yml          # Docker setup (future)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ShinyFlakes
   ```

2. **Install Backend Dependencies**

   ```bash
   cd srv
   npm install
   cp .env.example .env
   # Configure your .env file
   node ace migration:run
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd ../web
   npm install
   ```

4. **Start Development Servers**

   Backend (runs on http://localhost:3333):

   ```bash
   cd srv
   npm run dev
   ```

   Frontend (runs on http://localhost:3000):

   ```bash
   cd web
   npm run dev
   ```

## 🎨 Features Planned

### Core E-commerce Features

- [ ] Product catalog with categories
- [ ] Product search and filtering
- [ ] Shopping cart functionality
- [ ] User authentication (register/login)
- [ ] Order management system
- [ ] Product reviews and ratings
- [ ] User profile management

### Parody Elements

- [ ] Humorous product descriptions
- [ ] Easter eggs from the show
- [ ] Fake "customer reviews"
- [ ] Show-inspired UI elements
- [ ] Mock "vendor ratings"

### Technical Features

- [ ] Responsive design (mobile-first)
- [ ] Server-side rendering with Nuxt
- [ ] API-first architecture
- [ ] Comprehensive testing suite
- [ ] Database migration system
- [ ] Future Supabase integration

## 🧪 Testing

### Running Tests

**Backend Tests:**

```bash
cd srv
npm test
```

**Frontend Unit Tests:**

```bash
cd web
npm run test:unit
```

**End-to-End Tests:**

```bash
cd web
npm run test:e2e
```

## 📊 Database Schema

### Core Models

- **User**: Authentication and profile data
- **Product**: Product information and inventory
- **Order**: Purchase transactions
- **OrderItem**: Individual items within orders
- **Review**: Product reviews and ratings
- **Category**: Product categorization

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - List products with pagination
- `GET /api/products/:id` - Get single product
- `GET /api/categories` - List product categories

### Cart & Orders

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders

## 🎭 Show References

This project pays tribute to "How to Sell Drugs Online (Fast)" by:

- Using similar technology stack (Vue.js, mentioned in the show)
- Incorporating Cypress testing (as referenced in the series)
- Mimicking the e-commerce structure of the fictional website
- Adding Easter eggs and references throughout the application

## 🚧 Development Roadmap

### Phase 1: Foundation ✅

- [x] Project setup and boilerplate
- [x] Basic backend and frontend structure
- [ ] Database models and migrations
- [ ] Basic API endpoints

### Phase 2: Core Features

- [ ] User authentication system
- [ ] Product catalog implementation
- [ ] Shopping cart functionality
- [ ] Order processing system

### Phase 3: Enhancement

- [ ] Review and rating system
- [ ] Search and filtering
- [ ] Mobile responsiveness
- [ ] Performance optimization

### Phase 4: Polish

- [ ] Comprehensive testing
- [ ] UI/UX improvements
- [ ] Show-specific parody elements
- [ ] Documentation completion

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome! Please feel free to:

- Report bugs
- Suggest features
- Share ideas for show references
- Provide code review feedback

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Netflix's "How to Sell Drugs Online (Fast)" for the inspiration
- The Vue.js and AdonisJS communities for excellent documentation
- All the open-source libraries that make this project possible

---

**Remember**: This is a parody project for educational purposes only. No actual products are sold, and all content is purely fictional! 🎭
