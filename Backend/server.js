require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// ---------------------------------------------------------------------------
// "Database" — single account, matching the requested credentials.
// Swap this for a real DB (MongoDB/Postgres) later; keep the same shape.
// ---------------------------------------------------------------------------
const ACCOUNT = {
  email: process.env.ADMIN_EMAIL || 'yencodetechnologies@gmail.com',
  password: process.env.ADMIN_PASSWORD || '123456', // plain text only for this demo
  companyName: 'Yencode Technologies',
  mobileNumber: '+91 90000 00000',
};

// ---------------------------------------------------------------------------
// Middleware: verify JWT on protected routes
// ---------------------------------------------------------------------------
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// ---------------------------------------------------------------------------
// POST /api/login
// ---------------------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const emailMatches = email.trim().toLowerCase() === ACCOUNT.email.toLowerCase();
  const passwordMatches = password === ACCOUNT.password;

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email: ACCOUNT.email }, JWT_SECRET, { expiresIn: '2h' });

  return res.json({
    success: true,
    token,
    account: {
      companyName: ACCOUNT.companyName,
      email: ACCOUNT.email,
      mobileNumber: ACCOUNT.mobileNumber,
    },
  });
});

// ---------------------------------------------------------------------------
// GET /api/account  (protected)
// ---------------------------------------------------------------------------
app.get('/api/account', requireAuth, (req, res) => {
  return res.json({
    success: true,
    account: {
      companyName: ACCOUNT.companyName,
      email: ACCOUNT.email,
      mobileNumber: ACCOUNT.mobileNumber,
    },
  });
});

// ---------------------------------------------------------------------------
// POST /api/payment/initiate  (protected)
// Stub endpoint — wire this to Razorpay/Stripe etc. later.
// ---------------------------------------------------------------------------
app.post('/api/payment/initiate', requireAuth, (req, res) => {
  const { amount = 0, purpose = 'Service Payment' } = req.body || {};

  return res.json({
    success: true,
    payment: {
      id: 'PAY-' + Date.now(),
      amount,
      purpose,
      status: 'pending',
      email: req.user.email,
    },
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Yencode auth backend running on http://localhost:${PORT}`);
});
