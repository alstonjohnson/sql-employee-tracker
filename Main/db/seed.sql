
INSERT INTO department (name)
VALUES  ('Finance'),
        ('Brand Team'),
        ('IT'),
        ('Procurement'),
        ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES  ('Staff Accountant', 70000, 1),
        ('Senior Accountant', 90000, 1),
        ('Social Media Manager', 95000, 2), 
        ('Software Engineer', 100000, 3),
        ('Procurement Specialist', 70000, 4), 
        ('Chief Operations Officer', 150000, 5),
        ('Full Stack Developer', 100000, 3),
        ('Data Analyst', 110000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Nasery', 'Athear', 1, 2),
        ('Stark', 'Skip', 2, null),
        ('Martin', 'Carter', 3, null),
        ('Wegman', 'Michael', 4, 7),
        ('Maza', 'Rowena', 5, 6),
        ('Mann', 'Mike', 6, null),
        ('Johnson', 'Alston', 7, null),
        ('Hazlewood', 'Amber', 8, null);

    