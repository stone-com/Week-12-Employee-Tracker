const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Role = require('./Role');

class Employee extends Model {}

Employee.init(
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'employee',
    freezeTableName: true,
  }
);
