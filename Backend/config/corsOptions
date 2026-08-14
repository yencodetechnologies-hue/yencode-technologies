const allowedOrigins = [
  "http://localhost:5173",
  "https://www.yencodetechnologies.com",
  "https://yencodetechnologies.com",
  "https://yencodeweb.octosofttechnologies.in",
  "https://test.payu.in",
  "https://secure.payu.in",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === "null") return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith("payu.in")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
