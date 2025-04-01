🎬 MovieMate — Movie Recommendation & Watchlist App

An AI-inspired, full-stack web application that allows users to create, manage, and rate their own personal movie watchlist.

📄 Project Overview

MovieMate allows users to:

Register & Login securely

Add movies to their personal watchlist

Rate movies (1-5 stars)

Delete movies

View their watchlist dynamically

The app uses JWT Authentication, MongoDB database, and a polished React + TailwindCSS UI.

🧩 Tech Stack

Technology	Description
Frontend	React + Vite + Tailwind CSS + React Router + Axios
Backend	Node.js + Express + MongoDB (Mongoose)
Auth	JWT (JSON Web Token) Authentication
Database	MongoDB Atlas
Notifications	Radix UI Toasts

📂 Project Structure

movie-recommendation/
├── backend/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
└── README.md

💻 How to Run Locally

1. Clone the Repository

git clone https://github.com/thatkidbambino/movie-recommendation.git
cd movie-recommendation

2. Backend Setup

cd backend
npm install
Create a .env file in /backend:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run the backend server:

node server.js

3. Frontend Setup

cd ../frontend
npm install
npm run dev
Visit: http://localhost:5173

🎯 Features

✅ User Authentication (JWT)
✅ Add, Delete, and Rate Movies
✅ Real-time watchlist updates
✅ Dark-mode, modern UI
✅ Responsive & mobile-friendly

