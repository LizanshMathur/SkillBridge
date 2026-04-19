
// Load environment variables first
require('dotenv').config({ path: __dirname + '/pp.env' });
   // or '.env' if you renamed it

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);



const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Enable JSON parsing
app.use(express.json());

// ✅ One‑line CORS setup
app.use(require('cors')());

// DB connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
 authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.DB_PASS)
  }
});

// JWT secret
const SECRET = process.env.JWT_SECRET|| 'fallback_secret';

// Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ---------------- AUTH ----------------

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );
    res.json({ id: result.insertId, message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email=?', [email]);
    if (rows.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- PROFILE ----------------

// Save profile
app.post('/api/profile', authenticateToken, async (req, res) => {
  const { role, industry, experience } = req.body;
  try {
    await db.query(
      'UPDATE users SET role=?, industry=?, experience=? WHERE id=?',
      [role, industry, experience, req.user.id]
    );
    res.json({ message: 'Profile saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile
app.get('/api/profile/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id=?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SKILLS ----------------

app.post('/api/skills', authenticateToken, async (req, res) => {
  const { skill_name, proficiency_level } = req.body;
  try {
    await db.query(
      'INSERT INTO skills (user_id, skill_name, proficiency_level) VALUES (?, ?, ?)',
      [req.user.id, skill_name, proficiency_level]
    );
    res.json({ message: 'Skill added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/skills/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM skills WHERE user_id=?', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GOALS ----------------

app.post('/api/goals', authenticateToken, async (req, res) => {
  const { target_role, desired_skills } = req.body;
  try {
    await db.query(
      'INSERT INTO career_goals (user_id, target_role, desired_skills) VALUES (?, ?, ?)',
      [req.user.id, target_role, desired_skills]
    );
    res.json({ message: 'Career goals set' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/goals/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM career_goals WHERE user_id=?', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GAP ANALYSIS ----------------

app.get('/api/gap/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [skills] = await db.query('SELECT skill_name FROM skills WHERE user_id=?', [id]);
    const [goals] = await db.query('SELECT desired_skills FROM career_goals WHERE user_id=?', [id]);

    const currentSkills = skills.map(s => s.skill_name);
    const desiredSkills = goals.length ? goals[0].desired_skills.split(',') : [];
    const missing = desiredSkills.filter(skill => !currentSkills.includes(skill.trim()));

    res.json({ missing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ROADMAP ----------------

app.post('/api/roadmap', authenticateToken, async (req, res) => {
  const { roadmap_text, roadmap_json } = req.body;
  try {
    await db.query(
      'INSERT INTO learning_paths (user_id, roadmap_text, roadmap_json) VALUES (?, ?, ?)',
      [req.user.id, roadmap_text, JSON.stringify(roadmap_json)]
    );
    res.json({ message: 'Roadmap saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/roadmap/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM learning_paths WHERE user_id=?', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
