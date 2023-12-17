const { expect } = require('chai');
const { addOrUpdateStudent } = require('../server/blockchain.js');

describe('Blockchain Functionality', () => {
  it('should add or update a student on the blockchain', async () => {
    // Setup test data
    const testData = {
      studentId: 1,
      name: "Alice",
      programme: "Computer Science",
      joinYear: 2021,
      cgpa: 350,
      graduateYear: 2024,
      fromAddress: "0xB4cE6bac673F150ba36D53E3dfd94dCf59a3129c", // Replace with actual Ethereum address
      privateKey: "0x6449d67debeb3b9471474b20b74b5e04ebbcf4c97ff48c8dde24b1257f07ad6b"  // Replace with actual private key
    };

    // Call the function
    const result = await addOrUpdateStudent(
      testData.studentId,
      testData.name,
      testData.programme,
      testData.joinYear,
      testData.cgpa,
      testData.graduateYear,
      testData.fromAddress,
      testData.privateKey
    );

    // Assertions
    expect(result).to.be.an('object'); // Modify based on expected result
    // Add more assertions as needed
  });

  // Additional tests for other functions...
});
