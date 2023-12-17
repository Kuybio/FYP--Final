const database = require('../server/database'); // Update the path as necessary
const blockchain = require('../server/blockchain'); // Update the path as necessary

// Function to fetch new students from the database
async function fetchNewStudents() {
    try {
        const query = 'SELECT * FROM Students WHERE syncedWithBlockchain = FALSE';
        const results = await database.query(query);
        return results;
    } catch (error) {
        console.error('Error fetching new students:', error);
        return []; // Always return an array, even if empty
    }
}

// Function to fetch updated students from the database
async function fetchUpdatedStudents() {
    try {
        const query = 'SELECT * FROM ChangeLog WHERE syncedWithBlockchain = FALSE';
        const results = await database.query(query);
        return results;
    } catch (error) {
        console.error('Error fetching updated students:', error);
        return []; // Always return an array, even if empty
    }
}

// Sync new students with the blockchain
async function syncNewStudentsWithBlockchain() {
    const newStudents = await fetchNewStudents();
    for (const student of newStudents) {
        try {
            // Assuming the 'addStudent' function in 'blockchain.js' accepts student details and returns a promise
            const txResult = await blockchain.addStudent(student.studentId, student.name, student.programme, student.joinYear, student.cgpa, student.graduateYear);
            console.log(`Student ${student.studentId} added to blockchain: ${txResult.transactionHash}`);

            // Update database to reflect that the student is synced
            // Example: await database.query('UPDATE Students SET syncedWithBlockchain = TRUE WHERE studentId = ?', [student.studentId]);
        } catch (error) {
            console.error(`Failed to sync new student ${student.studentId}:`, error);
        }
    }
}

// Sync updated students with the blockchain
async function syncUpdatedStudentsWithBlockchain() {
    const updatedStudents = await fetchUpdatedStudents();
    for (const change of updatedStudents) {
        try {
            // Fetch the complete, latest student data
            const studentData = await database.query('SELECT * FROM Students WHERE studentId = ?', [change.studentId]);
            const student = studentData[0];

            // Assuming the 'updateStudent' function in 'blockchain.js' accepts updated student details and returns a promise
            const txResult = await blockchain.updateStudent(student.studentId, student.name, student.programme, student.joinYear, student.cgpa, student.graduateYear);
            console.log(`Student ${student.studentId} updated on blockchain: ${txResult.transactionHash}`);

            // Update database to reflect that the student change is synced
            // Example: await database.query('UPDATE ChangeLog SET syncedWithBlockchain = TRUE WHERE id = ?', [change.id]);
        } catch (error) {
            console.error(`Failed to sync change for student ${change.studentId}:`, error);
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
