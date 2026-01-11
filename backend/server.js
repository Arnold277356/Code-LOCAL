const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

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

// Verify Cloudinary configuration
if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log('✓ Cloudinary configured successfully');
} else {
  console.warn('⚠ Cloudinary not configured - check .env file');
}

// Database connection
console.log("Attempting to connect to:", process.env.DATABASE_URL ? "URL detected" : "URL MISSING");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: undefined,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Users table for login/authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        contact VARCHAR(11) UNIQUE NOT NULL,
        photo_url TEXT,
        security_question VARCHAR(255) NOT NULL,
        security_answer VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        user_id INTEGER REFERENCES users(id),
        first_name VARCHAR(255) NOT NULL,
        middle_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        suffix VARCHAR(50),
        address VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        contact VARCHAR(11) NOT NULL,
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

    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Routes

// NEW: Just create an account without e-waste
app.post('/api/auth/register-only', async (req, res) => {
  const { username, email, password, first_name, last_name, contact } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password, first_name, last_name, contact) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, first_name`,
      [username, email, password, first_name, last_name, contact]
    );
    
    res.status(201).json({
      success: true,
      user: result.rows[0],
      message: 'Account created! You can register e-waste from your dashboard later.'
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Username or Email already exists' });
  }
});

// NEW: Register e-waste for an ALREADY existing user
app.post('/api/registrations/existing', async (req, res) => {
  const { user_id, e_waste_type, weight, address } = req.body;
  const reward_points = weight * 15;

  try {
    const result = await pool.query(
      `INSERT INTO registrations (user_id, e_waste_type, weight, address, reward_points) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, e_waste_type, weight, address, reward_points]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all drop-off locations
app.get('/api/drop-offs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drop_offs ORDER BY name');
    if (result.rows.length === 0) {
      // Return sample data if no locations exist
      return res.json([
        {
          id: 1,
          name:'Burol 1 Barangay Hall',
          address: 'Burol 1, Dasmarinas Cavite',
          latitude: 14.3261,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 9:00 AM - 5:00 PM',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name:'Burol 1 Community Center',
          address: 'Burol 1, Dasmariñas Cavite',
          latitude: 14.3261,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 10:00 AM - 4:00 PM',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name:'Burol 1 Market Area',
          address: 'Burol 1, Dasmariñas Cavite',
          latitude: 14.3261,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 8:00 AM - 6:00 PM',
          created_at: new Date().toISOString()
        }
      ]);
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching drop-offs:', error);
    // Return sample data on error
    res.json([
      {
        id: 1,
          name:'Burol 1 Barangay Hall',
          address: 'Burol 1, Dasmarinas Cavite',
          latitude: 14.3261,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 9:00 AM - 5:00 PM',
          created_at: new Date().toISOString()
      },
      {
        id: 2,
          name:'Burol 1 Community Center',
          address: 'Burol 1, Dasmariñas Cavite',
          latitude: 14.3261,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 10:00 AM - 4:00 PM',
          created_at: new Date().toISOString()
      },
      {
        id: 3,
          name:'Burol 1 Market Area',
          address: 'Burol 1, Dasmariñas Cavite',
          latitude: 14.3261,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 8:00 AM - 6:00 PM',
          created_at: new Date().toISOString()
      }
    ]);
  }
});

// Add drop-off location (admin)
app.post('/api/drop-offs', async (req, res) => {
  const { name, address, latitude, longitude, schedule } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO drop_offs (name, address, latitude, longitude, schedule) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, address, latitude, longitude, schedule]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding drop-off:', error);
    res.status(500).json({ error: 'Failed to add drop-off location' });
  }
});

// Register e-waste drop-off AND create user account
app.post('/api/registrations', async (req, res) => {
  const client = await pool.connect();
  try {
    const { 
      first_name, middle_name, last_name, suffix, address, age, contact, 
      e_waste_type, weight, photo_url, consent,
      username, email, password, confirm_password, security_question, security_answer
    } = req.body;
    
    // Validation - E-waste fields
    if (!first_name || !last_name || !address || !age || !contact || !e_waste_type || !weight || !consent) {
      return res.status(400).json({ error: 'Missing required e-waste fields' });
    }

    // Validation - User credentials
    if (!username || !email || !password || !confirm_password || !security_question || !security_answer) {
      return res.status(400).json({ error: 'Missing required user credential fields' });
    }

    // Validate username (3-20 chars, alphanumeric + underscore)
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be 3-20 characters' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscore' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password (min 6 chars)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Validate security answer
    if (security_answer.trim().length < 2) {
      return res.status(400).json({ error: 'Security answer must be at least 2 characters' });
    }

    // Convert age and weight to numbers
    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);

    // Additional validation
    if (contact.toString().length !== 11) {
      return res.status(400).json({ error: 'Contact number must be 11 digits' });
    }

    if (ageNum < 18 || ageNum > 99) {
      return res.status(400).json({ error: 'Age must be between 18 and 99' });
    }

    if (weightNum <= 0) {
      return res.status(400).json({ error: 'Weight must be greater than 0' });
    }

    // Start transaction
    await client.query('BEGIN');

    const reward_points = weightNum * 15; // Calculate reward points

    // Create user account
    const userResult = await client.query(
      `INSERT INTO users (username, email, password, first_name, last_name, contact, photo_url, security_question, security_answer) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [username, email, password, first_name, last_name, contact, photo_url, security_question, security_answer]
    );

    const userId = userResult.rows[0].id;

    // Create registration record
    const registrationResult = await client.query(
      `INSERT INTO registrations (user_id, first_name, middle_name, last_name, suffix, address, age, contact, e_waste_type, weight, photo_url, consent, reward_points) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [userId, first_name, middle_name || null, last_name, suffix || null, address, ageNum, contact, e_waste_type, weightNum, photo_url, consent, reward_points]
    );

    // Commit transaction
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      registration: registrationResult.rows[0],
      user: {
        id: userId,
        username: username,
        email: email,
        first_name: first_name,
        last_name: last_name,
        contact: contact
      },
      message: 'Registration successful! You can now login with your username and password.'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registering drop-off:', error);
    
    // Handle specific database errors
    if (error.code === '23505') {
      const constraint = error.constraint;
      if (constraint === 'users_username_key') {
        return res.status(400).json({ error: 'Username already exists' });
      } else if (constraint === 'users_email_key') {
        return res.status(400).json({ error: 'Email already exists' });
      } else if (constraint === 'users_contact_key') {
        return res.status(400).json({ error: 'Contact number already registered' });
      }
    }
    
    res.status(500).json({ error: 'Failed to register: ' + error.message });
  } finally {
    client.release();
  }
});

// Get all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    if (result.rows.length === 0) {
      // Return sample announcements if none exist
      return res.json([
        {
          id: 1,
          title: 'Extended Collection Hours This Weekend',
          content: 'All drop-off centers will be open from 8:00 AM to 7:00 PM this Saturday and Sunday to accommodate more residents.',
          type: 'collection',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Temporary Closure Notice',
          content: 'The Community Center drop-off point will be temporarily closed on December 25-26 for maintenance. Please use alternative locations.',
          type: 'notice',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          title: 'New E-waste Categories Accepted',
          content: 'We now accept solar panels and LED lights! Please bring them to any of our drop-off centers.',
          type: 'announcement',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    // Return sample announcements on error
    res.json([
      {
        id: 1,
        title: 'Extended Collection Hours This Weekend',
        content: 'All drop-off centers will be open from 8:00 AM to 7:00 PM this Saturday and Sunday to accommodate more residents.',
        type: 'collection',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Temporary Closure Notice',
        content: 'The Community Center drop-off point will be temporarily closed on December 25-26 for maintenance. Please use alternative locations.',
        type: 'notice',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title: 'New E-waste Categories Accepted',
        content: 'We now accept solar panels and LED lights! Please bring them to any of our drop-off centers.',
        type: 'announcement',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]);
  }
});

// Add announcement (admin)
app.post('/api/announcements', async (req, res) => {
  const { title, content, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO announcements (title, content, type) VALUES ($1, $2, $3) RETURNING *',
      [title, content, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(500).json({ error: 'Failed to add announcement' });
  }
});

// Calculate rewards
app.post('/api/calculate-rewards', (req, res) => {
  const { weight } = req.body;
  const rewardPerKg = 15; // ₱15 per kg
  const totalReward = weight * rewardPerKg;
  res.json({ weight, rewardPerKg, totalReward, currency: '₱' });
});

// Cloudinary configuration endpoint
app.get('/api/cloudinary-config', (req, res) => {
  res.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
  });
});

// Photo upload endpoint (backend validation)
app.post('/api/upload-photo', async (req, res) => {
  try {
    const { file_data } = req.body;

    if (!file_data) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file_data, {
      folder: 'ecyclehub/registrations',
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    });

    res.json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({
      error: 'Failed to upload photo',
      message: error.message
    });
  }
});

// LOGIN ENDPOINT
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user by username
    const result = await pool.query(
      'SELECT id, username, email, first_name, last_name, contact, photo_url, security_question, created_at FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];

    // Get user's registrations and total rewards
    const registrationsResult = await pool.query(
      'SELECT id, e_waste_type, weight, reward_points, created_at FROM registrations WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    );

    const totalRewards = registrationsResult.rows.reduce((sum, reg) => sum + parseFloat(reg.reward_points || 0), 0);
    const totalWeight = registrationsResult.rows.reduce((sum, reg) => sum + parseFloat(reg.weight || 0), 0);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        contact: user.contact,
        photo_url: user.photo_url,
        security_question: user.security_question,
        created_at: user.created_at,
        total_registrations: registrationsResult.rows.length,
        total_weight_kg: totalWeight.toFixed(2),
        total_rewards_php: totalRewards.toFixed(2),
        registrations: registrationsResult.rows
      },
      message: 'Login successful!'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// GET USER PROFILE & MONITORING DATA
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user info
    const userResult = await pool.query(
      'SELECT id, email, first_name, last_name, contact, photo_url, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get user's registrations
    const registrationsResult = await pool.query(
      'SELECT id, e_waste_type, weight, reward_points, photo_url, created_at FROM registrations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const totalWeight = registrationsResult.rows.reduce((sum, reg) => sum + parseFloat(reg.weight || 0), 0);
    const totalRewards = registrationsResult.rows.reduce((sum, reg) => sum + parseFloat(reg.reward_points || 0), 0);

    res.json({
      success: true,
      user: {
        ...user,
        total_registrations: registrationsResult.rows.length,
        total_weight_kg: totalWeight.toFixed(2),
        total_rewards_php: totalRewards.toFixed(2),
        registrations: registrationsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user: ' + error.message });
  }
});

// GET USER REGISTRATIONS (MONITORING)
app.get('/api/user/:userId/registrations', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT id, first_name, last_name, e_waste_type, weight, reward_points, photo_url, created_at FROM registrations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const totalWeight = result.rows.reduce((sum, reg) => sum + parseFloat(reg.weight || 0), 0);
    const totalRewards = result.rows.reduce((sum, reg) => sum + parseFloat(reg.reward_points || 0), 0);

    res.json({
      success: true,
      registrations: result.rows,
      summary: {
        total_registrations: result.rows.length,
        total_weight_kg: totalWeight.toFixed(2),
        total_rewards_php: totalRewards.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations: ' + error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured',
    database: 'connected'
  });
});

// Initialize and start server
const PORT = process.env.PORT || 5000;
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
