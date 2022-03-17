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
    raw: true,
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

// function to add a new role
const addRole = () => {
  // initialize empty array of departments, will be populated by findall query and used as selections in inquirer prompt
  let depArray = [];
  // find all departments
  Department.findAll().then((departments) => {
    departments.forEach((department) => {
      //   create a string with dep id and dep name and push it to deparray
      depArray.push(department.id + ' ' + department.name);
    });
    //   prompt user for info about new role
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Enter the title of the role',
          name: 'title',
        },
        {
          type: 'input',
          message: 'Enter the salary for the role',
          name: 'salary',
        },
        {
          type: 'list',
          message: 'Choose a department',
          name: 'Department',
          choices: depArray,
        },
      ])
      .then((answer) => {
        // declare depId variable, will be set and then used when creating role
        let depId;
        departments.forEach((department) => {
          // loop through all departments, if id + name = user answer, then set depId variable to the department id.
          // depId variable will be used to pass in when we create the role.
          if (department.id + ' ' + department.name === answer.department) {
            depId = department.id;
          }
        });
        Role.create({
          // create new role passing in user  prompt answers, and passing in depId variable.
          title: answer.title,
          salary: answer.salary,
          department_id: depId,
        })
          .then(() => {
            console.log(
              `New Role called ${answer.title} has been successfully created!`
            );
            userPrompt();
          })
          .catch((err) => {
            console.log(err);
            userPrompt();
          });
      });
  });
};

// function to add an employee
const addEmployee = () => {
  // initilize variables as empty arrays for role and manager arrays
  let managerArray = [];
  let roleArray = [];
  // find all roles and push them to role array.
  Role.findAll().then((roles) => {
    roles.forEach((role) => {
      roleArray.push(role.title);
    });
    // find all employees, then push each one into manager array
    Employee.findAll().then((employees) => {
      employees.forEach((employee) => {
        managerArray.push(employee.first_name + ' ' + employee.last_name);
      });
    });
    // prompt user for information about new employee
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Enter new employee first name:',
          name: 'first_name',
        },
        {
          type: 'input',
          message: 'Enter new employee last name:',
          name: 'last_name',
        },
        {
          type: 'list',
          message: 'Choose role:',
          name: 'role',
          choices: roleArray,
        },
        {
          type: 'list',
          message: 'Choose the manager:',
          name: 'manager',
          choices: managerArray,
        },
      ])
      .then((answer) => {
        //   create variables for role and manager id, will be used to pass in when creating employee.
        let managerId;
        let roleId;
        // loop through roles and compare role titles to user answer, if matches then set roleid variable to role.id
        roles.forEach((role) => {
          if (role.title === answer.role) {
            roleId = role.id;
          }
        });
        // loop through employees, if first and last name match user answer, set managerId variable to employee.id
        employees.forEach((employee) => {
          if (
            employee.first_name + ' ' + employee.last_name ===
            answer.manager
          ) {
            managerId = employee.id;
          }
        });
        // create new Employee passing in user answers.
        Employee.create({
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: roleId,
          manager_id: managerId,
        })
          .then(() => {
            console.log(
              `New employee ${answer.first_name} ${answer.last_name} has been added.`
            );
            userPrompt();
          })
          .catch((err) => {
            console.log(err);
            userPrompt();
          });
      });
  });
};

// function to update employee role

const updateEmployeeRole = () => {
  // create variables employeearray and rolearray. will findall and store results into these arrays
  let roleArray = [];
  let employeeArray = [];
  // findall employees and push first and last name to array
  Employee.findAll().then((employees) => {
    employees.forEach((employee) => {
      employeeArray.push(employee.first_name + ' ' + employee.last_name);
    });
    // findall roles and push the results to rolearray
    Role.findAll().then((roles) => {
      roles.forEach((role) => {
        roleArray.push(role.title);
      });
      // prompt user for employee and role info
      inquirer.prompt([
        {
          type: 'list',
          message: 'Choose employee:',
          name: 'employee',
          choices: employeeArray,
        },
        {
          type: 'list',
          message: 'Choose role:',
          name: 'role',
          choices: roleArray,
        },
      ])
      .then(answer => {
        // NEEED TO DO THIS PART NOW!!
      })
    });
  });
};

//  run db.sync to start the app and connect to db
db.sync({ force: true }).then(() => {
  userPrompt();
});
