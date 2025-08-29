const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./db");

const User = require("./models/user")(sequelize);
const Address = require("./models/address")(sequelize);
const uploadRoutes = require("./routes/uploadRoute");

// Setup associations
User.hasMany(Address, { foreignKey: "userId", onDelete: "CASCADE" });
Address.belongsTo(User, { foreignKey: "userId" });

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
app.use("/api", userRoutes);
app.use("/api", uploadRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to MySQL with Sequelize.");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Sequelize connection error:", err));
