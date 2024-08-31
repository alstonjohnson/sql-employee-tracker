
DROP DATABASE IF EXISTS employee_database;
CREATE DATABASE employee_database;
USE employee_database;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);