const database = require('../server/database'); // Adjust path as necessary
const { addOrUpdateStudent } = require('../server/blockchain');

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

// Function to sync new students with the blockchain
const syncNewStudentsWithBlockchain = async () => {
    const newStudents = await fetchNewStudents();
    for (const student of newStudents) {
        try {
            await addOrUpdateStudent(student.studentId, student.name, student.programme, student.joinYear, student.cgpa, student.graduateYear);
            // TODO: Mark these students as synced in a separate column or table
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
            await addOrUpdateStudent(change.studentId, change.newName, change.newProgramme, change.newJoinYear, change.newCgpa, change.newGraduateYear);
            const updateQuery = 'UPDATE ChangeLog SET synced = TRUE WHERE id = ?';
            await new Promise((resolve, reject) => {
                database.query(updateQuery, [change.id], (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
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
