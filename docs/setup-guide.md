# Setup & Installation Guide

This guide provides step-by-step instructions for setting up and running the Small E-Commerce Management System from a fresh clone.

---

## 1. System Prerequisites

Ensure your development environment meets the following specifications:

| Requirement | Supported Version | Verification Command |
|---|---|---|
| **PHP** | `^8.3` | `php -v` |
| **Composer** | `^2.2` | `composer -V` |
| **Node.js** | `^20.0` or `^22.0` | `node -v` |
| **NPM** | `^10.0` | `npm -v` |
| **MySQL / MariaDB** | `^8.0` / `^10.4` | `mysql --version` |

---

## 2. Installation Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/small-e-commerce.git
cd small-e-commerce
```

### Step 2: Install PHP Dependencies
```bash
composer install
```

### Step 3: Install Frontend Dependencies
```bash
npm install
```

### Step 4: Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Generate an application encryption key:
```bash
php artisan key:generate
```

Configure your MySQL database connection in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=small_ecommerce
DB_USERNAME=root
DB_PASSWORD=your_password

# Server port configuration
APP_URL=http://localhost:8001
VITE_API_URL=http://localhost:8001/api/v1
```

> [!NOTE]
> Create the database in MySQL if it doesn't already exist:
> ```sql
> CREATE DATABASE small_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> ```

### Step 5: Database Migrations & Seeders
Run all database schema migrations and seed realistic demo data:
```bash
php artisan migrate --seed
```

### Step 6: Compile Frontend Assets
Build production-ready frontend bundles:
```bash
npm run build
```

---

## 3. Running the Project

### Option A: Development Mode (with Live Hot Module Reloading)
Run both backend and Vite dev servers concurrently:
```bash
composer run dev
```
*Or in separate terminal tabs:*
```bash
# Terminal 1: Backend Server
php artisan serve --port=8001

# Terminal 2: Frontend Vite HMR Server
npm run dev
```

### Option B: Production Preview Mode
If assets are compiled via `npm run build`, you only need to run the Laravel backend:
```bash
php artisan serve --port=8001
```
The application will automatically serve the compiled React SPA directly from [public/build](file:///c:/Sushil%20Hemrom/explore/small-e-commerce/public/build).

---

## 4. Default Seeded Accounts

The database seeder automatically creates the following accounts for immediate evaluation:

| Persona | Email | Password | Role | Access Scope |
|---|---|---|---|---|
| **Administrator** | `admin@example.com` | `password123` | `admin` | Admin dashboard: Manage all shops, owners & master catalog |
| **Shop Owner 1** | `tech_owner@example.com` | `password123` | `shop_owner` | Manages **"Tech Haven"** store |
| **Shop Owner 2** | `fashion_owner@example.com` | `password123` | `shop_owner` | Manages **"Urban Trends"** store |
| **Customer** | `customer@example.com` | `password123` | `customer` | Public shopper |

---

## 5. Troubleshooting & FAQs

### Q: Blank page when opening `http://127.0.0.1:8001`
- **Cause:** A stale `public/hot` file was left behind when Vite was previously stopped.
- **Solution:** Either run `npm run dev` to start Vite, or delete `public/hot` and run `npm run build`.

### Q: Vite connection refused or IPv6 mismatch
- **Cause:** Browser looking for `[::1]:5173` while server is on `127.0.0.1`.
- **Solution:** [vite.config.ts](file:///c:/Sushil%20Hemrom/explore/small-e-commerce/vite.config.ts) is preconfigured with `server: { host: '127.0.0.1', port: 5173, cors: true }`. Ensure you access via `http://127.0.0.1:8001`.

### Q: Database Connection Failed
- **Cause:** MySQL service is inactive or credentials mismatch.
- **Solution:** Verify `mysql` is running and `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in `.env` are accurate. Test connection with:
  ```bash
  php artisan db:show
  ```

