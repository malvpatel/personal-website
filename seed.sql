-- Seed file for Harry Potter family data based on the '0001_initial_entity.sql' schema

-- Inserting into 'entities' table
INSERT INTO entities (id, full_name, gender, birth_date, death_date, notes) VALUES
(1, 'Harry Potter', 'male', '1980-07-31', NULL, 'The Boy Who Lived'),
(2, 'Ginny Weasley', 'female', '1981-08-11', NULL, 'Harry Potter''s wife'),
(3, 'James Potter', 'male', '1960-03-27', '1981-10-31', 'Harry Potter''s father'),
(4, 'Lily Potter', 'female', '1960-01-30', '1981-10-31', 'Harry Potter''s mother'),
(5, 'Albus Severus Potter', 'male', '2006-01-01', NULL, 'Harry Potter''s second son'),
(6, 'James Sirius Potter', 'male', '2004-01-01', NULL, 'Harry Potter''s first son'),
(7, 'Lily Luna Potter', 'female', '2008-01-01', NULL, 'Harry Potter''s daughter'),
(8, 'Arthur Weasley', 'male', '1950-02-06', NULL, 'Father of the Weasley family'),
(9, 'Molly Weasley', 'female', '1949-08-18', NULL, 'Mother of the Weasley family'),
(10, 'Ron Weasley', 'male', '1980-03-01', NULL, 'Harry Potter''s best friend and Ginny''s brother'),
(11, 'Hermione Granger', 'female', '1979-09-19', NULL, 'Harry Potter''s best friend and Ron''s wife'),
(12, 'Fred Weasley', 'male', '1978-04-01', '1998-05-02', 'Weasley twin'),
(13, 'George Weasley', 'male', '1978-04-01', NULL, 'Weasley twin'),
(14, 'Bill Weasley', 'male', '1970-11-29', NULL, 'Eldest Weasley brother'),
(15, 'Fleur Delacour', 'female', '1977-08-01', NULL, 'Bill Weasley''s wife'),
(16, 'Percy Weasley', 'male', '1976-08-22', NULL, 'Weasley brother, Ministry official'),
(17, 'Charlie Weasley', 'male', '1972-12-12', NULL, 'Weasley brother, dragon tamer'),
(18, 'Minerva McGonagall', 'female', '1935-10-04', NULL, 'Headmistress of Hogwarts');

-- Inserting into 'spouses' table
INSERT INTO spouses (spouse1_id, spouse2_id, start_date, end_date) VALUES
(3, 4, '1979-01-01', '1981-10-31'), -- James and Lily Potter
(1, 2, '2000-01-01', NULL),       -- Harry Potter and Ginny Weasley
(8, 9, '1969-01-01', NULL),       -- Arthur and Molly Weasley
(14, 15, '1997-08-01', NULL);      -- Bill Weasley and Fleur Delacour

-- Inserting into 'parent_child' table
INSERT INTO parent_child (parent_id, child_id) VALUES
(3, 1), -- James Potter -> Harry Potter
(4, 1), -- Lily Potter -> Harry Potter
(1, 5), -- Harry Potter -> Albus Severus Potter
(2, 5), -- Ginny Weasley -> Albus Severus Potter
(1, 6), -- Harry Potter -> James Sirius Potter
(2, 6), -- Ginny Weasley -> James Sirius Potter
(1, 7), -- Harry Potter -> Lily Luna Potter
(2, 7), -- Ginny Weasley -> Lily Luna Potter
(8, 2), -- Arthur Weasley -> Ginny Weasley
(9, 2), -- Molly Weasley -> Ginny Weasley
(8, 10), -- Arthur Weasley -> Ron Weasley
(9, 10), -- Molly Weasley -> Ron Weasley
(8, 12), -- Arthur Weasley -> Fred Weasley
(9, 12), -- Molly Weasley -> Fred Weasley
(8, 13), -- Arthur Weasley -> George Weasley
(9, 13), -- Molly Weasley -> George Weasley
(8, 14), -- Arthur Weasley -> Bill Weasley
(9, 14), -- Molly Weasley -> Bill Weasley
(8, 16), -- Arthur Weasley -> Percy Weasley
(9, 16), -- Molly Weasley -> Percy Weasley
(8, 17), -- Arthur Weasley -> Charlie Weasley
(9, 17); -- Molly Weasley -> Charlie Weasley
