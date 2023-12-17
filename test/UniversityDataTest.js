const UniversityData = artifacts.require("UniversityData");

contract("UniversityData", accounts => {
    let universityData;

    before(async () => {
        universityData = await UniversityData.deployed();
    });

    it("should add a new student", async () => {
        await universityData.addOrUpdateStudent(1, "Alice", "Computer Science", 2021, 350, 0);
        let student = await universityData.getStudent(1);
        
        assert.equal(student.name, "Alice", "The name of the student should be Alice");
        assert.equal(student.programme, "Computer Science", "The programme should be Computer Science");
    });

    it("should update an existing student", async () => {
        await universityData.addOrUpdateStudent(1, "Alice", "Mathematics", 2021, 370, 2024);
        let student = await universityData.getStudent(1);

        // Assuming graduateYear is returned as a simple number
        assert.equal(student.graduateYear, 2024, "The graduation year should be updated to 2024");
        assert.equal(student.programme, "Mathematics", "The programme should be updated to Mathematics");
    });

    it("should fail for invalid student ID", async () => {
        try {
            await universityData.addOrUpdateStudent(0, "Bob", "Physics", 2022, 300, 0);
            assert.fail("The contract did not throw with an invalid student ID");
        } catch (err) {
            assert.include(err.message, "Invalid Student ID", "The error message should contain 'Invalid Student ID'");
        }
    });

    it("should fail for invalid CGPA", async () => {
        try {
            await universityData.addOrUpdateStudent(2, "Carol", "Biology", 2022, 500, 0);
            assert.fail("The contract did not throw with an invalid CGPA");
        } catch (err) {
            assert.include(err.message, "Invalid CGPA", "The error message should contain 'Invalid CGPA'");
        }
    });
});
