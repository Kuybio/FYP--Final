const Web3 = require('web3');
const universityDataABI = require('../build/contracts/UniversityData.json').abi; // Import ABI
const contractAddress = '0x6c35F6F7F727A7bB676e5BB73Ff66C6240D5B50c'; // Use your contract address here

// Initialize web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Create a contract instance
const UniversityDataContract = new web3.eth.Contract(universityDataABI, contractAddress);

// Function to add a new student with a fixed gas limit
async function addStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await UniversityDataContract.methods.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear).send({ from: accounts[0], gas: 2000000 });
        console.log(`Student added: ${result.transactionHash}`);
        return result;
    } catch (error) {
        console.error(`Error adding student: ${error.message}`);
        throw error;
    }
}

// Function to update an existing student with a fixed gas limit
async function updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await UniversityDataContract.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).send({ from: accounts[0], gas: 2000000 });
        console.log(`Student updated: ${result.transactionHash}`);
        return result;
    } catch (error) {
        console.error(`Error updating student: ${error.message}`);
        throw error;
    }
}

// Other functions...

module.exports = {
    addStudent,
    updateStudent,
    // ... other exported functions
};
