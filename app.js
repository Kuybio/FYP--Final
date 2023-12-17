const express = require('express');
const { syncStudentsWithBlockchain } = require('./server/syncService');

const app = express();
const port = 3000; // You can change the port number if needed

// Start the synchronization service
syncStudentsWithBlockchain();

app.get('/', (req, res) => {
  res.send('University Data Sync Service is Running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});