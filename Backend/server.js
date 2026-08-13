require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const corsOptions = require("./config/corsOptions");

const companyRoutes = require("./routes/companyRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();
const PORT = process.env.PORT || 1524;

app.use(cors(corsOptions));
app.use(express.json());

app.use(companyRoutes);
app.use(paymentRoutes);
app.use(healthRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    // connectDB already logs the error
  });
