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
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));
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
      await pool.query(`
      ALTER TABLE registrations 
      ADD COLUMN IF NOT EXISTS middle_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS suffix VARCHAR(50),
      ADD COLUMN IF NOT EXISTS contact VARCHAR(20),
      ADD COLUMN IF NOT EXISTS photo_url TEXT,
      ADD COLUMN IF NOT EXISTS reward_points DECIMAL(10, 2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';
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

    await client.query('BEGIN');

    // Always create the user account
    const userRes = await client.query(
      `INSERT INTO users (username, email, password, first_name, last_name, contact, photo_url, security_question, security_answer)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [normalized.username, normalized.email, hashedPassword, first_name, last_name, contact || null, photo_url || null, security_question, hashedAnswer]
    );

    const userId = userRes.rows[0].id;

    // Only insert e-waste if all required fields are present
    const hasEWaste = e_waste_type && weight && address;

    if (hasEWaste) {
      const reward_points = parseFloat(weight) * 5;
      await client.query(
        `INSERT INTO registrations (user_id, first_name, middle_name, last_name, suffix, address, age, contact, e_waste_type, weight, photo_url, consent, reward_points)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [userId, first_name, middle_name || null, last_name, suffix || null, address, age || null, contact || null, e_waste_type, weight, photo_url || null, consent, reward_points]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Registration successful!' });

  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') return res.status(400).json({ error: 'Username or Email already exists' });
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register', details: error.message });
  } finally {
    client.release();
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminToken = process.env.ADMIN_SECRET_TOKEN;

    if (username === adminUsername && password === adminPassword) {
      // Return the secret token — frontend stores this in localStorage
      return res.json({ success: true, token: adminToken });
    }

    return res.status(401).json({ error: 'Invalid admin credentials' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

  // GET ALL REGISTRATIONS (Admin View)
  app.get('/api/admin/registrations', async (req, res) => {
  try {
    const providedToken = req.headers['x-admin-token'];
    const adminToken = process.env.ADMIN_SECRET_TOKEN;

    if (!providedToken || providedToken !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(`
      SELECT 
        r.id,
        r.e_waste_type,
        r.weight,
        r.reward_points,
        r.created_at,
        r.status,
        r.contact,
        u.first_name,
        u.last_name
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});


// STEP 3: Add this new PATCH route to update donation status
app.patch('/api/admin/registrations/:id/status', async (req, res) => {
  try {
    const providedToken = req.headers['x-admin-token'];
    const adminToken = process.env.ADMIN_SECRET_TOKEN;

    if (!providedToken || providedToken !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Done', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE registrations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ success: true, registration: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
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
    userId, address, age, contact, e_waste_type, weight, photo_url, consent 
  } = req.body;

  // 1. Safety Check: Stop if no userId is sent
  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing. Please log in again.' });
  }

  try {
    // 2. Lookup the user's name in the database (Prevents NOT NULL errors)
    const userLookup = await pool.query(
      'SELECT first_name, middle_name, last_name, suffix FROM users WHERE id = $1',
      [userId]
    );

    if (userLookup.rows.length === 0) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const user = userLookup.rows[0];
    const reward_points = parseFloat(weight || 0) * 5;

    // 3. Insert into registrations using the user's real name from step 2
    const result = await pool.query(
      `INSERT INTO registrations 
      (user_id, first_name, middle_name, last_name, suffix, address, age, contact, e_waste_type, weight, photo_url, consent, reward_points, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        userId, 
        user.first_name, 
        user.middle_name || null, 
        user.last_name, 
        user.suffix || null, 
        address || 'Barangay Burol 1', 
        age ? parseInt(age) : 0, 
        contact || null, 
        e_waste_type, 
        parseFloat(weight) || 0, 
        photo_url || null, 
        consent || false, 
        reward_points,
        'Pending'
      ]
    );

    res.status(201).json({ 
      success: true, 
      message: 'E-waste record added to Barangay Burol 1 records!', 
      data: result.rows[0] 
    });

  } catch (error) {
    console.error('DATABASE ERROR:', error.message);
    res.status(500).json({ 
      error: 'Database rejected the entry.', 
      details: error.message 
    });
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

  // GET USER STATS: Sum up weight and points for the Dashboard
  app.get('/api/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      // 1. Fetch user profile
      const userRes = await pool.query('SELECT id, email, first_name, last_name, contact, photo_url FROM users WHERE id = $1', [userId]);
      
      // 2. Fetch all e-waste registrations for this user
      const regRes = await pool.query('SELECT * FROM registrations WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      
      // 3. Calculate totals
      const totalWeight = regRes.rows.reduce((sum, r) => sum + parseFloat(r.weight || 0), 0);
      const totalRewards = regRes.rows.reduce((sum, r) => sum + parseFloat(r.reward_points || 0), 0);

      // DEBUG: This will show up in your Render Logs!
      console.log(`User ${userId} has ${regRes.rows.length} records. Total Weight: ${totalWeight}`);

      // 4. Send the package to the Dashboard
      res.json({ 
        success: true, 
        user: { 
          ...userRes.rows[0], 
          total_registrations: regRes.rows.length, 
          totalWeight: totalWeight,      // Renamed to match frontend
          totalRewards: totalRewards,    // Renamed to match frontend
          registrations: regRes.rows 
        } 
      });

    } catch (err) { 
      console.error(err);
      res.status(500).json({ error: 'Fetch failed' }); 
    }
  });

  app.get('/api/health', (req, res) => res.json({ status: 'Server is running' }));

  const PORT = process.env.PORT || 5000;
  initializeDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
  });

  module.exports = app;