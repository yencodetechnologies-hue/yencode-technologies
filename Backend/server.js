require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose
.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(process.env.PORT || 1524, () => {
      console.log(`Server running on port ${process.env.PORT || 1524}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });
const PORT = process.env.PORT || 1524;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const crypto = require('crypto');

const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment'; // use https://secure.payu.in/_payment in production

app.post('/api/payment/payu-initiate', requireAuth, (req, res) => {
  const { amount, firstname, email, phone } = req.body || {};

  if (!amount || !firstname || !email || !phone) {
    return res.status(400).json({ success: false, message: 'amount, firstname, email, phone are required' });
  }

  const txnid = 'TXN' + Date.now();
  const productinfo = 'Yencode Technologies Service';

  // PayU hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  return res.json({
    success: true,
    payuUrl: PAYU_BASE_URL,
    params: {
      key: PAYU_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: `${process.env.APP_BASE_URL}/api/payment/payu-success`,
      furl: `${process.env.APP_BASE_URL}/api/payment/payu-failure`,
      hash,
    },
  });
});

app.post('/api/payment/payu-success', (req, res) => {
  // TODO: verify response hash, mark order paid, then redirect to your frontend
  res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
});

app.post('/api/payment/payu-failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
});
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
app.post('/login', (req, res) => {
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
// PayU init — mirrors M-Business PaymentController.initPayU
app.post('/api/payment/payu-initiate', requireAuth, (req, res) => {
  try {
    const { amount, firstname, email, phone } = req.body || {};

    const parsedAmount = parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
    if (parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
    }
    const formattedAmount = parsedAmount.toFixed(2);

    // Falls back to PayU's public test credentials if .env is missing them —
    // this is what stops the "PayU credentials missing" error.
    const key = process.env.PAYU_KEY || 'gtKFFx';
    const salt = process.env.PAYU_SALT || '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW';

    const txnid = `txn_${Date.now()}`;
    const productinfo = 'Yencode Technologies Payment';
    const fname = (firstname || '').trim() || 'Customer';
    const mail = (email || '').trim();
    const ph = (phone || '9999999999').replace(/\D/g, '').slice(0, 10) || '9999999999';

    const hashString = `${key}|${txnid}|${formattedAmount}|${productinfo}|${fname}|${mail}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const backendUrl = (process.env.APP_BASE_URL || 'http://localhost:1524').replace(/\/$/, '');
    const env = process.env.PAYU_ENV === 'prod' ? 'prod' : 'test';
    const payuUrl = env === 'prod' ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment';

    return res.json({
      success: true,
      payuUrl,
      params: {
        key,
        txnid,
        amount: formattedAmount,
        productinfo,
        firstname: fname,
        email: mail,
        phone: ph,
        surl: `${backendUrl}/api/payment/payu-success`,
        furl: `${backendUrl}/api/payment/payu-failure`,
        hash,
      },
    });
  } catch (err) {
    console.error('[PayU] initiate error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/payment/payu-success', (req, res) => {
  console.log('PayU success callback:', req.body);
  res.redirect(`${process.env.FRONTEND_URL || 'https://yencodeweb.octosofttechnologies.in/api/health'}/payment-success`);
});

app.post('/api/payment/payu-failure', (req, res) => {
  console.log('PayU failure callback:', req.body);
  res.redirect(`${process.env.FRONTEND_URL || 'https://yencodeweb.octosofttechnologies.in/api/health'}/payment-failed`);
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Yencode auth backend running on http://localhost:${PORT}`);
});
