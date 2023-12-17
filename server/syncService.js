const database = require('../server/database'); // Update the path as necessary
const blockchain = require('../server/blockchain'); // Update the path as necessary

// Ethereum account details
const fromAddress = 0xB4cE6bac673F150ba36D53E3dfd94dCf59a3129c; // Replace with your Ethereum account address
const privateKey = 0x6449d67debeb3b9471474b20b74b5e04ebbcf4c97ff48c8dde24b1257f07ad6b; // Replace with your private key

// Function to fetch new students from the database
async function fetchNewStudents() {
    try {
        // Replace with your actual query to fetch new students
        const query = 'SELECT * FROM Students WHERE syncedWithBlockchain = FALSE';
        // The 'query' method is used to execute the query in mysql library
        connection.query(query, (error, results, fields) => {
            if (error) {
                throw error; // If there's an error, we throw it so it can be caught by the catch block
            }
            // If results are fetched successfully, we proceed with them
            // Ensure you handle the results correctly here
        });
    } catch (error) {
        console.error('Error fetching new students:', error);
        return []; // Always return an array, even if empty
    }
}

// Function to fetch updated student changes from the ChangeLog table
async function fetchUpdatedStudents() {
    const query = 'SELECT * FROM ChangeLog WHERE synced = FALSE';
    database.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching student changes:', error);
            reject(error);
        } else {
            resolve(Array.isArray(results) ? results : []);
        }
    });
};

// Helper function to get complete student data by ID
async function getStudentData(studentId) {
    const query = 'SELECT * FROM Students WHERE studentId = ?';
    // Add your database query logic here and return the result
}

// Function to sync new students with the blockchain
async function syncNewStudentsWithBlockchain() {
    const newStudents = await fetchNewStudents(); // This function should return an array of new students
    for (const student of newStudents) { // Make sure 'newStudents' is the array you want to iterate over
        try {
            // Make sure all data is defined
            const studentData = {
                studentId: student.studentId,
                name: student.name,
                programme: student.programme,
                joinYear: student.joinYear,
                cgpa: student.cgpa || 0, // Default to 0 if undefined
                graduateYear: student.graduateYear || 0 // Default to 0 if undefined
            };

            // Use your blockchain interaction module to add the student
            const tx = await blockchain.addStudent(studentData);
            console.log(`Student ${student.studentId} added to the blockchain with transaction: ${tx}`);
            // Update the database to mark the student as synced
        } catch (error) {
            console.error(`Failed to sync new student ${student.studentId}: ${error}`);
        }
    }
}

// Function to sync updated students with the blockchain
async function syncUpdatedStudentsWithBlockchain() {
    const updatedStudents = await fetchUpdatedStudents();
    for (const change of updatedStudents) {
        try {
            const student = await getStudentData(change.studentId);
            const tx = await blockchain.updateStudent({
                studentId: student.studentId,
                name: student.name,
                programme: student.programme,
                joinYear: student.joinYear,
                cgpa: student.cgpa || 0, // Default to 0 if undefined
                graduateYear: student.graduateYear || 0 // Default to 0 if undefined
            });
            console.log(`Student ${change.studentId} updated on the blockchain with transaction: ${tx}`);
            // Update the ChangeLog to mark the change as synced
        } catch (error) {
            console.error(`Failed to sync updated student ${change.studentId}: ${error}`);
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
