SELECT employee.id AS `Id`, employee.first_name AS `First Name`, employee.last_name AS `Last Name`,  job.title AS `Title`, department.depart_name AS `Deparment`, job.salary AS `Money`, employee.manager_id AS `Manager`
FROM department 
INNER JOIN job ON job.department_id = department.id
INNER JOIN employee ON employee.role_id = job.id
