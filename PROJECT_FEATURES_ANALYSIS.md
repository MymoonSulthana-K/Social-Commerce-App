# Social Commerce App - Features & Capabilities Analysis

## 1. USER-FACING FEATURES

### Authentication & Account Management
- **User Registration**: Create account with name, email, password
- **User Login**: Authentication with JWT token storage
- **User Profile**: View account details (name, email)
- **Logout**: Clear authentication token

### Product Browsing & Discovery
- **Homepage**: Featured products display with category filtering and search
- **Product Catalog**: 
  - Browse all products
  - Filter by major categories (Men, Women)
  - Filter by subcategories (Men Suits, Men Ties, Men Shoes, Men Watches, Business Suits, Women Footwear, Formal Bags, Office Watches, Bags)
  - Search products by name
  - Search alias support (e.g., "womens" → "women", "suit" → "men suits")
- **Product Details**: 
  - View individual product information
  - Product name, price, description, category, subcategory, tags, image
  - Add to cart from product detail view

### Shopping Cart
- **Add to Cart**: Add products with quantity selection
- **View Cart**: See all items with prices and quantities
- **Update Quantity**: Increase/decrease item quantities
- **Remove Items**: Remove specific products from cart
- **Clear Cart**: Remove all items at once
- **Cart Persistence**: Cart associated with authenticated user

### Checkout & Payment
- **Checkout Page**: 
  - Review cart items with images and prices
  - Shipping information collection (name, email, phone, address, city, zipcode)
  - Payment method selection (card)
  - Real-time total calculation with shipping fees
  - Free shipping on orders > ₹500
- **Order Placement**: Submit order with all details
- **Order Confirmation**: Confirmation page showing order details

### Order Management
- **Order History**: View all past orders with dates, totals, statuses
- **Order Tracking**: See individual order details and status
- **Order Statuses**: Track orders (initial status: "Placed")
- **Order Timeline**: View purchase history formatted by date

### Referral & Social Commerce
- **Referral Program** (Core Social Feature):
  - Share product referral links with friends
  - Create time-limited 24-hour referral codes
  - Product-specific referrals (can refer different products)
  - Track referral status for each product
  - **Reward Mechanism**: 
    - When 3 friends buy the referred product → referrer gets 50% discount on that product
    - Discounts apply automatically at checkout
    - Discount only available if referral completed (3 buyers)
- **Referral Modal**: UI component for sharing referral links
- **Referral Status Checking**: Real-time check if product meets referral completion criteria

---

## 2. ADMIN FEATURES

### Admin Authentication
- **Admin Login**: Separate authentication endpoint for admins
- **Admin Token Management**: JWT token for admin session
- **Admin Role Protection**: Routes protected with `adminOnly` middleware

### Dashboard & Analytics
- **Admin Dashboard**:
  - Total users count
  - Total products count
  - Total orders count
  - Revenue metrics (implied)
  - Formatted currency display (INR)

### Product Management
- **View All Products**: List all products with pagination/filtering
- **Create Product**: Add new products with:
  - Name, price, description
  - Parent category, category, subcategory
  - Tags
  - Product image
- **Update Product**: Modify existing product details
- **Delete Product**: Remove products from catalog
- **Product Search/Filter**: Find products in admin panel

### Category Management
- **View Categories**: List all categories with subcategories
- **Create Category**:
  - Category name (unique)
  - Category slug (unique)
  - Add subcategories with names and slugs
- **Update Category**: Modify category and subcategory information
- **Delete Category**: Remove categories from system
- **Hierarchical Structure**: Support for parent categories and subcategories

### User Management
- **View All Users**: List all registered users
- **View User Details**: Access individual user information (name, email, role)
- **User Search/Filter**: Find specific users

### Order Management
- **View All Orders**: List all orders placed in system
- **View Order Details**: 
  - Shipping information
  - Items ordered with quantities and prices
  - Payment method
  - Order status
  - Customer information
- **Update Order Status**: Change order status (e.g., from "Placed" to in-transit, delivered, etc.)
- **Order Filtering/Search**: Find specific orders

### Referral Analytics
- **View Referrals**: Track all referral campaigns
- **Referral Metrics**:
  - Referrer information
  - Product being referred
  - Referral code
  - Expiration time
  - Buyers (users who purchased through referral)
  - Completion status
  - Discount application tracking

---

## 3. KEY WORKFLOWS & FLOWS

### Workflow 1: User Registration & Authentication
```
1. User visits /register
2. Enters name, email, password
3. POST /auth/register
4. System creates user account (default role: "customer")
5. User redirected to /login
6. Enters email and password
7. POST /auth/login
8. JWT token returned and stored in localStorage
9. User logged in, can access protected routes
```

### Workflow 2: Product Browsing & Search
```
1. User visits home or /catalog
2. System fetches GET /products (all products)
3. User selects category/major category filters
4. Requests GET /products?category=Men or ?subCategory=Men%20Suits
5. Results filtered and displayed
6. User enters search query
7. Frontend filters products by name (with alias support)
8. User clicks product → /product-details/:id
9. Gets GET /products/:id for full product details
```

### Workflow 3: Shopping & Cart Management
```
1. User clicks "Add to Cart" on product
2. POST /cart/add with productId and quantity
3. System creates/updates cart for user
4. User navigates to /cart
5. GET /cart/cart retrieves cart with all items
6. User can:
   - Adjust quantities: POST /cart/update
   - Remove items: POST /cart/remove
   - Clear cart: POST /cart/clear
7. User proceeds to checkout → /checkout
```

### Workflow 4: Checkout & Order Placement
```
1. Checkout page loads, retrieves cart via GET /cart/cart
2. For each cart item:
   - Checks GET /referral/status/:productId
   - If referral completed → applies 50% discount
3. Calculates total with dynamic discounts + shipping fee (₹50 or free if > ₹500)
4. User enters shipping info (name, email, phone, address, city, zipcode)
5. Selects payment method (card)
6. Submits order
7. POST /orders/create with all order details + referral code if applicable
8. Order created with status "Placed"
9. Redirect to /order-confirmation showing order details
```

### Workflow 5: Order Tracking
```
1. User navigates to /orders
2. System retrieves GET /orders/my-orders (all user's orders)
3. Displays order list with:
   - Order date
   - Total amount (formatted INR)
   - Order status
   - Items purchased
4. User clicks order → /order/:id
5. Gets GET /orders/:id for full order details
6. Displays shipping info, items, payment method, total
```

### Workflow 6: Referral Program (Social Commerce Core)
```
A. INITIATING REFERRAL
1. User on home or product page sees "Share a Product" feature
2. User clicks ReferralModal for a product
3. User shares referral link with friends
4. POST /referral/start creates referral with:
   - Referrer ID (user who initiated)
   - Product ID
   - Unique referral code
   - 24-hour expiration
   - isCompleted: false initially
5. Referral code / link shared with friends

B. FRIEND PURCHASES WITH REFERRAL
1. Friend clicks referral link with ?ref=CODE parameter
2. Friend browses, adds product to cart, checks out
3. During checkout, referral code preserved
4. Order created with referralCode field
5. Friend completes purchase

C. REFERRAL COMPLETION (3 BUYERS)
1. When 3 unique buyers purchase product via same referral
2. Referral marked isCompleted: true
3. Referrer now eligible for 50% discount on that product

D. REFERRER GETS DISCOUNT
1. When referrer (original sharer) adds product to cart
2. Checks GET /referral/status/:productId
3. If isCompleted: true, 50% discount applied at checkout
4. Invoice shows discounted price
```

### Workflow 7: Admin Dashboard Access
```
1. Admin visits /admin/login (separate from user login)
2. Enters admin credentials
3. POST /auth/admin/login returns admin token
4. Token stored as "adminToken" in localStorage
5. Admin token provides access to admin routes (protected by adminOnly middleware)
6. Admin accesses /admin/dashboard
7. GET /admin/dashboard returns stats and metrics
```

### Workflow 8: Admin Product Management
```
1. Admin navigates to /admin/products
2. GET /admin/products lists all products
3. Admin can:
   - Create: POST /admin/products with product details
   - Update: PUT /admin/products/:id with new details
   - Delete: DELETE /admin/products/:id
4. Changes immediately reflected in user-facing catalog
```

### Workflow 9: Admin Order Management
```
1. Admin navigates to /admin/orders
2. GET /admin/orders lists all orders from all users
3. Admin can:
   - View order: GET /admin/orders/:id (full details)
   - Update status: PUT /admin/orders/:id/status (change order status)
4. Status updates visible to corresponding users in their order history
```

### Workflow 10: Admin Category Management
```
1. Admin accesses category management
2. GET /admin/categories lists all categories with subcategories
3. Admin can:
   - Create: POST /admin/categories with name, slug, subcategories
   - Update: PUT /admin/categories/:id
   - Delete: DELETE /admin/categories/:id
4. Category changes affect product filtering and catalog organization
```

### Workflow 11: Admin User & Referral Analytics
```
1. Admin views users: GET /admin/users (all registered users)
2. Admin views user details: GET /admin/users/:id
3. Admin views referrals: GET /admin/referrals
4. Sees referral metrics:
   - Referrer information
   - Product being referred
   - Number of buyers
   - Completion status
   - Referral codes and expiration
```

---

## 4. DATA MODEL RELATIONSHIPS

### User Model
```
- name: String
- email: String (unique)
- password: String (hashed)
- role: String ("customer" | "admin")
- timestamps: createdAt, updatedAt
```

### Product Model
```
- name: String
- price: Number
- description: String
- parentCategory: String (e.g., "Men", "Women")
- category: String (e.g., "Men Suits", "Women Footwear")
- subcategory: String
- tags: Array[String]
- image: String (URL/path)
- timestamps: createdAt, updatedAt
```

### Cart Model
```
- user: ObjectId (references User, unique per user)
- items: Array[
    - productId: ObjectId (references Product)
    - name: String
    - price: Number
    - image: String
    - quantity: Number
  ]
```

### Order Model
```
- user: ObjectId (references User)
- items: Array[
    - productId: ObjectId (references Product)
    - name: String
    - price: Number
    - image: String
    - quantity: Number
  ]
- shippingInfo: Object
  - name, email, phone, address, city, zipCode
- paymentMethod: String ("card", etc.)
- totalAmount: Number
- status: String (default: "Placed")
- referralCode: String (nullable, links to Referral)
- createdAt: Date (default: now)
```

### Category Model
```
- name: String (unique, trimmed)
- slug: String (unique, trimmed)
- subcategories: Array[
    - name: String
    - slug: String
  ]
- timestamps: createdAt, updatedAt
```

### Referral Model
```
- referrerId: ObjectId (references User who initiated)
- productId: ObjectId (references Product being referred)
- referralCode: String (unique)
- expiresAt: Date (24 hours from creation)
- buyers: Array[ObjectId] (references Users who bought via this referral)
- isCompleted: Boolean (true when 3+ unique buyers)
- discountApplied: Boolean (tracking if discount processed)
- timestamps: createdAt, updatedAt
```

---

## 5. TECHNOLOGY STACK

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (Bearer tokens)
- **Deployment**: Vercel

### Frontend
- **Framework**: React.js
- **Routing**: React Router v6
- **HTTP Client**: Fetch API
- **Icons**: Lucide React
- **Styling**: CSS (modular stylesheets)
- **Build**: Create React App (with build output)

### API Communication
- **Base URL**: Configurable via `config.js`
- **Auth Headers**: JWT tokens in localStorage (separate `token` for users, `adminToken` for admins)
- **Error Handling**: Validated JSON responses with error messages

---

## 6. DEMONSTRATION SCRIPT SCENARIOS

### Scenario 1: Complete User Journey (15-20 mins)
1. Register new account
2. Browse products with filters and search
3. View product details
4. Add items to cart (multiple products)
5. Modify cart (update quantities, remove items)
6. Checkout with shipping details
7. Complete order placement
8. View order in order history
9. Initiate referral for a product

### Scenario 2: Referral Program Demo (10-15 mins)
1. User A creates referral for Product X (with share link)
2. Friends B, C, D receive link
3. Friend B purchases Product X using referral link
4. Friend C purchases Product X using referral link
5. Friend D purchases Product X using referral link
6. Referral marked as completed
7. User A adds Product X to cart
8. Show 50% discount applied automatically
9. Complete purchase at discounted price

### Scenario 3: Admin Dashboard (10-15 mins)
1. Admin login
2. View dashboard with stats
3. Access product management
   - View all products
   - Create new product
   - Update product details
   - Delete product
4. Access category management
   - View categories with subcategories
   - Create new category
5. Access order management
   - View all orders
   - Update order status
6. View user analytics
7. View referral analytics

### Scenario 4: Search & Filtering (5-10 mins)
1. Test category filters (Men, Women, specific subcategories)
2. Test search with exact terms (e.g., "suit")
3. Test search aliases (e.g., "womens shoes" → shows women footwear)
4. Test combined category + search filtering

---

## KEY DIFFERENTIATORS (Social Commerce)

1. **Referral-Based Discount System**: Products can be shared with friends; if 3 friends buy → referrer gets 50% discount
2. **Time-Limited Referrals**: 24-hour window per referral campaign
3. **Product-Specific Referrals**: Users can create different referrals for different products
4. **Social Incentive**: Built-in reward mechanism encouraging organic sharing
5. **Tracked Buyer Relationships**: System knows who bought through which referral

---

## INTEGRATION POINTS FOR DEMONSTRATION

- **API Base URL**: Configurable (frontend expects backend at specific URL)
- **MongoDB Connection**: Required for all data persistence
- **JWT Tokens**: Required for protected endpoints
- **Image URLs**: Products need accessible image URLs (public folder or CDN)
- **Email Notifications**: Not currently implemented (potential feature)
- **Payment Processing**: Not integrated (currently selection only)
