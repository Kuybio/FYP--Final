// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UniversityData {
    struct Student {
        uint256 studentId;
        string name;
        string programme;
        uint256 joinYear;
        uint256 cgpa;
        uint256 graduateYear;
        bytes32 dataHash; // SHA-256 hash of the student data
    }

    mapping(uint256 => Student) private students;
    event StudentAdded(uint256 indexed studentId, bytes32 dataHash);
    event StudentUpdated(uint256 indexed studentId, bytes32 dataHash);

    // Add a new student
        function addStudent(uint256 _studentId, string memory _name, string memory _programme, uint256 _joinYear, uint256 _cgpa, uint256 _graduateYear) public {
        require(_studentId != 0, "Invalid Student ID");
        require(_cgpa <= 400, "Invalid CGPA");
        require(students[_studentId].studentId == 0, "Student already exists");

        students[_studentId] = Student(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear);
        bytes32 dataHash = sha256(abi.encodePacked(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear));
        studentDataHashes[_studentId] = dataHash;
        
        emit StudentAdded(_studentId, dataHash);
    }

    // Update an existing student
    function updateStudent(uint256 _studentId, string memory _name, string memory _programme, uint256 _joinYear, uint256 _cgpa, uint256 _graduateYear) public {
        require(students[_studentId].studentId != 0, "Student does not exist");
        
        bytes32 dataHash = sha256(abi.encodePacked(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear));
        students[_studentId] = Student(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear, dataHash);
        
        emit StudentUpdated(_studentId, dataHash);
    }

    // Get student data
    function getStudent(uint256 _studentId) public view returns (Student memory) {
        require(_studentId != 0, "Invalid Student ID");
        require(students[_studentId].studentId != 0, "Student not found");
        return students[_studentId];
    }
}
