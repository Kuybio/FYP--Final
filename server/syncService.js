const { addStudent, updateStudent, getStudent } = require('../server/blockchain');
const { getUpdatedStudents, getNewStudents, markStudentSynced } = require('../server/database');

// Interval for syncing with the blockchain
const SYNC_INTERVAL = 10000; // 10 seconds, adjust as needed

async function syncWithBlockchain() {
  try {
    // Sync new students
    const newStudents = await getNewStudents();
    for (const student of newStudents) {
      await addStudentToBlockchain(student);
      await markStudentSynced(student.studentId, 'new');
    }

    // Sync updated students
    const updatedStudents = await getUpdatedStudents();
    for (const student of updatedStudents) {
      await updateStudentOnBlockchain(student);
      await markStudentSynced(student.studentId, 'update');
    }
  } catch (error) {
    console.error('Failed to sync with blockchain:', error);
  }

  setTimeout(syncWithBlockchain, SYNC_INTERVAL);
}

async function addStudentToBlockchain(student) {
  try {
    await addStudent(student.studentId, student.name, student.programme, student.joinYear, student.cgpa, student.graduateYear);
    console.log(`Successfully added student ${student.studentId} to the blockchain.`);
  } catch (error) {
    console.error(`Failed to add student ${student.studentId} to the blockchain:`, error);
  }
}

async function updateStudentOnBlockchain(student) {
  try {
    await updateStudent(student.studentId, student.name, student.programme, student.joinYear, student.cgpa, student.graduateYear);
    console.log(`Successfully updated student ${student.studentId} on the blockchain.`);
  } catch (error) {
    console.error(`Failed to update student ${student.studentId} on the blockchain:`, error);
  }
}

// Start the sync process
syncWithBlockchain();
