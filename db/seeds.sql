INSERT INTO departments (department)
VALUES ("Members"),
       ("Court"),
       ("Household");

INSERT INTO roles (title, salary, department_id)
VALUES ("king", 100000, 1),
       ("queen", 82000, 1),
       ("prince", 75000, 1),
       ("princess", 61500, 1),
       ("maester", 15000, 1),
       ("handmaiden", 32000, 3),
       ("warrior", 45000, 3),
       ("knight", 50000, 2),
       ("commander", 55000, 2),
       ("advisor", 42000, 2),
       ("hand", 65000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Aerys II", "Targaryen", 1, null),
       ("Rhaella", "Targaryen", 2, 1),
       ("Rhaegar", "Targaryen", 3, 1),
       ("Rhaenys", "Targaryen", 4, 3),
       ("Aegon", "Targaryen", 3, 3),
       ("Viserys", "Targaryen", 3, 1),
       ("Daenerys", "Targaryen", 2, null),
       ("Aemon", "Targaryen", 5, null),
       ("Irri", "", 6, 7),
       ("Doreah", "", 6, 7),
       ("Rakharo", "", 7, 7),
       ("Barristan", "Selmy", 8, 7),
       ("Missandei", "", 6, 7),
       ("Daario", "Naharis", 10, 7),
       ("Grey Worm", "", 9, 7),
       ("Tyrion", "Lannister", 11, 7),
       ("Varys", "", 10, 7),
       ("Jorah", "Mormont", 8, 7);

       
