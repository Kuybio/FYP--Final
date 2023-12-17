// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UniversityDataV2 {
    struct Student {
        uint256 studentId;
        string name;
        string programme;
        uint256 joinYear;
        uint256 cgpa;
        uint256 graduateYear;
    }

    mapping(uint256 => Student) private students;
    event StudentAdded(uint256 indexed studentId);
    event StudentUpdated(uint256 indexed studentId);

    // Add a new student
    function addStudent(uint256 _studentId, string memory _name, string memory _programme, uint256 _joinYear, uint256 _cgpa, uint256 _graduateYear) public {
        require(students[_studentId].studentId == 0, "Student already exists");
        students[_studentId] = Student(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear);
        emit StudentAdded(_studentId);
    }

    // Update an existing student
    function updateStudent(uint256 _studentId, string memory _name, string memory _programme, uint256 _joinYear, uint256 _cgpa, uint256 _graduateYear) public {
        require(students[_studentId].studentId != 0, "Student does not exist");
        students[_studentId] = Student(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear);
        emit StudentUpdated(_studentId);
    }

    // Get student data
    function getStudent(uint256 _studentId) public view returns (Student memory) {
        require(_studentId != 0, "Invalid Student ID");
        return students[_studentId];
    }
}
