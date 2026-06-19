# Orbit — Full-Stack E-Commerce Web App

A complete online store built for a full-stack web development assignment: product catalog, cart, checkout, JWT authentication, role-based access (Admin/User), and a REST API backed by MongoDB.

**Developed by Jonsia C. John**

🔗 **Live app:** https://ephemeral-lebkuchen-cd2521.netlify.app/
🔗 **Live API:** https://orbit-ecommerce.onrender.com/api/products
🔗 **Repo:** https://github.com/jo-123456/Orbit-ecommerce

> Note: the backend is on Render's free tier, so the very first request after a period of inactivity can take ~30 seconds to wake up.

## Tech stack

- **Frontend:** React 18 + Vite, React Router, Axios, custom CSS (no UI framework)
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing

## Features

- Product catalog with search and category filtering
- Product detail pages with stock-aware quantity selection
- Persistent cart (per-browser) and a full checkout flow with shipping details
- User registration/login and a "My Orders" page with live order status
- Admin dashboard: add/edit/delete products, view all orders, update order status
- Role-based route protection on both the frontend and the backend API
- Clean inventory handling: stock decrements automatically when an order is placed
- "Added to cart" toast notification on every add-to-cart click

## Folder structure

```
ecommerce-app/
├── backend/          Express API + MongoDB models
│   ├── config/db.js
│   ├── models/       User.js, Product.js, Order.js
│   ├── middleware/auth.js
│   ├── routes/       authRoutes.js, productRoutes.js, orderRoutes.js
│   ├── seed.js        seeds demo products + an admin/user login
│   └── server.js
└── frontend/          React + Vite app
    └── src/
        ├── api/axios.js
        ├── context/  AuthContext.jsx, CartContext.jsx
        ├── components/
        └── pages/    Home, ProductDetail, Cart, Checkout, MyOrders, admin/...
```

## 1. Get a MongoDB connection string

The easiest option is a free MongoDB Atlas cluster:

1. Create a free account/cluster at https://www.mongodb.com/cloud/atlas
2. Under **Database Access**, create a user and password
3. Under **Network Access**, allow access from anywhere (0.0.0.0/0) for development
4. Click **Connect → Drivers** and copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/orbit?retryWrites=true&w=majority`

(If you already have MongoDB running locally, `mongodb://localhost:27017/orbit` also works.)

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:

```
MONGODB_URI=your_connection_string_from_step_1
JWT_SECRET=any_long_random_string
PORT=5000
```

Seed the database with demo products and two ready-made logins:

```bash
npm run seed
```

This creates:
- **Admin login:** admin@orbit.com / admin123
- **User login:** user@orbit.com / user1234

Start the API:

```bash
npm run dev
```

It runs on `http://localhost:5000`. Check `http://localhost:5000/api/health` to confirm it's up.

## 3. Run the frontend

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The frontend talks to the API at the URL set in `VITE_API_URL` (defaults to `http://localhost:5000/api`).

## API reference

| Method | Endpoint              | Access        | Description                       |
|--------|-----------------------|---------------|------------------------------------|
| POST   | /api/auth/register     | Public        | Create an account                  |
| POST   | /api/auth/login        | Public        | Log in, returns a JWT              |
| GET    | /api/auth/me            | Logged in     | Get current user                   |
| GET    | /api/products           | Public        | List products (supports `?search=` and `?category=`) |
| GET    | /api/products/:id       | Public        | Get one product                    |
| POST   | /api/products           | Admin only    | Create a product                   |
| PUT    | /api/products/:id       | Admin only    | Update a product                   |
| DELETE | /api/products/:id       | Admin only    | Delete a product                   |
| POST   | /api/orders             | Logged in     | Place an order (checkout)          |
| GET    | /api/orders/my          | Logged in     | Get your own orders                |
| GET    | /api/orders             | Admin only    | Get all orders                     |
| PUT    | /api/orders/:id/status   | Admin only    | Update an order's status           |

## How this app is actually deployed

**Backend → Render**
- Root directory: `ecommerce-app/backend`
- Build command: `npm install` · Start command: `npm start`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT=5000`
- Live at: https://orbit-ecommerce.onrender.com

**Frontend → Netlify**
- A `netlify.toml` at the repo root configures the build:
  ```toml
  [build]
    base    = "ecommerce-app/frontend"
    command = "npm run build"
    publish = "dist"

  [[redirects]]
    from   = "/*"
    to     = "/index.html"
    status = 200
  ```
- Environment variable: `VITE_API_URL = https://orbit-ecommerce.onrender.com/api`
- Live at: https://ephemeral-lebkuchen-cd2521.netlify.app/

**Database → MongoDB Atlas**
- Free M0 cluster, seeded via `npm run seed` from the backend folder

## Notes for your project report

- Authentication: passwords are hashed with bcrypt before saving; logins return a signed JWT stored in `localStorage` and sent as a `Bearer` token on protected requests.
- Authorization: an `adminOnly` Express middleware blocks non-admins from product/order management routes; the React side mirrors this with `ProtectedRoute` and `AdminRoute` wrapper components so the UI hides admin-only pages too.
- Data model: `User`, `Product`, and `Order` are separate Mongoose collections; each `Order` stores a snapshot of item name/price/image at purchase time, so historical orders stay accurate even if a product is later edited or removed.
