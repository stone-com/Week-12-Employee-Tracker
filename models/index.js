const Department = require('./Department');
const Employee = require('./Employee');
const Role = require('./Role');

Employee.belongsTo(Employee, { as: 'manager', foreignKey: 'manager_id' });
Employee.belongsTo(Role, { foreignKey: 'role_id' });
Role.belongsTo(Department, { foreignKey: 'department_id' });

module.exports = { Department, Role, Employee };
