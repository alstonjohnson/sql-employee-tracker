
const inquirer = require('inquirer');
const postgres = require('pg'); 


const tracker = function () {
    inquirer.createPromptModule([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View all dpartments', 'View all roles', 'view all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an empolyee role']
    }])
}