const connection = require("./connection");

class DB {
    //Keeping a refernce to the connection on the class in case we need it later
    constructor(connection) {
        this.connection = connection;
    };

    //Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
    findAllEmployees() {
        //select statement with the following columns from three tables
        //select id, first_name, last_name from employee table and 
        //select department name from department table and 
        //select salary from role table
        //use left joins to join three tables
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, department.name, role.salary FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id;"            
        );
    };

    //find all the departments and list them out to show the id, department name, the sum of the salaries of the employees working in that department
    findAllDepartments() {
        return this.connection.query(
            "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name"
        );
    };

    //defined function to find all employees by department with departmentId passed into it
    findAllEmployeesByDepartment(departmentId) {
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id = ?;",
            departmentId
        );
    };

    //function to find all roles
    findAllRoles() {
        return this.connection.query(
            //select the following columns:
            //id, title, salary from role table
            //name from department table
            //left join to join role and department tables
            "SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON department.id = role.department_id;"
        );
    };

    //function to update employee role
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [roleId, employeeId]
        );
    };

    //function to create a new role and insert it into role table
    createRole(role) {
        return this.connection.query(
            "INSERT INTO role SET ?",
            role
        );
    };

    //function to create a new department and insert into department table
    createDepartment(department) {
        return this.connection.query(
            "INSERT INTO department SET ?",
            department
        );
    };

    //function to create a new employee and insert into employee table
    createEmployee(employee) {
        return this.connection.query(
            "INSERT INTO employee SET ?",
            employee
        );
    };
    
    //function to find all managers
    findAllManagers() {
        return this.connection.query(
            "SELECT employee.first_name, employee.last_name, employee.id FROM employee WHERE employee.manager_id IS NULL"
        );
    };

    //function to find employees for a certain manager using the managerId provided by the user via prompts
    findAllEmployeesByManager( managerId ) {
        return this.connection.query(
            "SELECT CONCAT (employee.first_name, ' ', employee.last_name) AS employees FROM employee WHERE manager_id = ?",
            managerId
        );
    };

    //function to delete employee
    deleteEmployee (employeeId) {
        return this.connection.query(
            "DELETE FROM employee WHERE id = ?",
            employeeId
        );
    };

    //function to delete a role
    deleteRole (roleId) {
        return this.connection.query(
            "DELETE FROM role WHERE id = ?",
            roleId
        );
    };

    //function to delete a department
    deleteDepartment (departmentId) {
        return this.connection.query(
            "DELETE FROM department WHERE id = ?",
            departmentId
        );
    };
}

module.exports = new DB(connection);