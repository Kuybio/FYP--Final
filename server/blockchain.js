const Web3 = require('web3');
const universityDataABI = require('../build/contracts/UniversityData.json').abi; // Import ABI
const contractAddress = '0x6c35F6F7F727A7bB676e5BB73Ff66C6240D5B50c'; // Use your contract address here

// Initialize web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Create a contract instance
const UniversityDataContract = new web3.eth.Contract(universityDataABI, contractAddress);

// Function to add a new student
async function addStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    const accounts = await web3.eth.getAccounts();
    await UniversityDataContract.methods.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear).send({ from: accounts[0] });
}

// Function to update an existing student
async function updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    const accounts = await web3.eth.getAccounts();
    await UniversityDataContract.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).send({ from: accounts[0] });
}

// Function to get student data
async function getStudent(studentId) {
    return await UniversityDataContract.methods.getStudent(studentId).call();
}

module.exports = {
    addStudent,
    updateStudent,
    getStudent,
};
