const Web3 = require('web3');
const contractABI = require('../build/contracts/UniversityData.json').abi; // Replace with actual ABI file path
const contractAddress = '0x6c35F6F7F727A7bB676e5BB73Ff66C6240D5B50c'; // Replace with your deployed contract address

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL

// Function to add or update student on the blockchain
async function addOrUpdateStudent(studentId, name, programme, joinYear, cgpa, graduateYear, fromAddress, privateKey) {
    const universityDataV2 = new web3.eth.Contract(contractABI, contractAddress);

    let data;
    // Check if student exists, to decide whether to add or update
    const studentExists = await universityDataV2.methods.getStudent(studentId).call();
    if (studentExists.studentId === '0') { // Assuming a non-existent student returns '0' for studentId
        data = universityDataV2.methods.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();
    } else {
        data = universityDataV2.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();
    }

    const transaction = {
        from: fromAddress,
        to: contractAddress,
        data: data,
        gas: 2000000 // Set appropriate gas limit
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

// Function to get student data
async function getStudent(studentId) {
    const universityDataV2 = new web3.eth.Contract(contractABI, contractAddress);
    return await universityDataV2.methods.getStudent(studentId).call();
}

module.exports = {
    addOrUpdateStudent,
    getStudent,
    addStudent
};
