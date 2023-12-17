const Web3 = require('web3');
const { abi } = require('../build/contracts/UniversityData.json'); // Update path to ABI file

const web3 = new Web3('http://localhost:7545'); // Update with your provider URL
const contractAddress = '0x0C4545eeEE323206C47ca62b978fA9199292e4A4'; // Update with your contract address
const privateKey = '0xa8e80c311133db047d75d286bc69904c0e652f9c98e06891ecaca8b0b1f0c576'; // Update with your private key

const universityDataContract = new web3.eth.Contract(abi, contractAddress);

async function addStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    // Ensure that all parameters are defined and not null
    if (!studentId || !name || !programme || !joinYear || cgpa == null || graduateYear == null) {
        throw new Error("Invalid input parameters");
    }

    const fromAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
    const data = universityDataContract.methods.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();
    
    const tx = {
        from: fromAddress,
        to: contractAddress,
        data: data,
        gas: await estimateGas(fromAddress, data),
    };

    return sendTransaction(tx, privateKey);
}

async function updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    const fromAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
    const data = universityDataContract.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();
    const tx = {
        from: fromAddress,
        to: contractAddress,
        data: data,
        gas: 2000000,
    };
    return sendTransaction(tx, privateKey);
}

async function estimateGas(fromAddress, data) {
    return await web3.eth.estimateGas({
        from: fromAddress,
        to: contractAddress,
        data: data,
    });
}

async function sendTransaction(tx, privateKey) {
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

module.exports = {
    addStudent,
    updateStudent,
};
