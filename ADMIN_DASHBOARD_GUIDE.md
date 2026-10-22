# Admin Dashboard Implementation Guide

## Overview
This guide outlines the complete Admin Login and Dashboard system that has been implemented for Smart-AgroConnect. The system provides role-based access control, secure authentication, and comprehensive CRUD functionality for managing product categories (Vegetables, Fruits, Flowers).

---

## Features Implemented

### 1. ✅ Role-Based Login System
- **Role Selector**: Added dropdown to login page with roles: Farmer, Buyer, Expert, Admin
- **Smart Redirects**: Users are redirected based on their role:
  - Admin → `/admin/dashboard`
  - Other roles → `/dashboard` or previous page
- **Location**: [frontend/src/pages/Login.jsx](frontend/src/pages/Login.jsx)

### 2. ✅ Admin Dashboard
- **Modern UI**: Dark-themed dashboard with gradient backgrounds and smooth animations
- **Category Navigation**: Sidebar with Vegetables (🥬), Fruits (🍎), Flowers (🌸)
- **Real-time Stats**: Item count displayed for each category
- **Quick Actions**: Add, Edit, Delete functionality for each category
- **Location**: [frontend/src/pages/AdminDashboard.jsx](frontend/src/pages/AdminDashboard.jsx)

### 3. ✅ Backend Authentication & Authorization
- **Enhanced Auth Middleware**: 
  - Token validation with JWT
  - Role-based access control middleware (`roleBasedAccess`)
  - Protects all admin routes
- **Location**: [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js)

### 4. ✅ Category Model (MongoDB)
- **Schema**: Categories with nested items array
- **Categories**: Vegetables, Fruits, Flowers (predefined enum)
- **Items**: Full CRUD support with name, description, price, quantity, image URL
- **Location**: [backend/models/Category.js](backend/models/Category.js)

### 5. ✅ Admin API Endpoints
All endpoints require admin authentication via JWT token.

#### Categories
- `GET /api/admin/categories` - Fetch all categories with items
- `GET /api/admin/categories/:categoryName` - Fetch single category

#### Items (CRUD)
- `POST /api/admin/categories/:categoryName/items` - Add item
- `PUT /api/admin/categories/:categoryName/items/:itemId` - Update item
- `DELETE /api/admin/categories/:categoryName/items/:itemId` - Delete item

**Location**: [backend/routes/adminRoutes.js](backend/routes/adminRoutes.js) & [backend/controllers/adminController.js](backend/controllers/adminController.js)

### 6. ✅ Frontend Route Protection
- **AdminProtectedRoute**: Custom component that validates:
  - User is authenticated (valid JWT token)
  - User role is "admin"
  - Redirects unauthorized users with error toast
- **Location**: [frontend/src/components/AdminProtectedRoute.jsx](frontend/src/components/AdminProtectedRoute.jsx)

### 7. ✅ Auth Utility Functions
- `isTokenValid()`: Checks token expiration
- `getUserRole()`: Extracts role from JWT payload
- **Location**: [frontend/src/utils/auth.js](frontend/src/utils/auth.js)

---

## File Structure

```
backend/
├── models/
│   └── Category.js (NEW)
├── controllers/
│   └── adminController.js (NEW)
├── routes/
│   └── adminRoutes.js (NEW)
├── middleware/
│   └── authMiddleware.js (UPDATED - role-based access added)
└── server.js (UPDATED - admin routes registered)

frontend/
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.jsx (NEW)
│   │   └── Login.jsx (UPDATED - role selector added)
│   ├── components/
│   │   └── AdminProtectedRoute.jsx (NEW)
│   ├── utils/
│   │   └── auth.js (UPDATED - getUserRole() added)
│   └── App.jsx (UPDATED - admin dashboard route added)
```

---

## How to Use

### Admin Login
1. Navigate to `/login`
2. Select **"Admin"** from the "Login As" dropdown
3. Enter admin credentials (email & password)
4. Click "Sign In"
5. You'll be redirected to `/admin/dashboard`

### Admin Dashboard Features

#### View Categories & Items
- Left sidebar shows all 3 categories with item count
- Click on a category to view its items
- Items displayed in responsive grid (1-2 columns)

#### Add Items
1. Click "Add New Item" button
2. Fill in the form:
   - **Item Name** (required)
   - Description (optional)
   - Price ($)
   - Quantity
   - Image URL
3. Click "Add Item"

#### Edit Items
1. Click "Edit" button on any item card
2. Update desired fields
3. Click "Update Item"

#### Delete Items
1. Click "Delete" button on any item card
2. Confirm deletion in the dialog
3. Item is removed immediately

#### Logout
- Click "Logout" button in top-right corner
- You'll be redirected to `/login`

---

## Security Features

### 🔒 Authentication
- JWT tokens with expiration validation
- Secure password hashing with bcryptjs
- Token stored in localStorage (production: use httpOnly cookies)

### 🛡️ Authorization
- Role-based access control (RBAC) middleware
- Admin-only route protection at:
  - Frontend: `AdminProtectedRoute` component
  - Backend: `roleBasedAccess(["admin"])` middleware

### ✅ Input Validation
- Server-side validation for all fields
- Duplicate item name checking
- Price & quantity type validation
- Email & password validation on login

### 📡 Error Handling
- Comprehensive error messages
- User-friendly toast notifications
- Detailed API response statuses

---

## API Examples

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123",
    "role": "admin"
  }'
```

### Add Item to Category
```bash
curl -X POST http://localhost:5000/api/admin/categories/Vegetables/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Organic Tomatoes",
    "description": "Fresh, locally grown tomatoes",
    "price": 25.99,
    "quantity": 100,
    "image": "https://example.com/tomato.jpg"
  }'
```

### Get All Categories
```bash
curl -X GET http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Item
```bash
curl -X PUT http://localhost:5000/api/admin/categories/Vegetables/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 29.99,
    "quantity": 150
  }'
```

### Delete Item
```bash
curl -X DELETE http://localhost:5000/api/admin/categories/Vegetables/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing the Implementation

### 1. Create Admin User
```javascript
// Register endpoint already supports admin role
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@agroconnect.com",
  "phone": "9876543210",
  "password": "AdminPass123",
  "role": "admin",
  "location": {}
}
```

### 2. Login & Get Token
```javascript
POST /api/auth/login
{
  "email": "admin@agroconnect.com",
  "password": "AdminPass123",
  "role": "admin"
}
// Response includes JWT token
```

### 3. Access Admin Dashboard
- Frontend: Navigate to `http://localhost:3000/admin/dashboard`
- Automatically initializes Vegetables, Fruits, Flowers categories
- Start adding items!

---

## Database Schema

### Category Collection
```javascript
{
  _id: ObjectId,
  name: "Vegetables" | "Fruits" | "Flowers",
  description: String,
  icon: String,
  items: [
    {
      _id: ObjectId,
      name: String,
      description: String,
      price: Number,
      quantity: Number,
      image: String,
      specifications: Map<String, String>,
      createdAt: Date,
      updatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Setup

### Backend `.env` Requirements
```
MONGODB_URI=mongodb://localhost:27017/smart-agroconnect
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

### Frontend Setup
No additional environment variables needed for admin dashboard. Uses existing API configuration.

---

## Browser Compatibility
- ✅ Chrome/Chromium (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers (Responsive design)

---

## Performance Optimizations
- Lazy loading of categories on mount
- Debounced form inputs
- Optimized re-renders with React hooks
- CSS Grid for responsive layouts
- Backdrop blur for modern UI

---

## Future Enhancements
- [ ] Bulk import/export items (CSV)
- [ ] Image upload to cloud storage
- [ ] Advanced filtering & search
- [ ] Category analytics & reports
- [ ] Batch operations
- [ ] Audit logs for admin actions
- [ ] Admin user management panel
- [ ] Inventory alerts & notifications

---

## Troubleshooting

### "Access denied" when accessing admin dashboard
- Verify your role is set to "admin" in login
- Check JWT token hasn't expired
- Clear localStorage and login again

### Items not showing up
- Wait for API response (loading state should show)
- Check browser console for errors
- Verify MongoDB connection is active

### Cannot add items with "Item name already exists"
- Each item name must be unique within a category
- Try with a different name

### Admin routes returning 403 Forbidden
- Backend: Ensure `roleBasedAccess(["admin"])` middleware is applied
- Frontend: Check JWT token contains `role: "admin"`

---

## Support
For issues or questions, refer to:
- Backend: [backend/controllers/adminController.js](backend/controllers/adminController.js)
- Frontend: [frontend/src/pages/AdminDashboard.jsx](frontend/src/pages/AdminDashboard.jsx)
- Auth: [frontend/src/components/AdminProtectedRoute.jsx](frontend/src/components/AdminProtectedRoute.jsx)

---

**Status**: ✅ Complete and Ready for Testing
**Last Updated**: May 27, 2026
