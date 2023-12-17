const database = require('../server/database'); // Adjust path as necessary
const blockchain = require('../server/blockchain');

// Function to fetch new students who are not yet in the blockchain
const fetchNewStudents = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Students WHERE NOT EXISTS (SELECT studentId FROM ChangeLog WHERE Students.studentId = ChangeLog.studentId)';
        database.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// Function to fetch unsynced changes from the ChangeLog table
const fetchUnsyncedChanges = () => {
    return new Promise((resolve, reject) => {
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

const syncNewStudentsWithBlockchain = async () => {
    const newStudents = await fetchNewStudents();
    for (const student of newStudents) {
        // Replace null values with 0
        const cgpaValue = student.cgpa != null ? student.cgpa : 0;
        const graduateYearValue = student.graduateYear != null ? student.graduateYear : 0;

        try {
            await blockchain.addStudent(student.studentId, student.name, student.programme, student.joinYear, cgpaValue, graduateYearValue);
            // Mark as synced...
        } catch (error) {
            console.error(`Failed to sync new student ${student.studentId}:`, error);
        }
    }
};

const syncUpdatesWithBlockchain = async () => {
    const changes = await fetchUnsyncedChanges();
    for (const change of changes) {
        try {
            await blockchain.updateStudent(change.studentId, change.newName, change.newProgramme, change.newJoinYear, change.newCgpa, change.newGraduateYear);
            // Update ChangeLog...
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
