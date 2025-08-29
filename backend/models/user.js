const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "User",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      age: { type: DataTypes.INTEGER, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING },
      role: { type: DataTypes.STRING, defaultValue: "user" },
      imageUrl: {
        type: DataTypes.STRING(500), // allow up to 500 chars
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );
