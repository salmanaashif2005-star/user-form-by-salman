const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db");

const User = require("./models/user")(sequelize, DataTypes);
const Address = require("./models/address")(sequelize, DataTypes);

const uploadRoutes = require("./routes/uploadRoute");
const { initActivityTable } = require("./activityLogger");
const authMiddleware = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes")(
  User,
  Address,
  authMiddleware
);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", uploadRoutes);

// Associations
User.hasMany(Address, { foreignKey: "userId", onDelete: "CASCADE" });
Address.belongsTo(User, { foreignKey: "userId" });

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL with Sequelize.");
    return sequelize.sync(); // Auto-create tables
  })
  .then(() => initActivityTable()) // Ensure activity table is ready
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Sequelize connection error:", err));
