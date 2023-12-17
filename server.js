const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const schedule = require('node-schedule');
const blockchain = require('../server/blockchain');
const database = require('../server/database');
const { syncWithBlockchain } = require('../server/syncService');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Body parser middleware to handle JSON data
app.use(bodyParser.json());

// Initialize web3 and set the provider to your Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')); // or your Ethereum node URL

// Schedule a job to sync with the blockchain periodically
const syncJob = schedule.scheduleJob('*/1 * * * *', function() {
  console.log('Running Sync Job');
  syncWithBlockchain(database, blockchain);
});

// Endpoint to add a student (can be used if manual addition is needed)
app.post('/api/addStudent', async (req, res) => {
  // Extract student data from the request body
  const { studentId, name, programme, joinYear, cgpa, graduateYear } = req.body;
  
  try {
    const result = await blockchain.addStudent(studentId, name, programme, joinYear, cgpa, graduateYear);
    res.json({ success: true, message: 'Student added successfully!', transactionHash: result.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding student', error: error.message });
  }
});

// Endpoint to get a student's data
app.get('/api/getStudent/:studentId', async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const studentData = await blockchain.getStudent(studentId);
    res.json({ success: true, studentData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving student data', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
