// Run once to create the first admin account: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log("Admin already exists:", existing.email);
  } else {
    const admin = await Admin.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      provider: "local",
    });
    console.log("Admin created:", admin.email);
  }

  process.exit();
};

run();
