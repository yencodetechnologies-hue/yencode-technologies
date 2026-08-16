const jwt = require("jsonwebtoken");
const CompanyAccount = require("../models/CompanyAccount");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const account = await CompanyAccount.findOne({ email: payload.email });
    if (!account) {
      return res.status(401).json({ success: false, message: "Account not found" });
    }

    if (!account.accountStatus) {
      return res.status(403).json({ success: false, message: "Account deactivated" });
    }

    req.user = { ...payload, _id: account._id };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
module.exports.JWT_SECRET = JWT_SECRET;
