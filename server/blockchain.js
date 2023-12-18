const Web3 = require('web3');
const universityDataABI = require('../build/contracts/UniversityData.json').abi; // Import ABI
const contractAddress = '0x6c35F6F7F727A7bB676e5BB73Ff66C6240D5B50c'; // Use your contract address here

// Initialize web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Create a contract instance
const universityDataContract = new web3.eth.Contract(universityDataABI, contractAddress);

const fromAddress = '0xB4cE6bac673F150ba36D53E3dfd94dCf59a3129c'; 
const privateKey = '0x6449d67debeb3b9471474b20b74b5e04ebbcf4c97ff48c8dde24b1257f07ad6b'; 

// Function to add a new student
async function addStudent(studentId, name, programme, joinYear, cgpa, graduateYear, fromAddress, privateKey) {
    try {
        // Log the private key for debugging (remove or comment out in production)
        console.log(`Private Key: ${privateKey}`);
        const data = universityDataContract.methods.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();

        const tx = {
            from: fromAddress,
            to: contractAddress,
            gas: 2000000, // Set the gas limit
            data: data
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`Student added: Transaction hash - ${receipt.transactionHash}`);
        return receipt;
    } catch (error) {
        console.error(`Error adding student: ${error.message}`);
        throw error;
    }
}

// Function to update an existing student
async function updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear, fromAddress, privateKey) {
    try {
        const data = universityDataContract.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();

        const tx = {
            from: fromAddress,
            to: contractAddress,
            gas: 2000000, // Set the gas limit
            data: data
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`Student updated: Transaction hash - ${receipt.transactionHash}`);
        return receipt;
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
