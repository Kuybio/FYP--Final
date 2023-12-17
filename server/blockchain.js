const Web3 = require('web3');
const UniversityDataContract = require('../build/contracts/UniversityData.json');

const web3 = new Web3('http://localhost:7545'); // Adjust with your Ethereum client URL
const contractAddress = '0x6c35F6F7F727A7bB676e5BB73Ff66C6240D5B50c'; // Replace with your contract address

// Import and initialize universityDataContract
const contract = new web3.eth.Contract(UniversityDataContract.abi, contractAddress);

const sendTransaction = async (tx, privateKey) => {
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};

async function addStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
    try {
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods
        .addStudent(studentId, name, programme, joinYear, cgpa, graduateYear)
        .send({ from: accounts[0] });
      return result;
    } catch (error) {
      throw error;
    }
  }

const updateStudent = async (fromAddress, privateKey, studentId, name, programme, joinYear, cgpa, graduateYear) => {
    const data = universityDataContract.methods.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear).encodeABI();
    const tx = {
        from: fromAddress,
        to: contractAddress,
        data: data,
        gas: 2000000,
    };
    return sendTransaction(tx, privateKey);
};

module.exports = { addStudent, updateStudent };
