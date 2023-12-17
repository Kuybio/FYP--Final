const database = require('../server/database'); // Update the path as necessary
const blockchain = require('../server/blockchain'); // Update the path as necessary

// Ethereum account details
const fromAddress = 0xB4cE6bac673F150ba36D53E3dfd94dCf59a3129c; // Replace with your Ethereum account address
const privateKey = 0x6449d67debeb3b9471474b20b74b5e04ebbcf4c97ff48c8dde24b1257f07ad6b; // Replace with your private key

// Function to fetch new students who are not yet synced with the blockchain
const fetchNewStudents = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Students WHERE syncedWithBlockchain = FALSE';
        database.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching new students:', error);
                reject(error);
            } else {
                resolve(Array.isArray(results) ? results : []);
            }
        });
    });
};

// Function to fetch students who need to be updated on the blockchain
const fetchStudentChanges = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM ChangeLog WHERE synced = FALSE';
        database.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching student changes:', error);
                reject(error);
            } else {
                resolve(Array.isArray(results) ? results : []);
            }
        });
    });
};

// Function to sync new students with the blockchain
const syncNewStudentsWithBlockchain = async () => {
    const newStudents = await fetchNewStudents();
    for (const student of newStudents) {
        try {
            await blockchain.addStudent(student.studentId, student.name, student.programme, student.joinYear, student.cgpa || 0, student.graduateYear || 0);
            // Mark these students as synced in the database...
        } catch (error) {
            console.error(`Failed to sync new student ${student.studentId}:`, error);
        }
    }
};

// Function to sync updated students with the blockchain
const syncUpdatedStudentsWithBlockchain = async () => {
    try {
        const studentChanges = await fetchStudentChanges();
        for (const change of studentChanges) {
            try {
                // Assuming that the student data in the main table is already updated
                // Fetch the updated student data from the main Students table
                const student = await getStudentData(change.studentId);
                const result = await blockchain.updateStudent(
                    fromAddress,
                    privateKey,
                    student.studentId,
                    student.name,
                    student.programme,
                    student.joinYear,
                    student.cgpa || 0,
                    student.graduateYear || 0
                );
                console.log(`Updated student ${change.studentId} synced successfully with tx: ${result.transactionHash}`);
                // Update the ChangeLog table to mark the change as synced
                await markChangeAsSynced(change.id);
            } catch (error) {
                console.error(`Failed to sync change for student ${change.studentId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in syncing updated students:', error);
    }
};

// Function to mark a change as synced in the ChangeLog
const markChangeAsSynced = (changeId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE ChangeLog SET synced = TRUE WHERE id = ?';
        database.query(query, [changeId], (error, results) => {
            if (error) {
                console.error('Error marking change as synced:', error);
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

// Schedule the sync jobs
setInterval(syncNewStudentsWithBlockchain, 30000); // Sync new students every 30 seconds
setInterval(syncUpdatedStudentsWithBlockchain, 30000); // Sync updated students every 30 seconds

module.exports = { syncNewStudentsWithBlockchain, syncUpdatedStudentsWithBlockchain };
