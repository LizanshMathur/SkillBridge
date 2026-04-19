# SkillBridge

## Setup Instructions

1. Install Node.js and MySQL.
2. Clone this repo:
   git clone https://github.com/<your-username>/SkillBridge.git
3. Install dependencies:
   npm install
4. Create a MySQL database:
   CREATE DATABASE skillbridge;
5. Import schema:
   mysql -u root -p skillbridge < schema.sql
6. Copy `.env.example` to `.env` and update DB credentials:
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=skillbridge
   PORT=5000
7. Start backend:
   npm start
8. Open `index.html` in browser (frontend will call backend at localhost:5000).
