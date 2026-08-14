const crypto = require("crypto");
const CompanyAccount = require("../models/CompanyAccount");
const { sendPaymentSuccessEmail } = require("../utils/mailer");
const { generateReceiptPDF } = require("../utils/receiptGenerator");

// POST /api/payment/payu-initiate
exports.initiatePayU = (req, res) => {
  try {
    const { amount, firstname, email, phone } = req.body || {};

    const parsedAmount =
      parseFloat(String(amount).replace(/[^0-9.]/g, "")) || 0;

    if (parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const formattedAmount = parsedAmount.toFixed(2);
    const productinfo = "Yencode Technologies Payment";

    const fname = (firstname || "").trim() || "Customer";
    const mail = (email || "").trim().toLowerCase();

    const key = process.env.PAYU_KEY || "gtKFFx";
    const salt =
      process.env.PAYU_SALT ||
      "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW";

    const txnid = `txn_${Date.now()}`;

    const ph =
      (phone || "9999999999").replace(/\D/g, "").slice(0, 10) ||
      "9999999999";

    const hashString =
      `${key}|${txnid}|${formattedAmount}|${productinfo}|${fname}|${mail}|||||||||||${salt}`;

    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    const backendUrl = (
      process.env.APP_BASE_URL ||
      "https://yencodeweb.octosofttechnologies.in"
    ).replace(/\/$/, "");

    const env = process.env.PAYU_ENV === "prod" ? "prod" : "test";

    const payuUrl =
      env === "prod"
        ? "https://secure.payu.in/_payment"
        : "https://test.payu.in/_payment";

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

        // IMPORTANT
        surl: `${backendUrl}/api/payment/payu-success`,
        furl: `${backendUrl}/api/payment/payu-failure`,

        hash,
      },
    });
  } catch (err) {
    console.error("[PayU] initiate error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================================
// PAYU SUCCESS CALLBACK
// =====================================================
exports.payuSuccess = async (req, res) => {
  try {
    console.log("=================================");
    console.log("PAYU SUCCESS CALLBACK");
    console.log("BODY:", req.body);
    console.log("=================================");

    const {
      email,
      txnid,
      amount,
      mode,
      mihpayid,
      status,
    } = req.body || {};

    if (!email) {
      console.error("PayU success callback: email missing");

      return res.status(400).send("Payment callback email missing");
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Find the company using case-insensitive email
    const account = await CompanyAccount.findOne({
      email: normalizedEmail,
    });

    if (!account) {
      console.error(
        "Company not found for PayU email:",
        normalizedEmail
      );

      return res.status(404).send("Company account not found");
    }

    const paymentDate = new Date();

    // =====================================================
    // THIS IS THE IMPORTANT UPDATE
    // =====================================================
    account.paymentStatus = "Payment Successful";

    account.paymentDetails = {
      amount: Number(amount) || 0,
      txnid: txnid || "",
      paymentDate,
      mode: mode || "Online",
      mihpayid: mihpayid || "",
    };

    await account.save();

    console.log(
      "PAYMENT STATUS UPDATED:",
      account.email,
      account.paymentStatus
    );

    // Send receipt email
    try {
      const pdfBuffer = await generateReceiptPDF({
        companyName: account.companyName,
        email: account.email,
        mobileNumber: account.mobileNumber,
        amount: Number(amount) || 0,
        txnid: txnid || "",
        paymentDate,
      });

      await sendPaymentSuccessEmail({
        to: account.email,
        companyName: account.companyName,
        amount: Number(amount) || 0,
        txnid: txnid || "",
        paymentDate,
        pdfBuffer,
      });
    } catch (mailErr) {
      console.error(
        "Receipt email error:",
        mailErr.message
      );
    }

    // Redirect to frontend
    return res.redirect(
      `${process.env.FRONTEND_URL || "https://yencodeweb.octosofttechnologies.in"}/payment-success`
    );

  } catch (err) {
    console.error(
      "PAYU SUCCESS CALLBACK ERROR:",
      err
    );

    return res.status(500).send(
      "Unable to update payment status"
    );
  }
};


// =====================================================
// PAYU FAILURE CALLBACK
// =====================================================
exports.payuFailure = async (req, res) => {
  try {
    console.log("=================================");
    console.log("PAYU FAILURE CALLBACK");
    console.log("BODY:", req.body);
    console.log("=================================");

    const {
      email,
      txnid,
      amount,
      mode,
      mihpayid,
    } = req.body || {};

    if (!email) {
      console.error(
        "PayU failure callback: email missing"
      );

      return res.status(400).send(
        "Payment callback email missing"
      );
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    const account = await CompanyAccount.findOne({
      email: normalizedEmail,
    });

    if (!account) {
      console.error(
        "Company not found for failed payment:",
        normalizedEmail
      );

      return res.status(404).send(
        "Company account not found"
      );
    }

    // =====================================================
    // IMPORTANT FAILURE UPDATE
    // =====================================================
    account.paymentStatus = "Payment Failed";

    account.paymentDetails = {
      amount: Number(amount) || 0,
      txnid: txnid || "",
      paymentDate: new Date(),
      mode: mode || "Online",
      mihpayid: mihpayid || "",
    };

    await account.save();

    console.log(
      "PAYMENT STATUS UPDATED:",
      account.email,
      account.paymentStatus
    );

    return res.redirect(
      `${process.env.FRONTEND_URL || "https://yencodeweb.octosofttechnologies.in"}/payment-failed`
    );

  } catch (err) {
    console.error(
      "PAYU FAILURE CALLBACK ERROR:",
      err
    );

    return res.status(500).send(
      "Unable to update payment status"
    );
  }
};