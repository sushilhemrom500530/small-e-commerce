# Multi-Shop E-Commerce Management System

[![Laravel](https://img.shields.io/badge/Laravel-11%2B-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing-success?style=for-the-badge&logo=checkmarx&logoColor=white)]()

A comprehensive **Multi-Shop E-Commerce Management System** built with **Laravel**, **React (TypeScript)**, **Redux Toolkit (RTK Query)**, and **Tailwind CSS**. 

The system enables system administrators to manage shops and master products, while shop owners manage their individual storefronts through a **Shared Product Catalog** with full autonomy to set custom prices, custom descriptions, and shop-specific thumbnails.

---

## Key Functional Features

### 1. Admin Panel
* **Secure Authentication & RBAC**: Dedicated administrative role (`admin`) with protected routes.
* **Shop Management (CRUD)**: Create, view, update status, and manage registered shops with owner assignments.
* **Master Product Catalog (CRUD)**: Create and maintain central product catalog items (name, master category, base description, master thumbnail).
* **Shop Owner Management**: Create and oversee shop owner accounts, associating them with designated shops.

### 2. Shop Owner Panel
* **Shared Catalog Browser**: Shop owners browse the global product catalog and selectively add products to their own shop.
* **Product Creation into Shared Catalog**: Products created by a shop owner are automatically made available to all other merchants in the shared catalog, fostering inventory syndication.
* **Shop-Level Overrides**:
  * Set independent shop-specific retail prices (e.g., Shop A sells Samsung Galaxy A56 at ৳45,000 while Shop B lists it at ৳46,500).
  * Customize product details/specifications for their storefront.
  * Upload or assign shop-specific marketing thumbnails, gracefully falling back to master catalog media if uncustomized.
* **Shop Profile Customization**: Update shop name, description, and storefront branding.

### 3. Customer Storefront
* **Strict Shop-Level Isolation**: Customers only see products assigned to a shop (`shop_products`).
* **Unassigned Products Hidden**: Master catalog items not assigned to any shop are strictly invisible to storefront visitors.
* **Shop-Specific Pricing & Media**: Customers view the merchant's customized price, thumbnail, and details.
* **Multi-Shop Directory**: Public directory of verified shops with search, filtering, and instant storefront access (`/shops` & `/shops/:slug`).

---

## Architecture & Database Design

### Database ERD / Schema

```
+--------------------+       1:N       +---------------------+
|       users        |<----------------|        shops        |
|--------------------|                 |---------------------|
| id (PK)            |                 | id (PK)             |
| name               |                 | owner_id (FK->users)|
| email              |                 | name, slug          |
| role (admin/shop_o)|                 | status, logo        |
+--------------------+                 +---------------------+
          |                                       |
      1:N | (created_by)                      1:N |
          v                                       v
+--------------------+       1:N       +---------------------+
|      products      |<----------------|    shop_products    |
| (Shared Catalog)   |                 | (Shop Listing & O/R)|
|--------------------|                 |---------------------|
| id (PK)            |                 | id (PK)             |
| category_id (FK)   |                 | shop_id (FK->shops) |
| created_by (FK)    |                 | product_id (FK->prod|
| name, description  |                 | price (Custom Price)|
| thumbnail          |                 | details (Custom)    |
+--------------------+                 | thumbnail (Custom)  |
                                       | is_active           |
                                       +---------------------+
```

### Conventions
* **Backend API Payloads**: Consistent **`camelCase`** JSON responses (`shopSlug`, `effectiveThumbnail`, `effectiveDetails`, `productsCount`, `isCustomized`).
* **State Management**: Redux Toolkit Query (`RTK Query`) with automated cache invalidation tags (`catalog`, `shopProduct`, `shop`, `storefront`).

---

## System Requirements

* **PHP**: `>= 8.2` or `8.3`
* **Composer**: `>= 2.2`
* **Node.js**: `>= 18.x` & **npm**: `>= 9.x`
* **Database**: **PostgreSQL** or **MySQL** (`>= 8.0`)
* **Web Server**: Built-in Artisan server or Nginx/Apache

---

## Step-by-Step Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/sushilhemrom500530/small-e-commerce.git
cd small-e-commerce
```

### 2. Install Backend Dependencies
```bash
composer install
```

### 3. Environment Setup
Copy the sample environment file and generate the application key:
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configure Database
Open `.env` and set your database connection details. For example:

**For PostgreSQL:**
```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=small_e_commerce
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

**Or For MySQL:**
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=small_e_commerce
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create the database in your database engine if it doesn't already exist.

### 5. Run Database Migrations & Seeders
This creates the schema and seeds demo accounts (admin, shop owners, customers, categories, shops, and products):

```bash
# Using npm script:
npm run seed:fresh

# Or using Laravel Artisan:
php artisan migrate:fresh --seed
```

### 6. Install Frontend Dependencies & Build
```bash
npm install
npm run build
```
*(For active frontend development with Hot Module Replacement, run `npm run dev` in a separate terminal).*

### 7. Start the Application Server
```bash
php artisan serve
```

The application is now live at: **`http://127.0.0.1:8000`**

---

## 🔑 Demo & Test Credentials

The database seeder automatically creates the following demo credentials:

| Role | Name | Email | Password | Assigned Shop / Role Details |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | Super Administrator | `admin@gmail.com` | `12345678` | Master Administrative Access |
| **Shop Owner 1** | John Tech | `shopowner@gmail.com` | `12345678` | Shop: **Tech World** |
| **Shop Owner 2** | Sarah Fashion | `shopper@gmail.com` | `12345678` | Shop: **Fashion Hub** |
| **Customer 1** | Alice Customer | `customer@example.com` | `12345678` | Verified Storefront Customer |
| **Customer 2** | John Doe | `john.customer@example.com` | `12345678` | Verified Storefront Customer |
| **Customer 3** | Emily Watson | `emily.customer@example.com` | `12345678` | Verified Storefront Customer |

---

## 🧪 Assessment Walkthrough & Verification Guide

Follow these step-by-step verification flows to evaluate all functional requirements:

#### Step A: Customer Isolation Check
1. Open `http://localhost:8000/shops` to view all registered partner shops.
2. Click **Tech World** (`/shops/tech-world`). Notice that `Samsung Galaxy A56` is listed at **৳45,000**.
3. Go back to `/shops` and click **Fashion Hub** (`/shops/fashion-hub`). Notice the same `Samsung Galaxy A56` is listed at **৳46,500** with custom details.
4. **Notice**: The product `Stainless Steel Smart Thermos` (which exists in the master catalog but has not been assigned to any shop) is **completely hidden** from both storefronts.

#### Step B: Shop Owner Shared Catalog & Custom Listing
1. Log in as `shopper@gmail.com` or `shopowner@gmail.com` (`12345678`) at `http://localhost:8000/auth/login`.
2. Go to **Catalog** (`/shop-owner/dashboard/catalog`).
3. Find an unadded product (e.g., `Stainless Steel Smart Thermos`) and click **"Add to My Shop"**.
4. Set your custom price (e.g., `৳1,850`) and custom description.
5. Visit the Fashion Hub storefront at `/shops/fashion-hub`. The product is now instantly visible to customers at your custom price!

#### Step C: Shop Owner Product Creation (Auto-Catalog)
1. In the Shop Owner panel, go to **My Products** (`/shop-owner/dashboard/products`) and click **"New Product"**.
2. Create a new product.
3. Switch to another shop owner or admin: notice this newly created product is now available in the shared catalog for all merchants!

---

## Project Directory Structure

```
├── app/
│   ├── Enums/
│   │   └── UserRole.php              # Strict roles: admin, shop_owner, customer
│   ├── Http/
│   │   ├── Controllers/Api/          # Clean, single-responsibility API controllers
│   │   │   ├── AdminShopController.php
│   │   │   ├── AdminProductController.php
│   │   │   ├── AdminShopOwnerController.php
│   │   │   ├── ShopCatalogController.php
│   │   │   ├── ShopProductController.php
│   │   │   ├── ShopProfileController.php
│   │   │   └── StorefrontController.php
│   │   └── Resources/                # camelCase API resource transformations
│   │       ├── ShopResource.php
│   │       ├── ProductResource.php
│   │       └── ShopProductResource.php
│   └── Models/
│       ├── Shop.php
│       ├── Product.php
│       ├── ShopProduct.php           # Pivot with effectiveThumbnail & effectiveDetails
│       └── User.php
├── database/
│   ├── migrations/                   # Clean schema migrations
│   └── seeders/DatabaseSeeder.php    # Complete realistic seed data
├── resources/js/
│   ├── redux/
│   │   └── features/ecommerce/       # Full RTK Query hooks and API cache tags
│   ├── routes/                       # Role-based protected routes
│   └── view/
│       ├── admin/                    # Admin Shops, Products, Shop Owners
│       ├── shop-owner/               # Shared Catalog, Shop Listings, Shop Profile
│       ├── shops/                    # Public shop directory
│       └── storefront/               # Customer shop storefront view
├── routes/
│   └── api.php                       # Restful API endpoints under /api/v1
└── tests/Feature/
    └── MultiShopEcommerceTest.php    # Verification test suite
```

---

## Contact & Submission

* **Recipient**: `career@csnbangladesh.com`
* **Assessment**: CSN Bangladesh Ltd — Small E-commerce Management
* **Author**: Sushil Hemrom
