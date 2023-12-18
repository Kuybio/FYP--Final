const Web3 = require('web3');
const universityDataABI = require('../build/contracts/UniversityData.json').abi;
const contractAddress = '0x9A6e79edc16E6CCFfB9daC280ED734FA52623CB0';

// Initialize web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Create a contract instance
const UniversityDataContract = new web3.eth.Contract(universityDataABI, contractAddress);

// Function to add a new student with specified gas limit
async function addStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    const accounts = await web3.eth.getAccounts();
    const estimatedGas = await UniversityDataContract.methods.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear).estimateGas({ from: accounts[0] });
    await UniversityDataContract.methods.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear).send({ from: accounts[0], gas: estimatedGas });
}

// Function to update an existing student with specified gas limit
async function updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    const accounts = await web3.eth.getAccounts();
    const estimatedGas = await UniversityDataContract.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).estimateGas({ from: accounts[0] });
    await UniversityDataContract.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).send({ from: accounts[0], gas: estimatedGas });
}

// Other functions...

module.exports = {
    addStudent,
    updateStudent,
    // ... other exported functions
};
