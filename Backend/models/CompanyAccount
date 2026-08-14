const mongoose = require("mongoose");

const companyAccountSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountStatus: { type: Boolean, default: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Payment Successful", "Payment Failed"],
      default: "Pending",
    },
    paymentDetails: {
      amount: Number,
      txnid: String,
      paymentDate: Date,
      mode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyAccount", companyAccountSchema);
