const database = require('../server/database.js'); // Ensure this path is correct
const { addOrUpdateStudent } = require('../server/blockchain.js'); // Import the function from blockchain.js

// Function to get unsynced or updated students from the database
const fetchUnsyncedOrUpdatedStudents = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Students WHERE syncedWithBlockchain = FALSE OR updateSynced = FALSE';
    database.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to synchronize students with the blockchain
const syncStudentsWithBlockchain = async () => {
  try {
    const students = await fetchUnsyncedOrUpdatedStudents();

    for (const student of students) {
      // Add or update student on the blockchain
      // Replace the following with actual account address and private key
      const fromAddress = '0xB4cE6bac673F150ba36D53E3dfd94dCf59a3129c'; 
      const privateKey = '0x6449d67debeb3b9471474b20b74b5e04ebbcf4c97ff48c8dde24b1257f07ad6b'; 

      await addOrUpdateStudent(
        student.studentId,
        student.name,
        student.programme,
        student.joinYear,
        student.cgpa, // Ensure this handles NULL values appropriately
        student.graduateYear,
        fromAddress,
        privateKey
      );

      // Update the student record as synced in the database
      const updateQuery = 'UPDATE Students SET syncedWithBlockchain = TRUE, updateSynced = TRUE WHERE studentId = ?';
      await new Promise((resolve, reject) => {
        database.query(updateQuery, [student.studentId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      console.log(`Student ${student.studentId} synced with the blockchain.`);
    }
  } catch (error) {
    console.error('Failed to sync students with the blockchain:', error);
  }
};

// Run the sync process at regular intervals
setInterval(syncStudentsWithBlockchain, 30000); // Adjust the interval as needed

module.exports = {
  syncStudentsWithBlockchain,
  fetchUnsyncedOrUpdatedStudents
};
