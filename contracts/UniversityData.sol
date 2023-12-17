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
    }

    mapping(uint256 => Student) private students;
    mapping(uint256 => bytes32) private studentDataHashes;
    address public owner;

    event StudentAdded(uint256 indexed studentId);
    event StudentUpdated(uint256 indexed studentId);
    event ErrorLog(string message);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }

    function addOrUpdateStudent(uint256 _studentId, string memory _name, string memory _programme, uint256 _joinYear, uint256 _cgpa, uint256 _graduateYear) public onlyOwner {
        if (students[_studentId].studentId == 0) {
            addStudent(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear);
        } else {
            updateStudent(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear);
        }
    }

    function addStudent(uint256 _studentId, string memory _name, string memory _programme, uint256 _joinYear, uint256 _cgpa, uint256 _graduateYear) internal {
        require(_studentId != 0, "Invalid Student ID");
        require(_cgpa <= 400, "Invalid CGPA");
        require(students[_studentId].studentId == 0, "Student already exists");

        students[_studentId] = Student(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear);
        bytes32 dataHash = sha256(abi.encodePacked(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear));
        studentDataHashes[_studentId] = dataHash;

        emit StudentAdded(_studentId);
    }

    function updateStudent(uint256 _studentId, string memory _name, string memory _programme, uint256 _joinYear, uint256 _cgpa, uint256 _graduateYear) internal {
        require(_studentId != 0, "Invalid Student ID");
        require(_cgpa <= 400, "Invalid CGPA");
        require(students[_studentId].studentId != 0, "Student does not exist");

        students[_studentId] = Student(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear);
        bytes32 dataHash = sha256(abi.encodePacked(_studentId, _name, _programme, _joinYear, _cgpa, _graduateYear));
        studentDataHashes[_studentId] = dataHash;

        emit StudentUpdated(_studentId);
    }

    function getStudent(uint256 studentId) public view returns (Student memory) {
        require(studentId != 0, "Invalid Student ID");
        return students[studentId];
    }

    function getStudentDataHash(uint256 studentId) public view returns (bytes32) {
        require(studentId != 0, "Invalid Student ID");
        return studentDataHashes[studentId];
    }

    // Additional functions and logic as needed...
}
