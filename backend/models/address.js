const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Address",
    {
      address: { type: DataTypes.STRING, allowNull: false },

      countryName: { type: DataTypes.STRING, allowNull: false },
      countryCode: { type: DataTypes.STRING, allowNull: false },

      stateName: { type: DataTypes.STRING, allowNull: false },
      stateCode: { type: DataTypes.STRING, allowNull: false },

      cityName: { type: DataTypes.STRING, allowNull: false },
      cityCode: { type: DataTypes.STRING, allowNull: false }, // optional

      pincode: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "addresses",
      timestamps: true,
    }
  );
