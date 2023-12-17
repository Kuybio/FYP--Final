const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost', // or your database host
  user     : 'root',
  password : '1Metagross?',
  database : 'UNI'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

// Function to execute a query with placeholders and return a promise
function execute(query, values) {
  return new Promise((resolve, reject) => {
      connection.query(query, values, (error, results, fields) => {
          if (error) {
              reject(error);
              return;
          }
          resolve(results);
      });
  });
}

// Export the execute function
module.exports = {
  execute,
  connection
};