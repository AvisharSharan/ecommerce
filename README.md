# ShopHub E-Commerce Platform

A modern online shopping platform where users can browse products, manage their shopping cart, and place orders. Includes an admin dashboard for managing products and orders.

## Features

- 🛍️ Browse and search products
- 🛒 Shopping cart with real-time updates
- 👤 User authentication and profiles
- 📦 Order tracking and history
- ⚙️ Admin dashboard for product and order management
- 📱 Fully responsive design

## Tech Stack

**Frontend**
- React - UI library
- Tailwind CSS - Styling
- Vite - Development tool
- Axios - API calls

**Backend**
- Node.js - Runtime
- Express - Server framework
- MongoDB - Database
- JWT - Authentication

## Getting Started

### What You'll Need
- Node.js installed on your computer
- MongoDB (you can use a free MongoDB Atlas account)

### Installation

1. **Clone this repository**
   ```bash
   git clone <your-repository-url>
   cd ecommerce
   ```

2. **Set up the Backend**
   ```bash
   cd ecommerce-backend
   npm install
   ```
   
   Create a `.env` file:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. **Set up the Frontend**
   ```bash
   cd ecommerce-frontend
   npm install
   ```
   
   Create a `.env` file:
   ```
   VITE_API_URL=http://localhost:5000
   ```

### Running the App

1. **Start the Backend** (in ecommerce-backend folder)
   ```bash
   npm run dev
   ```

2. **Start the Frontend** (in ecommerce-frontend folder)
   ```bash
   npm run dev
   ```

3. Open your browser and go to `http://localhost:5173`

That's it! The app should now be running on your local machine.

---

Built with React, Node.js, Express, and MongoDB
