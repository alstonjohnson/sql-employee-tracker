
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
            database.query(`SELECT * FROM department`, (err, result) => {
                // if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result);
                tracker();
            });
        } else if (answers.prompt === 'View all roles') {
            database.query(`SELECT * FROM role`, (err, result) => {
                // if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result);
                tracker();
            });
        } else if (answers.prompt === 'View all employees') {
            database.query(`SELECT * FROM employee`, (err, result) => {
                // if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
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
                database.query(`INSERT INTO department (name) VALUES (?)`, [departmentAnswers.department], (err, result) => {
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
                            return result.map(department => department.name);
                        }
                    }
                ]).then((roleAnswers) => {
                    const department = result.find(dep => dep.name === roleAnswers.department);
                    database.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [roleAnswers.role, roleAnswers.salary, department.id], (err, result) => {
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
                            return result.map(role => role.title);
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
                    const role = result.find(r => r.title === employeeAnswers.role);
                    database.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [employeeAnswers.firstName, employeeAnswers.lastName, role.id, employeeAnswers.manager], (err, result) => {
                        // if (err) throw err;
                        console.log(`Added ${employeeAnswers.firstName} ${employeeAnswers.lastName} to the database.`);
                        tracker();
                    });
                });
            });
    } else if (answers.prompt === 'Update An Employee Role') {if (answers.prompt === 'Add An Employee') {
        database.query(`SELECT * FROM employee, role`, (result) => {

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employees first name?',
                    validate: firstNameInput => {
                        if (firstNameInput) {
                            return true;
                        } else {
                            console.log('Please Add A First Name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the employees last name?',
                    validate: lastNameInput => {
                        if (lastNameInput) {
                            return true;
                        } else {
                            console.log('Please Add A Salary!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employees role?',
                    choices: () => {
                        const array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(result[i].title);
                        }
                        const newArray = [...new Set(array)];
                        return newArray;
                    }
                },
                {
                    type: 'input',
                    name: 'manager',
                    message: 'Who is the employees manager?',
                    validate: managerInput => {
                        if (managerInput) {
                            return true;
                        } else {
                            console.log('Please Add A Manager!');
                            return false;
                        }
                    }
                }
            ]).then((answers) => {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].title === answers.role) {
                        const role = result[i];
                    }
                }

                database.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (result) => {
                    console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                    tracker();
                });
            })
        });
    }
        database.query(`SELECT * FROM employee, role`, (result) => {

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employees role do you want to update?',
                    choices: () => {
                        const array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(result[i].last_name);
                        }
                        const employeeArray = [...new Set(array)];
                        return employeeArray;
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is their new role?',
                    choices: () => {
                        const array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(result[i].title);
                        }
                        const newArray = [...new Set(array)];
                        return newArray;
                    }
                }
            ]).then((answers) => {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].last_name === answers.employee) {
                        const name = result[i];
                    }
                }

                for (var i = 0; i < result.length; i++) {
                    if (result[i].title === answers.role) {
                        const role = result[i];
                    }
                }

                database.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: role }, { last_name: name }], (result) => {
                    console.log(`Updated ${answers.employee} role to the database.`)
                    tracker();
                });
            })
        });
 } });
};

tracker();