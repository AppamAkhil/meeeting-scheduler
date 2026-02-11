
const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");
const User = require("../../user/model/user.model");

const Meeting = sequelize.define("Meeting", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false }
}, { paranoid: true });

User.hasMany(Meeting, { foreignKey: "userId" });
Meeting.belongsTo(User, { foreignKey: "userId" });

module.exports = Meeting;
