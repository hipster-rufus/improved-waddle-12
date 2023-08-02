const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection(
  {
    host: '127.0.0.1',
    port: 3306,
    user: 'kali',
    password: 'password',
    database: 'company_db'
  },
  console.log(`You are now connected!`)
);

connection.connect(function(err) {
    if (err) throw err;
    startPrompt();
})

function startPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Welcome to the House Targaryen Database! Please select one of the following:',
            name: 'choice',
            choices: [
                'View departments',
                'View roles',
                'View employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ])
    .then(function(res) {
        let choice = res.choice
        console.log(choice);
        switch (choice) {
            case "View departments": viewDepts();
                break;
            case "View roles": viewRoles();
                break;
            case "View employees": viewEmps();
                break;
            case "Add a department": addDeptPrompt();
                break;
            case "Add a role": addRole();
                break;
            case "Add an employee": addMapMgrs();
                break;
            case "Update an employee role": updateMapEmps();
                break;   
            case "Exit": connection.end();
                break;
        }
    });
}

function viewDepts() {
    connection.query(
        "SELECT * FROM departments",
        function(err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
    })
}

function addDeptPrompt() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What would you like to name your new department?"
        }
    ])
    .then(function(res) {
        connection.query(
            "INSERT INTO departments (department) VALUES (?)",
            [res.department],
            function(err, res) {
                if (err) throw err;
                console.log('Your new department has been successfully added!')
                startPrompt();
            }
        )
    })
}

function viewRoles() {
    connection.query(
        `SELECT roles.id, departments.department, roles.title, roles.salary
        FROM roles
        INNER JOIN departments ON roles.department_id = departments.id;`,
        function(err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
    })
}

function addRole() {
    connection.query(
        `SELECT * FROM departments`,
        function(err, res) {
            if (err) throw err;
            const deptMenu = res.map(({id, department}) => ({
                name: `${department}`,
                value: id
            }));

            addRolePrompt(deptMenu);
        }
    )
}  

function addRolePrompt(deptMenu) {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What would you like to name your new role?"
        },
        {
            type: "input",
            name: "salary",
            message: "How much is the salary for this role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Select a department for this role:",
            choices: deptMenu
        }
    ])
    .then(function(res) {
        connection.query(
            "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
            [res.title, res.salary, res.department_id],
            function(err, res) {
                if (err) throw err;
                console.log('Your new role has been successfully added!');
                startPrompt();
            }
        )
    })
}

function viewEmps() {
    connection.query(
        `SELECT 
            employees.id, 
            employees.first_name, 
            employees.last_name, 
            roles.title, 
            departments.department,
            roles.salary,
            employees.manager_id
        FROM employees
        INNER JOIN roles ON employees.role_id = roles.id
        INNER JOIN departments ON roles.department_id = departments.id`,
        function(err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
    })
}


function addMapMgrs() {
    connection.query(
        `SELECT * FROM employees`,
        function(err, res) {
            if (err) throw err;
            const mgrMenu = res.map(({id, first_name, last_name}) => ({
                value: id,
                name: `${first_name} ${last_name}`
            }))

            addMapRoles(mgrMenu);
        }
    )
}

function addMapRoles(mgrMenu) {
    connection.query(
        `SELECT roles.id, roles.title, roles.salary
        FROM roles`,
        function(err, res) {
            if (err) throw err;
            const roleMenu = res.map(({id, title, salary}) => ({
                value: id,
                name: `${title}`,
                salary: `${salary}`
            }));

            addEmpPrompt(roleMenu, mgrMenu);
        }
    )
}

function addEmpPrompt(roleMenu, mgrMenu) {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is your new employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is their last name?"
        },
        {
            type: "list",
            name: "role_id",
            message: "Select a role for this employee:",
            choices: roleMenu
        },
        {
            type: "list",
            name: "manager_id",
            message: "Select a manager for this employee:",
            choices: mgrMenu
        },
    ])
    .then(function(res) {
        connection.query(
            `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", ${res.role_id}, ${res.manager_id})`,
            function(err) {
                if (err) throw err;
                console.log('Your new employee has been successfully added!');
                startPrompt();
            }
        )
    })
}

function updateMapEmps(){
    connection.query(
        `SELECT * FROM employees`,
        function(err, res) {
            if (err) throw err;
            const empMenu = res.map(({id, first_name, last_name}) => ({
                value: id,
                name: `${first_name} ${last_name}`
            }))

            updateMapRoles(empMenu)
        }
    )
}

function updateMapRoles(empMenu){
    connection.query(
        `SELECT * FROM roles`,
        function(err, res) {
            if (err) throw err;
            const roleMenu = res.map(({id, title, salary}) => ({
                value: id,
                name: `${title}`,
                salary: `${salary}`
            }))
            updateEmpRole(empMenu, roleMenu);
        }
    )
}

function updateEmpRole(empMenu, roleMenu){
        inquirer.prompt([
            {
                type: "list",
                name: "employee_id",
                message: "Select an employee to update their role:",
                choices: empMenu
            },
            {
                type: "list",
                name: "role_id",
                message: "Select a new role:",
                choices: roleMenu
            }
        ])
        .then(function(res) {
            connection.query(
                `UPDATE employees
                SET role_id = ${res.role_id}
                WHERE id = ${res.employee_id}`,
                function(err) {
                    if (err) throw err;
                    console.log('Your employee`s roll has been successfully updated!');
                    startPrompt();
                })
        }
    )
}