require("dotenv").config();

const required = ["PORT", "MONGODB_URI", "CORS_ORIGIN"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Variables d'environnement manquantes : ${missing.join(", ")}`
  );
}

module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN,
  jwtSecret: process.env.JWT_SECRET || "CUSTOM_PRIVATE_KEY",
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@test.com",
    password: process.env.ADMIN_PASSWORD || "admin",
    firstName: process.env.ADMIN_FIRST_NAME || "Admin",
    lastName: process.env.ADMIN_LAST_NAME || "User",
  },
};
