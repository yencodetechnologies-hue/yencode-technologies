const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendPaymentSuccessEmail({ to, companyName, amount, txnid, payuId, paymentDate, pdfBuffer }) {
  const visibleTransactionId = payuId || txnid || "-";

  await transporter.sendMail({
    from: `"Yencode Technologies" <${process.env.SMTP_USER}>`,
    to,
    subject: `Payment Successful - ${companyName}`,
    html: `
      <h2>Payment Successful</h2>
      <p>Dear ${companyName},</p>
      <p>We have received your payment of <b>₹${amount}</b>.</p>
      <p><b>Transaction ID:</b> ${visibleTransactionId}</p>
      <p><b>Date:</b> ${new Date(paymentDate).toLocaleString()}</p>
      <p>Your receipt is attached.</p>
    `,
    attachments: pdfBuffer
      ? [{ filename: `receipt_${txnid}.pdf`, content: pdfBuffer }]
      : [],
  });
}

module.exports = { sendPaymentSuccessEmail };