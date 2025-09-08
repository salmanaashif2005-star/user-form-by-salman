# User Form  

A full-stack **User Form Application** built with **React (Vite)** for the frontend, **Node.js + Express** for the backend, and **MySQL (via Sequelize ORM)** for persistent data storage.  

## 🚀 Features  
- User form with dynamic input handling  
- Backend API with Express.js  
- Sequelize ORM for MySQL integration  
- RESTful architecture (CRUD operations)  
- Modular project structure (routes, controllers, models)  
- Vite for fast frontend development  

---

### Frontend  
- React (Vite + JavaScript)  
- Fetch (for API requests)  
- Bootstrap / CSS (for styling) *(optional: update if you used something specific)*  

### Backend  
- Node.js  
- Express.js  
- Sequelize ORM  
- MySQL  

## 🗄️ Database Schema

### Tables

1. users → Stores user details (name, email, phone, etc.)

2. addresses → Stores multiple addresses linked to a user

3. user_activity → Tracks user activity logs (e.g., login, form submission, updates)

### Relationships

- A user can have multiple addresses (One-to-Many)

- A user can have multiple activity logs (One-to-Many)
---

## 📂 Project Structure  

### Frontend (`/`)  
```
/src
  ├── project/       # Page components (Form, Home, etc.)
├── App.js         # Main React component
├── main.jsx       # Entry point
```

### Backend (`/backend`)  
```
/backend
  ├── routes/        # Express routes
  ├── models/        # Sequelize models
  ├── server.js      # Entry point
  ├── s3.js	     # Aws S3 getting ImageUpload
  ├── db.js          # DB config
  ├── activitylogger.js	# Activity Log for Calling routes
```

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/<salmanaashif2005-star>/user-form-by-salman.git
cd user-form-by-salman
```

### 2️⃣ Setup Backend  
```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` with:  
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=user_db
DB_DIALECT=mysql
PORT=5000
JWT_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_BUCKET=...
```

Run migrations (if any):  
```bash
npx sequelize db:migrate
```

Start backend:  
```bash
node server.js
```

### 3️⃣ Setup Frontend  
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints  

| Method | Endpoint         | Description        |
|--------|-----------------|--------------------|
| POST   | `/api/users`    | Create new user    |
| GET    | `/api/users`    | Get all users      |
| GET    | `/api/users/:id`| Get user by ID     |
| PUT    | `/api/users/:id`| Update user by ID  |
| DELETE | `/api/users/:id`| Delete user by ID  |

---

## 🤝 Contributing  
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.  

---