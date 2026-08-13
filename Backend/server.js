require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://www.yencodetechnologies.com',
  'https://yencodetechnologies.com',
  'https://yencodeweb.octosofttechnologies.in',
  'https://test.payu.in',
  'https://secure.payu.in'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "null") return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith("payu.in")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
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
const mongoose_Schema = new mongoose.Schema({
  companyName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountStatus: { type: Boolean, default: true },
  paymentStatus: { type: String, enum: ['Pending', 'Payment Successful', 'Payment Failed'], default: 'Pending' },
  paymentDetails: {
    amount: Number,
    txnid: String,
    paymentDate: Date,
    mode: String,
  },
}, { timestamps: true });

const CompanyAccount = mongoose.model('CompanyAccount', mongoose_Schema);

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
app.post('/api/companies', async (req, res) => {
  try {
    const {
      companyName,
      mobileNumber,
      email,
      password
    } = req.body || {};

    if (
      !companyName?.trim() ||
      !mobileNumber?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const exists = await CompanyAccount.findOne({
      email: cleanEmail
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const company = await CompanyAccount.create({
      companyName: companyName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: cleanEmail,
      password: password
    });

    return res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        companyName: company.companyName,
        mobileNumber: company.mobileNumber,
        email: company.email,
        password: company.password,
        createdAt: company.createdAt
      }
    });

  } catch (err) {
    console.error('POST /api/companies error:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});


app.get('/api/companies', async (req, res) => {
  try {
    const companies = await CompanyAccount.find({}, 'companyName mobileNumber email accountStatus paymentStatus paymentDetails createdAt').sort({ createdAt: -1 });
    return res.json({ success: true, companies });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const account = await CompanyAccount.findOne({ email: email.trim().toLowerCase() });
    if (!account || account.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!account.accountStatus) {
      return res.status(403).json({ success: false, message: 'This account has been disabled.' });
    }

    const token = jwt.sign({ email: account.email }, JWT_SECRET, { expiresIn: '2h' });

    return res.json({
      success: true,
      token,
      account: {
        _id: account._id,
        companyName: account.companyName,
        email: account.email,
        mobileNumber: account.mobileNumber,
        paymentStatus: account.paymentStatus,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/account  (protected)
// ---------------------------------------------------------------------------
app.get('/api/account', requireAuth, async (req, res) => {
  try {
    const account = await CompanyAccount.findOne({ email: req.user.email });
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
    return res.json({
      success: true,
      account: {
        companyName: account.companyName,
        email: account.email,
        mobileNumber: account.mobileNumber,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
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

     const hashString = `${key}|${txnid}|${formattedAmount}|${productinfo}|${fname}|${mail}||||||||||${salt}`;
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


