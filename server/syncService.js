const Web3 = require('web3');
const contract = require('@truffle/contract');

// Define the ABI and address of your deployed contract
const universityDataABI = [/* ... ABI of your contract ... */];
const contractAddress = '/* Your Contract Address */';

// Initialize web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Initialize the contract
const UniversityDataContract = contract({
  abi: universityDataABI,
});
UniversityDataContract.setProvider(web3.currentProvider);

// Function to add a new student
async function addStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
  const instance = await UniversityDataContract.at(contractAddress);
  await instance.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear, { from: web3.eth.defaultAccount });
}

// Function to update an existing student
async function updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear) {
  const instance = await UniversityDataContract.at(contractAddress);
  await instance.updateStudent(studentId, name, programme, joinYear, cgpa, graduateYear, { from: web3.eth.defaultAccount });
}

// Function to get student data
async function getStudent(studentId) {
  const instance = await UniversityDataContract.at(contractAddress);
  return await instance.getStudent(studentId);
}

module.exports = {
  addStudent,
  updateStudent,
  getStudent,
};
