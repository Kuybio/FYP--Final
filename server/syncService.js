const database = require('../server/database');
const blockchain = require('../server/blockchain');

const fetchNewStudents = () => {
    const fetchNewStudents = () => {
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
}

// Function to fetch unsynced changes from the ChangeLog table
const fetchUnsyncedChanges = () => {
    return new Promise((resolve, reject) => {
        // Query to select only unsynced changes
        const query = 'SELECT * FROM ChangeLog WHERE synced = FALSE';
        database.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// Function to sync new students with the blockchain
const syncNewStudentsWithBlockchain = async () => {
    const newStudents = await fetchNewStudents();
    for (const student of newStudents) {
        try {
            const result = await blockchain.addStudent(student.studentId, student.name, student.programme, student.joinYear, student.cgpa || 0, student.graduateYear || 0);
            console.log(`Student ${student.studentId} synced successfully with tx: ${result.transactionHash}`);
            // Update the database to mark the student as synced
        } catch (error) {
            console.error(`Failed to sync new student ${student.studentId}:`, error);
        }
    }
};

// Function to sync updates with the blockchain
const syncUpdatesWithBlockchain = async () => {
    const changes = await fetchUnsyncedChanges();
    for (const change of changes) {
        try {
            await blockchain.updateStudent(change.studentId, change.newName, change.newProgramme, change.newJoinYear, change.newCgpa || 0, change.newGraduateYear || 0);
            // Mark these changes as synced in the database...
        } catch (error) {
            console.error(`Failed to sync change for student ${change.studentId}:`, error);
        }
    }
};

// Run the sync processes at regular intervals
setInterval(syncNewStudentsWithBlockchain, 30000); // Adjust the interval as needed
setInterval(syncUpdatesWithBlockchain, 30000); // Adjust the interval as needed

module.exports = {
    syncNewStudentsWithBlockchain,
    syncUpdatesWithBlockchain,
    fetchNewStudents,
    fetchUnsyncedChanges
};
