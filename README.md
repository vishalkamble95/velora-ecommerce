# MERN E-Commerce Application

A full-stack e-commerce application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The application provides customer shopping functionality and a separate admin panel for managing products and orders.

## 1. Project Overview

This project is an Amazon-like e-commerce application developed as part of a full-stack development assignment.

It supports customer registration, authentication, product browsing, searching, filtering, cart management, checkout, order tracking, and profile management.

It also provides an admin dashboard where administrators can manage their own products and orders.

## 2. Technologies Used

### Frontend
- React.js
- React Router DOM
- React Query (TanStack Query)
- Axios
- React Hook Form
- Zod
- Lucide React
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Zod
- Cookie Parser
- Helmet
- Express Rate Limit
- CORS

## 3. Project Structure

```text
mern-ecommerce/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── index.css
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── .env
│   └── package.json
│
└── README.md
```

## 4. Features

### Customer Features

- User registration and login.
- Secure authentication using JWT stored in an HTTP-only cookie.
- Browse all available products.
- Search products by name.
- Filter products by category.
- Filter products by minimum and maximum price.
- Sort products by price and rating.
- Product pagination.
- View individual product details.
- Add products to cart.
- Update product quantities in cart.
- Remove products from cart.
- Checkout and place orders.
- View order history.
- View individual order details.
- View and manage profile information.

### Admin Features

- Separate admin dashboard.
- View product and order statistics.
- Add new products.
- Edit existing products.
- Delete products.
- Manage products with pagination.
- View and manage orders.
- Update order status.
- Admin-specific product ownership.
- Admin-specific order visibility.

**Admin Ownership:** Each admin can view, update, and delete only products created by that admin. Admin order visibility and status updates are restricted to orders containing products owned by that admin.

### Additional Features

- Responsive UI for desktop, tablet, and mobile.
- Form validation using React Hook Form and Zod.
- Loading and error states.
- Confirmation dialogs for destructive actions.
- Reusable UI components.
- Protected routes and role-based authorization.
- Scroll-to-top navigation when changing pages.

## 5. Application Routes

| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| Products | `/products` | Public |
| Product Details | `/products/:id` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Cart | `/cart` | Customer |
| Checkout | `/checkout` | Customer |
| My Orders | `/orders` | Customer |
| Order Details | `/orders/:id` | Customer |
| Profile | `/profile` | Authenticated |
| Admin Dashboard | `/admin` | Admin |
| Admin Products | `/admin/products` | Admin |
| Admin Orders | `/admin/orders` | Admin |

## 6. Backend API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/profile` | Get logged-in user profile |

### Product APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | Get all public products |
| GET | `/products/categories` | Get product categories |
| GET | `/products/:id` | Get product by ID |
| GET | `/products/admin` | Get products belonging to logged-in admin |
| POST | `/products` | Create product (Admin) |
| PUT | `/products/:id` | Update owned product (Admin) |
| DELETE | `/products/:id` | Delete owned product (Admin) |

Product listing supports:
- Search
- Category filtering
- Minimum and maximum price filtering
- Sorting by price and rating
- Pagination

### Cart APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | Get user's cart |
| POST | `/cart` | Add product to cart |
| PUT | `/cart/:productId` | Update cart item quantity |
| DELETE | `/cart/:productId` | Remove product from cart |

### Order APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Create a new order |
| GET | `/orders` | Get logged-in user's orders |
| GET | `/orders/:id` | Get order details |

### Admin Order APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/orders` | Get orders containing admin-owned products |
| PUT | `/admin/orders/:id` | Update an order's status if it contains admin-owned products |

## 7. Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB
- Git

### Step 1: Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd mern-ecommerce
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Backend Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Replace the MongoDB connection string and JWT secret with your actual values.

### Step 4: Start Backend Server

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

For production:

```bash
npm start
```

### Step 5: Install Frontend Dependencies

Open a new terminal from the project root:

```bash
cd frontend
npm install
```

### Step 6: Configure Frontend Environment Variables

Create a `.env` file inside the `frontend` folder.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 7: Start Frontend Application

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

### Step 8: Create Production Build

To generate the optimized frontend production build:

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Step 9: Run ESLint

To check frontend code for linting issues:

```bash
cd frontend
npm run lint
```

**Note:** Run the frontend and backend in separate terminals during local development.

## 8. Admin Account Setup

Public registration creates regular customer accounts. Admin roles should be assigned securely rather than allowing users to select the admin role during registration.

To create admin accounts for testing:

1. Register two separate user accounts through the application.
2. Open MongoDB Atlas.
3. Navigate to the users collection.
4. Find the registered users.
5. Change the `role` field of the selected accounts to `admin`.

Example:

```json
{
  "role": "admin"
}
```

Log in using each admin account to test admin-specific access.

### Admin Ownership Testing

Create two admin accounts:

- Admin A
- Admin B

Test the following:

| Test | Expected Result |
|---|---|
| Admin A creates a product | Product belongs to Admin A |
| Admin B creates a product | Product belongs to Admin B |
| Admin A views products | Only Admin A's products |
| Admin B views products | Only Admin B's products |
| Admin A updates Admin B's product | Access denied |
| Admin A deletes Admin B's product | Access denied |
| Admin A views orders | Orders containing Admin A's products |
| Admin B views orders | Orders containing Admin B's products |
| Customer browses products | All public products are visible |

## 9. Security Features

- JWT-based authentication.
- HTTP-only authentication cookies.
- Password hashing using bcrypt.
- Protected routes.
- Role-based authorization.
- Zod request validation.
- Helmet security middleware.
- Rate limiting.
- CORS configuration.
- Admin product ownership verification.
- Admin order access verification.

## 10. Database Models

The application uses MongoDB with Mongoose.

Main models:

- **User:** Stores user information, email, password hash, and role.
- **Product:** Stores product information, price, stock, category, rating, and admin ownership (`createdBy`).
- **Cart:** Stores user cart items and quantities.
- **Order:** Stores customer, purchased items, shipping information, payment details, and order status.

Order creation uses a MongoDB transaction for order creation and stock reduction.

## 11. Testing Checklist

### Customer Testing
- [ ] Register a new account.
- [ ] Login and logout.
- [ ] Browse products.
- [ ] Search and filter products.
- [ ] Test product sorting and pagination.
- [ ] View product details.
- [ ] Add products to cart.
- [ ] Update cart quantities.
- [ ] Remove cart items.
- [ ] Place an order.
- [ ] View order history.
- [ ] View order details.
- [ ] Check profile information.

### Admin Testing
- [ ] Login as Admin A.
- [ ] Create, edit, and delete products.
- [ ] Verify product ownership.
- [ ] Login as Admin B.
- [ ] Verify Admin B cannot access Admin A's products.
- [ ] Verify admin order visibility.
- [ ] Update order status.
- [ ] Verify unauthorized order updates are rejected.
- [ ] Verify customers cannot access admin routes.

## 12. Environment Variables and Git

Do not commit `.env` files, database credentials, or JWT secrets to GitHub.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
dist/
```

## 13. Conclusion

This project demonstrates the development of a full-stack e-commerce application using the MERN stack, including authentication, product management, shopping cart functionality, order processing, admin authorization, database integration, and responsive user interfaces.
