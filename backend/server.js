const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
require('dotenv').config();

// Helper to clean inputs
const normalizeUserInput = (username, email) => ({
  username: username.trim().toLowerCase(),
  email: email.trim().toLowerCase()
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Users table - REMOVED UNIQUE/NOT NULL from contact to allow blank entries
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        contact VARCHAR(20),
        photo_url TEXT,
        security_question VARCHAR(255) NOT NULL,
        security_answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS drop_offs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        schedule VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(255) NOT NULL,
        middle_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        suffix VARCHAR(50),
        address VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        contact VARCHAR(20),
        e_waste_type VARCHAR(255) NOT NULL,
        weight DECIMAL(10, 2) NOT NULL,
        photo_url TEXT,
        consent BOOLEAN NOT NULL,
        reward_points DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✓ Database tables initialized and ready');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

/* ===================== ROUTES ===================== */

// REGISTER (Account Only)
app.post('/api/auth/register-only', async (req, res) => {
  const client = await pool.connect();
  try {
    let { username, email, password, first_name, last_name, contact, security_question, security_answer } = req.body;

    if (!username || !email || !password || !security_question || !security_answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalized = normalizeUserInput(username, email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(security_answer, 10);

    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO users (username, email, password, first_name, last_name, contact, security_question, security_answer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username`,
      [normalized.username, normalized.email, hashedPassword, first_name, last_name, contact || null, security_question, hashedAnswer]
    );
    await client.query('COMMIT');

    res.status(201).json({ success: true, user: result.rows[0], message: 'Account created!' });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      const field = error.constraint.includes('username') ? 'Username' : 'Email';
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    client.release();
  }
});

// REGISTER (Account + E-waste)
app.post('/api/registrations', async (req, res) => {
  const client = await pool.connect();
  try {
    const { 
      first_name, middle_name, last_name, suffix, address, age, contact, 
      e_waste_type, weight, photo_url, consent,
      username, email, password, confirm_password, security_question, security_answer
    } = req.body;

    if (password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match' });

    const normalized = normalizeUserInput(username, email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(security_answer, 10);
    const reward_points = parseFloat(weight) * 5;

    await client.query('BEGIN');
    
    const userRes = await client.query(
      `INSERT INTO users (username, email, password, first_name, last_name, contact, photo_url, security_question, security_answer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [normalized.username, normalized.email, hashedPassword, first_name, last_name, contact || null, photo_url, security_question, hashedAnswer]
    );

    const userId = userRes.rows[0].id;

    const regRes = await client.query(
      `INSERT INTO registrations (user_id, first_name, middle_name, last_name, suffix, address, age, contact, e_waste_type, weight, photo_url, consent, reward_points)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [userId, first_name, middle_name || null, last_name, suffix || null, address, age, contact || null, e_waste_type, weight, photo_url, consent, reward_points]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, registration: regRes.rows[0], message: 'Registration successful!' });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') return res.status(400).json({ error: 'Username or Email already exists' });
    res.status(500).json({ error: 'Failed to register' });
  } finally {
    client.release();
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Required fields missing' });

    const normalized = username.trim().toLowerCase();
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [normalized]);

    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, first_name: user.first_name, last_name: user.last_name } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// NEW ROUTE: For logged-in users submitting E-waste without re-registering
app.post('/api/e-waste-only', async (req, res) => {
  const { 
    userId, first_name, middle_name, last_name, suffix, 
    address, age, contact, e_waste_type, weight, photo_url, consent 
  } = req.body;

  try {
    // Math: ₱5 per kg
    const reward_points = parseFloat(weight) * 5;

    // This query matches your 15 columns exactly
    const result = await pool.query(
      `INSERT INTO registrations 
       (user_id, first_name, middle_name, last_name, suffix, address, age, contact, e_waste_type, weight, photo_url, consent, reward_points) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        userId, first_name, middle_name || null, last_name, suffix || null, 
        address, age || null, contact || null, e_waste_type, weight, 
        photo_url || null, consent, reward_points
      ]
    );

    res.status(201).json({
      success: true,
      message: 'E-waste record added to Barangay Burol 1 records!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Database rejected the entry. Check if weight is a number.' });
  }
});

/* ===================== OTHER FEATURES ===================== */

app.get('/api/drop-offs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drop_offs ORDER BY name');
    res.json(result.rows.length > 0 ? result.rows : []);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch locations' }); }
});

app.get('/api/announcements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch announcements' }); }
});

app.post('/api/upload-photo', async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.file_data, { folder: 'ecyclehub/registrations' });
    res.json({ success: true, secure_url: result.secure_url });
  } catch (err) { res.status(500).json({ error: 'Upload failed' }); }
});

app.get('/api/user/:userId', async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, email, first_name, last_name, contact, photo_url FROM users WHERE id = $1', [req.params.userId]);
    const regRes = await pool.query('SELECT * FROM registrations WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
    
    const totalWeight = regRes.rows.reduce((sum, r) => sum + parseFloat(r.weight || 0), 0);
    const totalRewards = regRes.rows.reduce((sum, r) => sum + parseFloat(r.reward_points || 0), 0);

    res.json({ success: true, user: { ...userRes.rows[0], total_registrations: regRes.rows.length, total_weight_kg: totalWeight.toFixed(2), total_rewards_php: totalRewards.toFixed(2), registrations: regRes.rows } });
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.get('/api/health', (req, res) => res.json({ status: 'Server is running' }));

const PORT = process.env.PORT || 5000;
initializeDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;