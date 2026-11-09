# Candidate Task Evaluation Checklist

Use this checklist to perform pre-submission verification against the requirements defined by the evaluation team.

---

## 1. Functional Requirements Matrix

### A. Admin Panel
- [ ] **Admin Authentication:** Admin can log in using seeded credentials (`admin@example.com` / `password123`) and access `/admin/dashboard`.
- [ ] **Shop Management (CRUD):**
  - [ ] **Create:** Admin can create a new shop with name, description, address, and assign an existing shop owner.
  - [ ] **Read:** Admin can list all shops with search and pagination.
  - [ ] **Update:** Admin can edit shop details, change status, or reassign owner.
  - [ ] **Delete:** Admin can delete a shop (with cascade cleanup of assigned listings).
- [ ] **Product Management (CRUD for Shared Catalog):**
  - [ ] **Create:** Admin can add a new product directly to the master shared catalog.
  - [ ] **Read:** Admin can list all master products with SKU, base price, and category.
  - [ ] **Update:** Admin can edit master product title, default description, base price, and image.
  - [ ] **Delete:** Admin can remove master product.
- [ ] **Create and Manage Shop Owner Accounts:**
  - [ ] Admin can view all users registered as `shop_owner`.
  - [ ] Admin can create a new shop owner account with name, email, and password.

---

### B. Shop Management (Shop Owner Portal)
- [ ] **Browse Shared Catalog:**
  - [ ] Shop owner can access `/shop-owner/catalog` (or `/manager/catalog`).
  - [ ] Products created by Admin **and** products created by other Shop Owners appear in the shared list.
  - [ ] Each item shows whether it is already added to the owner's shop.
- [ ] **Add Products to Shop:**
  - [ ] Shop owner can click "Add to My Shop" on any catalog item.
  - [ ] Immediate insertion into `shop_products` for their store.
- [ ] **Create Own Products:**
  - [ ] Shop owner can create a new product from scratch.
  - [ ] The created product appears in the shared catalog (available to other shop owners).
  - [ ] The created product is automatically listed in the creator's shop.
- [ ] **Set or Modify Shop-Specific Overrides:**
  - [ ] Shop owner can open override editor on any listed product.
  - [ ] **Price Override:** Can set custom selling price different from master catalog price.
  - [ ] **Details Override:** Can set custom product description/details.
  - [ ] **Thumbnail Override:** Can upload or specify a custom thumbnail image.
  - [ ] Changes do not affect the master catalog or other shops listing the same item.

---

### C. Customer View (Storefront)
- [ ] **Shop-Scoped Browsing:**
  - [ ] Customer visits `/shops` and chooses a specific shop (e.g. `/shops/tech-haven`).
  - [ ] Storefront displays the shop's brand header (name, description, logo).
- [ ] **Strict Product Filtering:**
  - [ ] Customer **only** sees products assigned to the active shop.
  - [ ] Products that exist only in the master catalog and have not been assigned to this shop are **strictly not visible**.
- [ ] **Display Shop-Specific Information:**
  - [ ] Shows the shop's overridden price (or fallback default if not overridden).
  - [ ] Shows the shop's overridden details (or fallback default).
  - [ ] Shows the shop's overridden thumbnail (or fallback default).
- [ ] **Direct URL Protection:**
  - [ ] Navigating directly to `/shops/{shop:slug}/products/{unassigned_id}` returns a `404 Not Found`.

---

## 2. Technology & Code Quality Standards

- [ ] **Backend Framework:** Laravel 12 on PHP 8.3.
- [ ] **Frontend Framework:** React 19 with TypeScript and Tailwind CSS v4.
- [ ] **Database Engine:** MySQL 8.0+ compatible migrations and Eloquent models.
- [ ] **Monolithic Structure:** Cleanly integrated into `resources/js`, compiling via Vite without separate server deployment friction.
- [ ] **Automated Testing:** Feature tests verify route guards, shared catalog logic, and customer isolation. Run:
  ```bash
  php artisan test
  ```
- [ ] **Code Styling:** Formatted with Laravel Pint:
  ```bash
  vendor/bin/pint --format agent
  ```

---

## 3. Submission Deliverables

- [ ] **Public GitHub Repository:** Repository is set to Public visibility.
- [ ] **Complete Git History:** All files committed, `.gitignore` preserves essential code and excludes `node_modules` and `vendor`.
- [ ] **Clear README.md:**
  - [ ] Prerequisites listed.
  - [ ] Fresh setup commands (`composer install`, `npm install`, `php artisan migrate --seed`, `npm run build`, `php artisan serve`).
  - [ ] Default test accounts listed with email and passwords.
- [ ] **Email to Evaluator:**
  - [ ] **Recipient:** `career@csnbangladesh.com`
  - [ ] **Subject:** Small E-commerce Management - Candidate Task Submission
  - [ ] **Body:** Public GitHub repository link + brief summary of features and default login credentials.

