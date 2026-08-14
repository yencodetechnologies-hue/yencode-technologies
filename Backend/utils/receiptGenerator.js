const PDFDocument = require("pdfkit");

function generateReceiptPDF({ companyName, email, mobileNumber, amount, txnid, paymentDate }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("Yencode Technologies", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text("Payment Receipt", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Transaction ID: ${txnid}`);
    doc.text(`Date: ${new Date(paymentDate).toLocaleString()}`);
    doc.text(`Company: ${companyName}`);
    doc.text(`Email: ${email}`);
    doc.text(`Mobile: ${mobileNumber}`);
    doc.moveDown();
    doc.fontSize(14).text(`Amount Paid: Rs. ${amount}`, { underline: true });

    doc.end();
  });
}

module.exports = { generateReceiptPDF };