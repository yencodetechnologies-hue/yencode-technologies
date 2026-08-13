const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  createCompany,
  getCompanies,
  updateCompanyStatus,
  updateCompany,
  deleteCompany,
  loginCompany,
  getAccount,
} = require("../controllers/companyController");

router.post("/api/companies", createCompany);
router.get("/api/companies", getCompanies);
router.patch("/api/companies/:id/status", updateCompanyStatus);
router.put("/api/companies/:id", updateCompany);
router.delete("/api/companies/:id", deleteCompany);

router.post("/login", loginCompany);
router.get("/api/account", requireAuth, getAccount);

module.exports = router;
