const database = require('../server/database'); // Update the path as necessary
const blockchain = require('../server/blockchain'); // Update the path as necessary

// Ethereum account details
const fromAddress = '0xB4cE6bac673F150ba36D53E3dfd94dCf59a3129c'; // Replace with your Ethereum account address
const privateKey = '0x6449d67debeb3b9471474b20b74b5e04ebbcf4c97ff48c8dde24b1257f07ad6b'; // Replace with your private key

// Function to fetch new students from the database
async function fetchNewStudents() {
    try {
        const query = 'SELECT * FROM Students WHERE syncedWithBlockchain = FALSE';
        const results = await database.execute(query); // Update this line as per your database execution method
        return results; // This will be an array of rows from the database
    } catch (error) {
        console.error('Error fetching new students:', error);
        return []; // Always return an array, even if empty
    }
}


// Fetch new students from the database
async function fetchNewStudents() {
    try {
        const query = 'SELECT * FROM Students WHERE syncedWithBlockchain = FALSE';
        const newStudents = await database.execute(query);
        return newStudents;
    } catch (error) {
        console.error('Error fetching new students:', error);
        return [];
    }
}

// Fetch updated students from the database
async function fetchUpdatedStudents() {
    try {
        const query = 'SELECT * FROM ChangeLog WHERE synced = FALSE';
        const updatedStudents = await database.execute(query);
        return updatedStudents;
    } catch (error) {
        console.error('Error fetching updated students:', error);
        return [];
    }
}

// Sync new students with the blockchain
async function syncNewStudentsWithBlockchain() {
    const newStudents = await fetchNewStudents();
    if (newStudents.length > 0) {
        for (const student of newStudents) {
            try {
                await blockchain.addStudent(student.studentId, student.name, student.programme, student.joinYear, student.cgpa, student.graduateYear);
                // Update the 'syncedWithBlockchain' flag in your database
                const updateQuery = `UPDATE Students SET syncedWithBlockchain = TRUE WHERE studentId = ${student.studentId}`;
                await database.execute(updateQuery);
                console.log(`Synced new student ${student.studentId} with blockchain`);
            } catch (error) {
                console.error(`Failed to sync new student ${student.studentId}:`, error);
            }
        }
    }
}

// Sync updated students with the blockchain
async function syncUpdatedStudentsWithBlockchain() {
    const updatedStudents = await fetchUpdatedStudents();
    if (updatedStudents.length > 0) {
        for (const change of updatedStudents) {
            try {
                await blockchain.updateStudent(change.studentId, change.newValue); // Make sure to adjust parameters according to your blockchain function
                // Update the 'synced' flag in your ChangeLog table
                const updateQuery = `UPDATE ChangeLog SET synced = TRUE WHERE id = ${change.id}`;
                await database.execute(updateQuery);
                console.log(`Synced updated student ${change.studentId} with blockchain`);
            } catch (error) {
                console.error(`Failed to sync updated student ${change.studentId}:`, error);
            }
        }
    }
}

// Schedule the sync jobs
setInterval(syncNewStudentsWithBlockchain, 30000); // Sync new students every 30 seconds
setInterval(syncUpdatedStudentsWithBlockchain, 30000); // Sync updated students every 30 seconds

// Export the functions for use in server.js
module.exports = {
    syncNewStudentsWithBlockchain,
    syncUpdatedStudentsWithBlockchain
};