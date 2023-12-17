const UniversityData = artifacts.require("UniversityData");

contract("UniversityData", accounts => {
    let universityData;

    before(async () => {
        universityData = await UniversityData.deployed();
    });

    describe("addStudent", () => {
        it("should add a new student", async () => {
            const studentId = 1;
            const name = "Alice";
            const programme = "Computer Science";
            const joinYear = 2020;
            const cgpa = 350;
            const graduateYear = 2024;

            await universityData.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear);

            const student = await universityData.getStudent(studentId);
            assert.equal(student.name, name, "Name should match");
            // Add other assertions as needed
        });
    });

    describe("updateStudent", () => {
        it("should update an existing student", async () => {
            const studentId = 1;
            const updatedCgpa = 380;

            await universityData.updateStudent(studentId, "Alice", "Computer Science", 2020, updatedCgpa, 2024);

            const student = await universityData.getStudent(studentId);
            assert.equal(student.cgpa, updatedCgpa, "CGPA should be updated");
            // Add other assertions as needed
        });
    });

    // Add more tests for other functionalities
});
