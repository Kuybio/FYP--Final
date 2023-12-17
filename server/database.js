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

module.exports = connection;
