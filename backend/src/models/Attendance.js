const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent"),
      allowNull: false,
    },
  },
  {
    tableName: "attendance",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["employeeId", "date"],
      },
      {
        fields: ["employeeId"],
      },
    ],
  }
);

module.exports = Attendance;
