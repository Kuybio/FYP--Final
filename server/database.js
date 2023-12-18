const mysql = require('mysql');

const dbConfig = {
  host     : 'localhost', // or your database host
  user     : 'root',
  password : '1Metagross?',
  database : 'UNI'
};

// Create a MySQL connection
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

// Fetch new students who haven't been synced with the blockchain yet
function getNewStudents() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Students WHERE isNew = 1';
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

// Fetch updated students who haven't been synced with the blockchain yet
function getUpdatedStudents() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Students WHERE isUpdated = 1';
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

// Mark a student as synced in the database
function markStudentSynced(studentId, type) {
  return new Promise((resolve, reject) => {
    let query;
    if (type === 'new') {
      query = 'UPDATE Students SET isNew = 0 WHERE studentId = ?';
    } else if (type === 'update') {
      query = 'UPDATE Students SET isUpdated = 0 WHERE studentId = ?';
    }

    connection.query(query, [studentId], (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

module.exports = {
  getNewStudents,
  getUpdatedStudents,
  markStudentSynced,
  connection
};
