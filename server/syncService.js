const database = require('../server/database');
const blockchain = require('../server/blockchain');

const fetchNewStudents = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Students WHERE syncedWithBlockchain = FALSE OR updateSynced = FALSE';
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
    try {
        const newStudents = await fetchNewStudents();
        for (const student of newStudents) {
            // Existing logic to sync each student...
        }
    } catch (error) {
        console.error('Error in syncing new students:', error);
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
