
const inquirer = require('inquirer');
const postgres = require('pg');
const database = require('./db/connection');

const tracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    }]).then((answers) => {
        if (answers.prompt === 'View all departments') {
            database.query(`SELECT * FROM department`).then( ({rows}) => {
                // if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(rows);
                tracker();
            });
        } else if (answers.prompt === 'View all roles') {
            database.query(`SELECT * FROM role`).then( ({rows}) => {
                // if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(rows);
                tracker();
            });
        } else if (answers.prompt === 'View all employees') {
            database.query(`SELECT * FROM employee`).then( ({rows}) => {
                // if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(rows);
                tracker();
            });
        } else if (answers.prompt === 'Add a department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: deptInput => {
                    if (deptInput) {
                        return true;
                    } else {
                        console.log('Please add a department name!');
                        return false;
                    }
                }
            }]).then((departmentAnswers) => {
                database.query(`INSERT INTO department (name) VALUES ($1)`, [departmentAnswers.department], (err, result) => {
                    // if (err) throw err;
                    console.log(`Added ${departmentAnswers.department} to the database.`);
                    tracker();
                });
            });
        } else if (answers.prompt === 'Add a role') {
            database.query(`SELECT * FROM department`, (err, result) => {
                // if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please add a role!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please add a salary!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            return result.rows.map(department => department.name);
                        }
                    }
                ]).then((roleAnswers) => {
                    const department = result.rows.find(dep => dep.name === roleAnswers.department);
                    database.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [roleAnswers.role, roleAnswers.salary, department.id], (err, result) => {
                        // if (err) throw err;
                        console.log(`Added ${roleAnswers.role} to the database.`);
                        tracker();
                    });
                });
            });
        } else if (answers.prompt === 'Add an employee') {
            database.query(`SELECT * FROM role`, (err, result) => {
                // if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employee\'s first name?',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Please add a first name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employee\'s last name?',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please add a last name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employee\'s role?',
                        choices: () => {
                            return result.rows.map(role => role.title);
                        }
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employee\'s manager?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Please add a manager!');
                                return false;
                            }
                        }
                    }
                ]).then((employeeAnswers) => {
                    const role = result.rows.find(r => r.title === employeeAnswers.role);
                    database.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [employeeAnswers.firstName, employeeAnswers.lastName, role.id, employeeAnswers.manager], (err, result) => {
                        // if (err) throw err;
                        console.log(`Added ${employeeAnswers.firstName} ${employeeAnswers.lastName} to the database.`);
                        tracker();
                    });
                });
            });
    } else if (answers.prompt === 'Update an employee role') {
        database.query(`SELECT * FROM employee, role`, (err, result) => {
            // if (err) throw err;
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee\'s role do you want to update?',
                    choices: () => {
                        const employeeArray = [...new Set(result.rows.map(row => row.last_name))];
                        return employeeArray;
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is their new role?',
                    choices: () => {
                        const roleArray = [...new Set(result.rows.map(row => row.title))];
                        return roleArray;
                    }
                }
            ]).then((answers) => {
                const name = result.rows.find(row => row.last_name === answers.employee);
                const role = result.rows.find(row => row.title === answers.role);

                database.query(`UPDATE employee SET role_id = $1 WHERE last_name = $2`, [role.id, name.last_name], (err, result) => {
                    // if (err) throw err;
                    console.log(`Updated ${answers.employee}'s role in the database.`);
                    tracker();
                });
            });
        });
    }
    });
};

tracker();
