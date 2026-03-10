  const express = require('express');
  const cors = require('cors');
  const { Pool } = require('pg');
  const cloudinary = require('cloudinary').v2;
  const bcrypt = require('bcrypt');
  require('dotenv').config();
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
 
  // ── Email helper ───────────────────────────────────────────
async function sendStatusEmail(toEmail, userName, ewasteType, weight, newStatus, reward) {
  const statusConfig = {
    'In Progress': {
      emoji: '🔄',
      color: '#3b82f6',
      subject: 'Your E-Waste Drop-off is Being Processed — E-Cycle Hub',
      headline: 'Your submission is in progress!',
      message: 'The barangay staff has received your e-waste and is currently processing it. We will notify you once it is verified.',
      badge: 'IN PROGRESS', badgeBg: '#dbeafe', badgeColor: '#1e40af',
    },
    'Done': {
      emoji: '✅',
      color: '#10b981',
      subject: '✅ E-Waste Verified — Your Reward is Ready to Claim!',
      headline: 'Your e-waste has been verified!',
      message: `Great news! Your drop-off has been verified. You have earned <strong>₱${parseFloat(reward || 0).toFixed(2)}</strong>. Log in to your dashboard to download your certificate and claim your reward at the Barangay Hall.`,
      badge: 'DONE', badgeBg: '#d1fae5', badgeColor: '#065f46',
    },
    'Rejected': {
      emoji: '❌',
      color: '#ef4444',
      subject: 'Update on Your E-Waste Drop-off — E-Cycle Hub',
      headline: 'Your submission was not accepted.',
      message: 'Unfortunately, your e-waste submission could not be verified. This may be due to incorrect weight or item type. Please visit the Barangay Hall for details or to re-submit.',
      badge: 'REJECTED', badgeBg: '#fee2e2', badgeColor: '#991b1b',
    },
  };

  const config = statusConfig[newStatus];
  if (!config || !toEmail) return;

  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#10b981,#059669);border-radius:12px 12px 0 0;padding:30px;text-align:center;">
          <div style="font-size:40px;margin-bottom:8px;">♻️</div>
          <h1 style="color:white;margin:0;font-size:24px;">E-Cycle Hub</h1>
          <p style="color:#d1fae5;margin:4px 0 0;font-size:13px;">Barangay Burol 1, Dasmariñas City, Cavite</p>
        </div>
        <div style="background:white;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
          <p style="color:#374151;font-size:16px;margin:0 0 8px;">Hi <strong>${userName}</strong>,</p>
          <div style="margin:20px 0;text-align:center;">
            <span style="background:${config.badgeBg};color:${config.badgeColor};padding:6px 20px;border-radius:999px;font-weight:bold;font-size:13px;letter-spacing:1px;">${config.emoji} ${config.badge}</span>
          </div>
          <h2 style="color:${config.color};font-size:20px;margin:0 0 12px;">${config.headline}</h2>
          <p style="color:#6b7280;line-height:1.7;margin:0 0 24px;">${config.message}</p>
          <div style="background:#f9fafb;border-radius:10px;padding:20px;margin-bottom:24px;">
            <h3 style="color:#374151;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Submission Details</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:6px 0;color:#6b7280;">E-Waste Type</td><td style="padding:6px 0;color:#111;font-weight:bold;text-align:right;">${ewasteType}</td></tr>
              <tr style="border-top:1px solid #e5e7eb;"><td style="padding:6px 0;color:#6b7280;">Weight</td><td style="padding:6px 0;color:#111;font-weight:bold;text-align:right;">${weight} kg</td></tr>
              <tr style="border-top:1px solid #e5e7eb;"><td style="padding:6px 0;color:#6b7280;">Status</td><td style="padding:6px 0;text-align:right;"><span style="background:${config.badgeBg};color:${config.badgeColor};padding:2px 10px;border-radius:999px;font-size:12px;font-weight:bold;">${newStatus}</span></td></tr>
              ${newStatus === 'Done' ? `<tr style="border-top:1px solid #e5e7eb;"><td style="padding:6px 0;color:#6b7280;">Reward Earned</td><td style="padding:6px 0;color:#10b981;font-weight:bold;text-align:right;font-size:16px;">₱${parseFloat(reward || 0).toFixed(2)}</td></tr>` : ''}
            </table>
          </div>
          ${newStatus === 'Done' ? `
          <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:20px;margin-bottom:24px;">
            <h3 style="color:#065f46;font-size:14px;margin:0 0 10px;">💰 How to Claim Your Reward</h3>
            <ol style="color:#374151;font-size:13px;line-height:2;padding-left:20px;margin:0;">
              <li>Visit Barangay Hall at Burol 1, Dasmariñas Cavite</li>
              <li>Bring a valid government-issued ID</li>
              <li>Download your certificate from your dashboard</li>
              <li>Barangay staff will verify and release your voucher</li>
            </ol>
          </div>` : ''}
          <div style="text-align:center;margin:24px 0;">
            <a href="https://burol1ewastegroup6.vercel.app/dashboard" style="background:linear-gradient(135deg,#10b981,#059669);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:15px;display:inline-block;">View My Dashboard →</a>
          </div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;padding:20px;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0 0 6px;">📍 Burol 1, Dasmariñas City, Cavite &nbsp;|&nbsp; 📞 09916338752</p>
          <p style="color:#d1d5db;font-size:11px;margin:8px 0 0;">© 2024 E-Cycle Hub — Barangay Burol 1</p>
        </div>
      </div>
    </body></html>
  `;

  try {
    await resend.emails.send({
      from: 'E-Cycle Hub <onboarding@resend.dev>',
      to: toEmail,
      subject: config.subject,
      html,
    });
    console.log(`✅ Email sent to ${toEmail} — Status: ${newStatus}`);
  } catch (err) {
    console.error('❌ Email failed:', err.message);
  }
}

  // Helper to clean inputs
  const normalizeUserInput = (username, email) => ({
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase()
  });

  const app = express();

  // Middleware
  app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-token']
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
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending',
      ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS archive_reason TEXT;
    `);

    // Add phone_number column to users table (for SMS)
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
    `);
    console.log('✓ Database columns synchronized');
  } catch (error) {
    console.error('Database sync error:', error);
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
  app.patch('/api/admin/registrations/:id/status', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Done', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await pool.query('UPDATE registrations SET status = $1 WHERE id = $2', [status, id]);

    // Fetch registration + user info for notifications
    const result = await pool.query(`
      SELECT r.id, r.e_waste_type, r.weight, r.reward_points, r.status,
             u.email, u.phone_number, u.first_name, u.last_name, u.username
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `, [id]);

    if (result.rows.length > 0) {
      const reg = result.rows[0];
      const userName = reg.first_name ? `${reg.first_name} ${reg.last_name}` : reg.username;

      // Send both in parallel — neither failure blocks the other
      await Promise.allSettled([
        reg.email
          ? sendStatusEmail(reg.email, userName, reg.e_waste_type, reg.weight, status, reg.reward_points)
          : Promise.resolve(),
      ]);
    }

    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ── DELETE (ARCHIVE) — soft delete instead of hard delete ──
app.delete('/api/admin/registrations/:id', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { reason } = req.body; // optional reason from admin

  try {
    await pool.query(
   'UPDATE registrations SET is_archived = TRUE, archived_at = NOW(), archive_reason = $1 WHERE id = $2',
      [reason || 'Archived by admin', id]
    );
    res.json({ success: true, message: 'Record archived successfully.' });
  } catch (err) {
    console.error('Archive error:', err);
    res.status(500).json({ error: 'Failed to archive record.' });
  }
});

// ── GET all active registrations (exclude archived) ────────
app.get('/api/admin/registrations', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

try {
    const result = await pool.query(`
      SELECT r.*, u.username, u.email, u.first_name, u.last_name, u.contact, u.phone_number
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.is_archived IS NOT TRUE
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch registrations error:', err);
    res.status(500).json({ error: 'Failed to fetch registrations.' });
  }
});

// ── GET archived registrations ─────────────────────────────
app.get('/api/admin/registrations/archived', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const result = await pool.query(`
      SELECT r.*, u.username, u.email, u.first_name, u.last_name
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.is_archived = TRUE
      ORDER BY r.archived_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch archived error:', err);
    res.status(500).json({ error: 'Failed to fetch archived records.' });
  }
});

// ── RESTORE from archive ───────────────────────────────────
app.patch('/api/admin/registrations/:id/restore', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE registrations SET is_archived = FALSE, archived_at = NULL, archive_reason = NULL WHERE id = $1',
      [id]
    );
    res.json({ success: true, message: 'Record restored successfully.' });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ error: 'Failed to restore record.' });
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
  const { userId, dropoff_address, e_waste_type, weight, consent } = req.body;

  try {
    // 1. Fetch the names from the users table so they aren't NULL
    const userLookup = await pool.query(
  'SELECT first_name, last_name FROM users WHERE id = $1',
  [userId]
  );

    if (userLookup.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userLookup.rows[0];
    const reward_points = parseFloat(weight || 0) * 5;

    // 2. Use the found names to fill the registration
    await pool.query(
      `INSERT INTO registrations 
      (user_id, first_name, middle_name, last_name, suffix, address, age, e_waste_type, weight, consent, reward_points, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        userId, 
        user.first_name, 
        null,           // middle_name
        user.last_name, 
        null,           // suffix
        dropoff_address || 'Barangay Burol 1', 
        0,
        e_waste_type, 
        weight, 
        consent || false, 
        reward_points, 
        'Pending'
      ]
    );

    res.status(201).json({ success: true, message: 'Success!' });
  } catch (error) {
    console.error('DEBUG:', error.message);
    res.status(500).json({ error: 'Database rejected the entry.', details: error.message });
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
      
    // 2. Fetch all e-waste registrations for this user (exclude archived)
    const regRes = await pool.query('SELECT * FROM registrations WHERE user_id = $1 AND is_archived IS NOT TRUE ORDER BY created_at DESC', [userId]);
      
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
          totalWeight: totalWeight,
          totalRewards: totalRewards,
          registrations: regRes.rows 
        } 
      });

    } catch (err) { 
      console.error(err);
      res.status(500).json({ error: 'Fetch failed' }); 
    }
  });

  app.post('/api/admin/announcements', async (req, res) => {
  try {
    const providedToken = req.headers['x-admin-token'];
    if (!providedToken || providedToken !== process.env.ADMIN_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, content, type } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO announcements (title, content, type) VALUES ($1, $2, $3) RETURNING *`,
      [title, content, type || 'announcement']
    );

    res.status(201).json({ success: true, announcement: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post announcement' });
  }
});

// GET all users (Admin)
app.get('/api/admin/users', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await pool.query('SELECT id, username, email, first_name, last_name, contact, phone_number, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// DELETE user (Admin) - first delete associated registrations
app.delete('/api/admin/users/:id', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // First delete all registrations associated with this user
    await client.query('DELETE FROM registrations WHERE user_id = $1', [id]);
    // Then delete the user
    await client.query('DELETE FROM users WHERE id = $1', [id]);
    await client.query('COMMIT');
    res.json({ success: true, message: 'User and associated registrations deleted successfully.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user.' });
  } finally {
    client.release();
  }
});

app.delete('/api/admin/announcements/:id', async (req, res) => {
  try {
    const providedToken = req.headers['x-admin-token'];
    if (!providedToken || providedToken !== process.env.ADMIN_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

  app.get('/api/health', (req, res) => res.json({ status: 'Server is running' }));

// UPDATE USER PROFILE
app.put('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone_number } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required.' });
  }

  try {
    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, email = $3, phone_number = $4
       WHERE id = $5
       RETURNING id, username, email, first_name, last_name, phone_number`,
      [first_name.trim(), last_name.trim(), email.trim().toLowerCase(), phone_number || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already in use by another account.' });
    }
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

  const PORT = process.env.PORT || 5000;
  initializeDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
  });

  module.exports = app;