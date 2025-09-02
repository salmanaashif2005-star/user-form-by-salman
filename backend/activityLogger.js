// backend/activityLogger.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db"); // ✅ correct path

// Define the model
const ActivityLog = sequelize.define(
  "user_activity",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    eventType: { type: DataTypes.STRING, allowNull: false },
    eventTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    metadata: { type: DataTypes.JSON, allowNull: true },
    projectName: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "user_activity", // ✅ force table name
    timestamps: true,
  }
);

// Function to log activity
const logActivity = async (
  userId,
  eventType,
  metadata = {},
  projectName = "MyApp"
) => {
  try {
    await ActivityLog.create({
      userId,
      eventType,
      metadata,
      projectName,
    });
    console.log(`✅ Activity logged: ${eventType} by user ${userId}`);
  } catch (err) {
    console.error("❌ Failed to log activity:", err);
  }
};

// Sync function (ensure table exists)
const initActivityTable = async () => {
  await ActivityLog.sync();
  console.log("✅ ActivityLog table is ready");
};

module.exports = { logActivity, initActivityTable, ActivityLog };
