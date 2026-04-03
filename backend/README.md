🖥️ Backend - Food Delivery App (NomNomGo)

This is the backend server for the food ordering and delivery application. It is built using Node.js, Express, and MongoDB and provides REST APIs for the mobile app and admin panel.

🚀 Features
User authentication (register/login)
Food item management
Order management
RESTful API structure
MongoDB database integration

🛠 Tech Stack
Node.js – Runtime environment
Express.js – Web framework
MongoDB – Database
Mongoose – ODM for MongoDB
dotenv – Environment variables
cors – Cross-origin requests

📁 Project Structure
backend/
│
├── src/
│ ├── config/ # Configuration files
│ │ └── db.js # MongoDB connection
│ │
│ ├── models/ # Mongoose schemas
│ │ ├── User.js
│ │ ├── Food.js
│ │ └── Order.js
│ │
│ ├── controllers/ # Business logic
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & middleware
│ └── app.js # Express app setup
│
├── server.js # Entry point
├── .env # Environment variables
├── package.json
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the project
git clone <your-repo-url>
cd backend
2️⃣ Install dependencies
npm install
3️⃣ Create .env file

Create a .env file in the root of backend/:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
4️⃣ Run the server
Development mode (recommended)
npm run dev
Production mode
npm start
🌐 API Base URL
http://localhost:5000
🧪 Test Route

You can test if the server is running:

GET /

Expected response:

Backend server is running!
🔐 Important Notes
Do not commit .env file to GitHub
Add .env and node_modules to .gitignore
Always keep your MongoDB credentials secure
📌 Development Tips
Use Postman to test APIs
Keep controllers clean and modular
Separate routes and logic properly
Restart server using nodemon for faster development
🚧 Future Improvements
JWT authentication system
Payment integration
Real-time order tracking
Admin analytics

👨‍💻 Author
Sagar Chaurasiya
