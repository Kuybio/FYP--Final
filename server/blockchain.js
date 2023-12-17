const Web3 = require('web3');
const { abi } = require('../build/contracts/UniversityData.json'); // Update path to ABI file

const web3 = new Web3('http://localhost:7545'); // Update with your provider URL
const contractAddress = '0x6c35F6F7F727A7bB676e5BB73Ff66C6240D5B50c'; // Update with your contract address
const privateKey = '0x6449d67debeb3b9471474b20b74b5e04ebbcf4c97ff48c8dde24b1257f07ad6b'; // Update with your private key

const universityDataContract = new web3.eth.Contract(abi, contractAddress);

async function addStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
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
        gas: await estimateGas(fromAddress, data),
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
