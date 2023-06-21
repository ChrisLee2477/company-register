const inquirer = require('inquirer')
const mysql = require('mysql2');
const ctable = require('console.table')


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'hiclass1!',
      database: 'work_db'
    },
    console.log(`Connected to the work_db database.`)
  );

const question = {
    type: 'list',
    message: 'What do you want to do?',
    name: 'toDo',
    choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit']
}

const questionDepart = {
  type: 'input',
  message: 'What is the name of the new department?',
  name: 'newDepart'
}

const questionRole = [
  {
    type: 'input',
    message: 'Name of the Role?',
    name: 'roleName'
  },
  {
    type: 'number',
    message: 'How much does this role make',
    name: 'salary'
  },
  {
    type: 'number',
    message: 'What department is this role in?',
    name: 'roleDepart'
  }
]

const questionEmployee = [
  {
    type: 'input',
    message: "What is the new employee's first name?",
    name: 'firstName'
  },
  {
    type: 'input',
    message: "What is the new employee's last name?",
    name: 'lastName'
  },
  {
    type: 'number',
    message: 'What role is this person in?',
    name: 'roleEmployee'
  },
  {
    type: 'number',
    message: 'Who is this person manager?',
    name: 'newManager'
  }
]

const questionUpdateEmployee = [
  {
    type: 'number',
    message: 'Who are you trying to update?',
    name: 'updateEmployee'
  },
  {
    type: 'number',
    message: 'What new role do they have?',
    name: 'newEmployeeRole'
  }
]

const newDepartmant = (answers) => {
  const { newDepart } = answers
      db.query(`INSERT INTO department (depart_name) VALUES (?)`,newDepart, function(err, results){
        if (err) throw err
        init()
      })
}

const newRole = (answers) => {
  const { roleName, salary, roleDepart } = answers
        db.query(`INSERT INTO job (title, salary, department_id) VALUES (?, ?, ?)`,[roleName, salary, roleDepart], function(err, results){
          if (err) throw err
          init()
      })
}

const newEmployee = (answers) => {
  const { firstName, lastName, roleEmployee, newManager } = answers
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [firstName, lastName, roleEmployee, newManager], function(err, results){
          if (err) throw err
          init()
      })
}

const updateEmployee = (answers) => {
  const { updateEmployee, newEmployeeRole } = answers
        db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [ newEmployeeRole, updateEmployee], function(err, results){
          if (err) throw err
          init()
      })
}

const handleAnswers = (answers) => {
  const { toDo } = answers
    if(toDo === 'View all Departments'){
      db.query('SELECT * FROM department', function(err, results){
        if (err) throw err
        console.table(results)
        init()
      })
    }else if(toDo === 'View all Roles'){
      db.query(`SELECT job.id AS Id, job.title AS Title, department.depart_name AS Deparment, job.salary AS Money FROM department JOIN job ON department.id = job.department_id;`, function (err,results){
        if (err) throw err
        console.table(results)
        init()
      })
    }else if(toDo === 'View all Employees'){
      db.query(`SELECT employee.id AS Id, employee.first_name AS First_Name, employee.last_name AS Last_Name,  job.title AS Title, department.depart_name AS Deparment , job.salary AS Money, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM department INNER JOIN job ON job.department_id = department.id INNER JOIN employee ON employee.role_id = job.id LEFT JOIN employee e on employee.manager_id = e.id;`, function (err,results){
        if (err) throw err
        console.table(results)
        init()
      })
    }else if (toDo === 'Add a Department'){ 
      inquirer
      .prompt(questionDepart)
      .then(newDepartmant)
    }else if (toDo === 'Add a Role'){
      inquirer
      .prompt(questionRole)
      .then(newRole)
    }else if(toDo === 'Add an Employee'){
      inquirer
      .prompt(questionEmployee)
      .then(newEmployee)
    }else if(toDo === 'Update an Employee Role'){
      inquirer
      .prompt(questionUpdateEmployee)
      .then(updateEmployee)
    }else{
      return process.exit()
    } 
}

function init() {
    inquirer
    .prompt(question)
    .then(handleAnswers)
    
}

init();