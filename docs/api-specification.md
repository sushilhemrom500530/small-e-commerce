# RESTful API Specification

Base URL: `http://localhost:8001/api/v1`

All responses follow a consistent envelope structure:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation completed successfully.",
  "results": { ... }
}
```

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user and returns a JWT token with their role.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response `200 OK`:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful.",
  "results": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

---

### `GET /auth/me`
Retrieves the profile of the authenticated user.

**Headers:**
`Authorization: Bearer <jwt_token>`

**Response `200 OK`:**
```json
{
  "statusCode": 200,
  "success": true,
  "results": {
    "id": 2,
    "name": "Rahim Shopkeeper",
    "email": "owner1@example.com",
    "role": "shop_owner",
    "shop": {
      "id": 1,
      "name": "Tech Haven",
      "slug": "tech-haven"
    }
  }
}
```

---

## 2. Administrator Endpoints

Guarded by: `jwt.auth:admin`

### `GET /admin/dashboard-stats`
Retrieves high-level counts and metrics.

**Response `200 OK`:**
```json
{
  "statusCode": 200,
  "success": true,
  "results": {
    "totalShops": 4,
    "totalShopOwners": 4,
    "totalCatalogProducts": 28,
    "totalAssignedListings": 52
  }
}
```

---

### `GET /admin/shops`
Lists all registered shops with assigned owner details.

**Query Parameters:**
- `search`: Filter by shop name or slug
- `page`: Page number (default: 1)

---

### `POST /admin/shops`
Creates a new shop and assigns an owner.

**Request Body:**
```json
{
  "name": "Gadget World",
  "slug": "gadget-world",
  "user_id": 3,
  "description": "Authorized retailer for consumer electronics.",
  "address": "Banani, Dhaka",
  "phone": "+8801700000000"
}
```

---

### `PUT /admin/shops/{id}`
Updates shop metadata or reassigns owner.

---

### `DELETE /admin/shops/{id}`
Removes a shop and cascades its product listings.

---

### `GET /admin/shop-owners`
Lists all users with `role = 'shop_owner'`.

---

### `POST /admin/shop-owners`
Creates a new shop owner account.

**Request Body:**
```json
{
  "name": "Kamal Ahmed",
  "email": "kamal@example.com",
  "password": "Password123!",
  "phone_number": "+8801811111111"
}
```

---

### `POST /admin/products`
Adds a master product directly to the shared catalog.

**Request Body:**
```json
{
  "name": "Wireless Noise-Canceling Earbuds",
  "sku": "EAR-NC-001",
  "category": "Electronics",
  "default_price": 59.99,
  "default_description": "True wireless earbuds with ANC.",
  "default_image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df"
}
```

---

## 3. Shop Owner Endpoints

Guarded by: `jwt.auth:shop_owner`

### `GET /shop-owner/my-shop`
Retrieves the store profile for the currently logged-in shop owner.

---

### `GET /shop-owner/catalog`
Browses the shared master catalog.

**Query Parameters:**
- `search`: Search title, SKU, or category.
- `category`: Filter by category.
- `page`: Pagination page.

**Response `200 OK`:**
```json
{
  "statusCode": 200,
  "success": true,
  "results": {
    "data": [
      {
        "id": 14,
        "name": "Mechanical Keyboard RGB",
        "sku": "KB-RGB-01",
        "category": "Electronics",
        "default_price": 75.00,
        "default_description": "Mechanical gaming keyboard with blue switches.",
        "default_image": "https://example.com/keyboard.jpg",
        "author": { "name": "Super Admin", "role": "admin" },
        "is_in_my_shop": false
      }
    ]
  }
}
```

---

### `POST /shop-owner/catalog`
Allows a shop owner to create a new product.  
*The item is added to the shared master catalog AND automatically listed in the owner's shop.*

**Request Body:**
```json
{
  "name": "Custom Ergonomic Mouse",
  "sku": "MOU-ERG-09",
  "category": "Accessories",
  "default_price": 45.00,
  "default_description": "High precision wireless ergonomic mouse.",
  "custom_price": 42.50,
  "stock": 20
}
```

---

### `POST /shop-owner/my-products`
Adds an existing catalog item to the shop owner's store.

**Request Body:**
```json
{
  "product_id": 14,
  "custom_price": 69.99,
  "custom_details": "Includes extra keycap puller and wrist rest.",
  "custom_thumbnail": null,
  "stock": 15
}
```

---

### `PUT /shop-owner/my-products/{id}`
Updates shop-specific overrides for a listed product.

**Request Body:**
```json
{
  "custom_price": 64.99,
  "custom_details": "Flash sale discount this weekend only!",
  "custom_thumbnail": "https://example.com/custom-boxed-photo.jpg",
  "stock": 10,
  "is_active": true
}
```

---

### `DELETE /shop-owner/my-products/{id}`
Removes the product from this shop's customer view.  
*(Does NOT delete the item from the shared catalog pool).*

---

## 4. Public Customer Storefront Endpoints

Public access (no authentication token required).

### `GET /shops`
Lists all public active shops for the directory/homepage.

**Response `200 OK`:**
```json
{
  "statusCode": 200,
  "success": true,
  "results": [
    {
      "id": 1,
      "name": "Tech Haven",
      "slug": "tech-haven",
      "description": "Premium electronics and computer gear.",
      "logo": "https://example.com/tech-logo.png",
      "products_count": 18
    }
  ]
}
```

---

### `GET /shops/{slug}`
Returns shop profile and the list of products assigned to it with their shop-specific prices and thumbnails.

**Response `200 OK`:**
```json
{
  "statusCode": 200,
  "success": true,
  "results": {
    "shop": {
      "id": 1,
      "name": "Tech Haven",
      "slug": "tech-haven",
      "description": "Premium electronics and computer gear."
    },
    "products": [
      {
        "id": 101,
        "product_id": 14,
        "name": "Mechanical Keyboard RGB",
        "sku": "KB-RGB-01",
        "price": 64.99,
        "description": "Flash sale discount this weekend only!",
        "thumbnail": "https://example.com/custom-boxed-photo.jpg",
        "stock": 10
      }
    ]
  }
}
```

---

### `GET /shops/{slug}/products/{productId}`
Returns single product details within a shop.

> [!NOTE]
> Returns `404 Not Found` if the requested product is not assigned to the shop.

