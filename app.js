const { Role, Department, Employee } = require('./models/index');
const inquirer = require('inquirer');
const db = require('./config/connection');

// Function to prompt user with choices using inquirer

const userPrompt = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select an option:',
        name: 'userOption',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add department',
          'Add a role',
          'Add an employee',
          'Update employee role',
          'Update employee manager',
          'Delete employee',
          'Quit',
        ],
      },
    ])
    .then((answer) => {
      // Switch for whichever choice user picks, will call corresponding function to handle user choice
      switch (answer.userOption) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Update employee manager':
          updateEmployeeManager();
          break;
        case 'Delete employee':
          deleteEmployee();
          break;
        case 'Quit':
          process.exit();
      }
    });
};
