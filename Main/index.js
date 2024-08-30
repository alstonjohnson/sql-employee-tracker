
const inquirer = require('inquirer');
const postgres = require('pg'); 


const questions = function () {
    inquirer.createPromptModule([{
        type: 'list',
    }])
}