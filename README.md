QR FLOAT 247
QR FLOAT 247 is a QR-based restaurant ordering and management platform with frontend and backend maintained in a single GitHub monorepo.
Project Structure
QR-Float247-Project/
├── QR frontend/
└── QR backend/
Features
Customer / Guest
- QR-based guest ordering
- Restaurant and food browsing
- Food category filtering
- Cart management
- Guest cart using a guest ID
- Order creation and status tracking
- Payments
- Coupons
- Favorites
- Addresses
- Reviews
- Notifications
Admin / Restaurant
- Admin authentication
- Restaurant management
- Food/menu management
- Category management
- Order management
- Kitchen Display System (KDS)
- Table management
- User management
- Coupon management
- Reports
Backend
The backend uses Express.js, Prisma ORM, and PostgreSQL.
Main API areas:
/api/auth
/api/restaurants
/api/categories
/api/food
/api/cart
/api/orders
/api/tables
/api/payments
/api/coupons
/api/favorites
/api/addresses
/api/reviews
/api/notifications
/api/staff

/api/admin/auth
/api/admin
/api/admin/restaurants
/api/admin/foods
/api/admin/categories
/api/admin/orders
/api/admin/users
/api/admin/coupons
Health check:
GET /api/health
Database
PostgreSQL is accessed through Prisma.
Main models include:
- User
- Restaurant
- Category
- FoodItem
- Cart
- CartItem
- Order
- OrderItem
- OrderStatusHistory
- Payment
- Coupon
- Review
- Notification
- Address
- Favorite
- Staff
- RestaurantTable
Environment
Frontend:
VITE_API_BASE_URL=http://localhost:5000
Backend example:
DATABASE_URL=your_postgresql_connection_string
PORT=5001
Use the actual local ports configured in your environment.
Do not commit real secrets.
Development
Backend
cd "QR backend"
npm install
npm run dev
Frontend
cd "QR frontend"
npm install
npm run dev
If a dev script is not available, use the script defined in the corresponding package.json.
API Speed Optimization
The project is being optimized without changing existing business logic or API integration contracts.
Current optimization goals:
- Remove unnecessary duplicate database queries
- Reduce redundant Prisma queries
- Keep existing API response structures
- Keep existing request formats
- Keep existing status codes
- Preserve existing cart and order behavior
- Optimize heavy admin/KDS queries
- Reduce unnecessary frontend API calls
- Add database indexes only when supported by actual query patterns
Optimization rule
Performance work must not change:
- Existing endpoints
- Request payloads
- Response structures
- Existing order/cart behavior
- Existing business rules
Git
Frontend and backend are maintained in the same root Git repository.
Repository:
  /QR-Float247-Project
Files Not to Commit
.env
.env.*
node_modules/
dist/
.DS_Store
Status
The project is under active development. Customer ordering, restaurant/admin management, KDS, table management, and API performance improvements are being refined.
