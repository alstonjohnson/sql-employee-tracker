
DROP DATABASE IF EXISTS employee_database;
CREATE DATABASE employee_database;

\c employee_database;

CREATE TABLE department (
    id INTEGER SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INTEGER SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER
);

CREATE TABLE employee (
    id INTEGER SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);