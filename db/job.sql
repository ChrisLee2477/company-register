SELECT job.id AS `Id`, job.title AS `Title`, department.depart_name AS `Deparment`, job.salary AS `Money`
FROM department JOIN job
ON department.id = job.department_id;

