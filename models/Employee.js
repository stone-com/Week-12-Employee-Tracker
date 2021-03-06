const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Role = require('./Role');

class Employee extends Model {}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'role',
        key: 'id',
      },
    },
    manager_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      references: {
        model: 'employee',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'employee',
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Employee;
