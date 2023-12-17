const Web3 = require('web3');
const UniversityDataContract = require('../build/contracts/UniversityData.json');

const web3 = new Web3('http://localhost:7545'); // Adjust with your Ethereum client URL
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
const contract = new web3.eth.Contract(UniversityDataContract.abi, contractAddress);

const sendTransaction = async (tx, privateKey) => {
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};

const addStudent = async (fromAddress, privateKey, studentId, name, programme, joinYear, cgpa, graduateYear) => {
    const data = contract.methods.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();
    const tx = {
        from: fromAddress,
        to: contractAddress,
        data: data,
        gas: 2000000,
    };
    return sendTransaction(tx, privateKey);
};

const updateStudent = async (fromAddress, privateKey, studentId, name, programme, joinYear, cgpa, graduateYear) => {
    const data = contract.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();
    const tx = {
        from: fromAddress,
        to: contractAddress,
        data: data,
        gas: 2000000,
    };
    return sendTransaction(tx, privateKey);
};

module.exports = { addStudent, updateStudent };
