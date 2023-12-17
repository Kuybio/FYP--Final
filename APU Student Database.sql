CREATE DATABASE UNI;

USE UNI;

CREATE TABLE Students (
    studentId INT PRIMARY KEY,
    name VARCHAR(255),
    programme VARCHAR(255),
    joinYear INT,
    cgpa INT NULL,  -- CGPA is nullable and will be updated later
    graduateYear INT NULL  -- Graduate year is nullable and will be updated later
);

INSERT INTO Students (studentId, name, programme, joinYear, cgpa, graduateYear) VALUES
(1, 'John Doe', 'Computer Science', 2020, 350, 2024),
(2, 'Jane Smith', 'Mechanical Engineering', 2021, NULL, NULL),
(3, 'Alice Johnson', 'Electrical Engineering', 2019, 375, 2023),
(4, 'Bob Brown', 'Chemistry', 2022, NULL, NULL),
(5, 'Michael Davis', 'Physics', 2021, 390, NULL),
(6, 'Sarah Wilson', 'Mathematics', 2020, NULL, 2024),
(7, 'Gary Moore', 'Biology', 2019, 330, 2023),
(8, 'Linda Taylor', 'English Literature', 2022, NULL, NULL),
(9, 'David Miller', 'Political Science', 2020, 365, NULL),
(10, 'Emma Anderson', 'Art History', 2021, NULL, NULL);
