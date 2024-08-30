
const inquirer = require('inquirer');
const postgres = require('pg'); 
const database = require('./db/connection')


const tracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View all dpartments', 'View all roles', 'view all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an empolyee role']
    }]).then((answers) => {
        if (answers.prompt === 'View all departments') {
            database.query(`SELECT * FROM department`, (result) => {
                console.log("Viewing All Departments: ");
                console.table(result);
                tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            database.query(`SELECT * FROM role`, (result) => {
                console.log("Viewing All Roles: ");
                console.table(result);
                tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            database.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                tracker();
            });
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the dpeartment?',
                validate: deptInput => {
                    if (deptInput) {
                        return true;
                    } else {
                        console.log('Please Add A Department!');
                        return false;
                    }
                }
            }]).then((answers) => {
                database.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (result) => {
                    console.log(`Added ${answers.department} to the database.`)
                    tracker();
                });
            })
        } 
    })
}