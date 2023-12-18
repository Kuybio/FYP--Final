const Web3 = require('web3');
const contract = require('@truffle/contract');

// Define the ABI and address of your deployed contract
const universityDataABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "ErrorLog",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "studentId",
        "type": "uint256"
      }
    ],
    "name": "StudentAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "studentId",
        "type": "uint256"
      }
    ],
    "name": "StudentUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_studentId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_programme",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_joinYear",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_cgpa",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_graduateYear",
        "type": "uint256"
      }
    ],
    "name": "addOrUpdateStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "studentId",
        "type": "uint256"
      }
    ],
    "name": "getStudent",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "studentId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "programme",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "joinYear",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cgpa",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "graduateYear",
            "type": "uint256"
          }
        ],
        "internalType": "struct UniversityData.Student",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "studentId",
        "type": "uint256"
      }
    ],
    "name": "getStudentDataHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const contractAddress = '0x6c35F6F7F727A7bB676e5BB73Ff66C6240D5B50c';

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
