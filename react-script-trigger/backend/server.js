const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = 5000;

// MySQL database connection details
const db = mysql.createConnection({
    host: 'your_db_host',
    user: 'admin',
    password: 'admin12345678',
    database: 'admin'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.get('/api/returns', (req, res) => {
    const query = "SELECT one_day_return_text, date FROM records ORDER BY date";
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Define the script path
const scriptPath = path.join(__dirname, 'driver.py');

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Route to run the script
app.post('/run-script', (req, res) => {
  console.log('Received request to run script');
  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ message: 'Failed to run script', error: error.message });
    }
    console.log(`stdout: ${stdout}`);
    res.json({ message: 'Script executed successfully', output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
