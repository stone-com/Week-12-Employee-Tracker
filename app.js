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

// function to view all departments
const viewDepartments = () => {
  // findall departments then log them in a table in the console
  Department.findAll().then((departments) => {
    console.table(departments, ['id', 'name']);
    userPrompt();
  });
};

// function to view all roles
const viewRoles = () => {
  // findall roles, include department, then display table with role id, title, salary, and department name
  Role.findAll({
    include: [{ model: Department }],
  }).then((roles) => {
    console.table(roles, ['id', 'title', 'salary', 'Department.name']);
    userPrompt();
  });
};

// function to view all employes
const viewEmployees = () => {
  // findall employees, include Role, then display table with id, first and last name, role title, salary, manager id, and department id.
  Employee.findAll({
    include: [{ model: Role }],
  }).then((employees) => {
    console.table(employees, [
      'id',
      'first_name',
      'last_name',
      'Role.title',
      'Role.salary',
      'manager_id',
      'Role.department_id',
    ]);
    userPrompt();
  });
};

// function to add a department
const addDepartment = () => {
  // prompt user to enter name for new department to add
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter the name of the department you want to add:',
        name: 'name',
      },
    ])
    // create a new department passing in the user inputted name as the name of department
    .then((answer) => {
      Department.create({
        name: answer.name,
      })
        // Console log successful creation
        .then(() => {
          console.log(
            `New department with name: ${answer.name} successfully created!`
          );
          userPrompt();
        })
        .catch((err) => {
          console.log(err);
          userPrompt();
        });
    });
};
