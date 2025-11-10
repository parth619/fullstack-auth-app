# fullstack-auth-app
 # 🗣️ Discussion Forum Website

A full-stack discussion forum built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
This project allows users to create, view, and interact with posts, similar to community discussion platforms like Reddit.  

---

## 📋 Features

### 🌐 Frontend (React.js)
- Built with **React 18+** using functional components and hooks.
- Displays posts, polls, and discussions in a modern UI.
- Create new posts dynamically.
- Vote, comment, and save posts.
- Real-time search and sorting (Trending, Newest, Top).
- Responsive and minimal UI using CSS and flexbox/grid.

### ⚙️ Backend (Node.js + Express)
- RESTful API for managing posts and user authentication.
- Stores posts, comments, and votes in MongoDB.
- Uses **Mongoose** for schema modeling.
- Includes JWT-based authentication logic (if extended).
- Configurable environment variables via `.env`.

### 🗄️ Database (MongoDB)
- Data is stored in a local MongoDB instance using **MongoDB Compass**.
- Default connection:  


---

## 🧱 Project Structure

│
├── backend/

│ ├── server.js

│ ├── .env

│ ├── models/

│ │ └── Post.js

│ ├── routes/

│ │ └── postRoutes.js

│ └── controllers/

│ └── postController.js

│

├── frontend/

│ ├── src/

│ │ ├── pages

│ │ │ └── Home.jsx

│ │ ├── components/

│ │ ├── App.jsx

│ │ └── index.js

│ └── package.json

│
└── README.md


---

## 🚀 Installation and Setup

### 1️⃣ Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- npm or yarn

---

### 2️⃣ Backend Setup

```bash
# Navigate to backend folder
cd backend

# Initialize and install dependencies
npm init -y
npm install express mongoose cors dotenv

# Create .env file
touch .env


PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/discuss_forum
JWT_SECRET=supersecretkey_change_me
JWT_EXPIRES_IN=7d





🧠 How It Works


The frontend (Home.jsx) allows users to create posts.


When submitted, data is sent to the backend API (Express).


The backend saves data into MongoDB using Mongoose.


The frontend fetches posts from the backend and displays them in real-time.



🧰 Tech Stack
LayerTechnologyFrontendReact.js, CSS, React RouterBackendNode.js, Express.jsDatabaseMongoDB, MongooseToolsPostman, MongoDB Compass, npm

🧑‍💻 Developer Notes


Make sure MongoDB service is running locally before starting backend.


If posts aren’t visible:


Check backend console for connection errors.


Verify MongoDB Compass shows the discuss_forum database.


Ensure CORS is enabled in backend (app.use(cors())).





🔒 Environment Variables
KeyDescriptionPORTPort number for backend serverMONGODB_URIMongoDB connection stringJWT_SECRETSecret for JWT authenticationJWT_EXPIRES_INToken expiration time

📸 Screenshots

(Optional: Add screenshots later)



Homepage with post feed


Post creation form


MongoDB Compass showing stored posts



Future Enhancements


User authentication (login/register)


Real-time comments with Socket.io


 moji reactions & analytics


Poll results visualization


User profiles & reputation






 
 


