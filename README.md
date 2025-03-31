# Employee Management System 🚀  

A **MERN stack** employee management system with authentication, built using **React, Express, MongoDB, and Cloudinary for file uploads**.  

## 📌 Features  
✅ User Authentication (JWT)  
✅ Employee Management (Add, Edit, Delete, View)  
✅ Profile Management  
✅ Secure API with Express & MongoDB  
✅ Image Upload with Cloudinary  
✅ Responsive UI with React & Vite  

## 🛠 Tech Stack  
**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Express.js, Node.js, MongoDB  
**Authentication:** JWT (JSON Web Token)  
**Storage:** MongoDB (Mongoose), Cloudinary (for images)  
 

### 1️⃣ Clone the Repository  
```bash
git clone [https://github.com/yourusername/employee-management-system.git
cd employee-management-system
 ```
###Backend
```bash
cd backend
npm install  # Install dependencies
npm start 
```

###Frontend
```bash
cd frontend
npm install  # Install dependencies
npm run dev  # Start frontend (http://localhost:5173)
```
###.enc
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

###API Endpoints
POST /api/auth/register     # Register a new user  
POST /api/auth/login        # Login & get JWT token  
GET /api/auth/profile       # Get user profile  

GET /api/employees          # Get all employees  
POST /api/employees         # Add an employee  
PUT /api/employees/:id      # Update employee  
DELETE /api/employees/:id   # Delete employee  



