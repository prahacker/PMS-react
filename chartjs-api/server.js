const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process'); // To run scripts

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Users database connection
const usersDb = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});

// Admin database connection
const adminDb = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});

// Connect to users database
usersDb.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL users database:', err.stack);
    return;
  }
  console.log('Connected to MySQL users database');
});

// Connect to admin database
adminDb.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL admin database:', err.stack);
    return;
  }
  console.log('Connected to MySQL admin database');
});

// Signup API
app.post('/signup', (req, res) => {
  const { name, email_id, username, password } = req.body;

  if (!name || !email_id || !username || !password) {
    return res.status(400).send('All fields are required');
  }

  usersDb.query('SELECT * FROM user WHERE username = ? OR email_id = ?', [username, email_id], (err, results) => {
    if (err) {
      console.error('Database error while checking existing user:', err);
      return res.status(500).send('Internal server error');
    }

    if (results.length > 0) {
      return res.status(400).send('Username or email already exists');
    }

    const sql = 'INSERT INTO user (name, email_id, username, password) VALUES (?, ?, ?, ?)';
    usersDb.query(sql, [name, email_id, username, password], (err, result) => {
      if (err) {
        console.error('Error inserting user into the database:', err);
        return res.status(500).send('Internal server error');
      }
      res.status(200).send('Signup successful');
    });
  });
});

// Login API
app.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).send('All fields are required');
  }

  usersDb.query('SELECT * FROM user WHERE username = ? OR email_id = ?', [usernameOrEmail, usernameOrEmail], (err, results) => {
    if (err) {
      console.error('Database error while fetching user:', err);
      return res.status(500).send('Internal server error');
    }

    if (results.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ id: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

// API to fetch data from the admin database
app.get('/api/data', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');

    const query = 'SELECT id, total_return_text, one_day_return_text, nifty50, sensex, date FROM records';
    adminDb.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data from admin database:', err);
        return res.status(500).send('Internal server error');
      }

      const data = results.map(item => {
        // Match and extract the currency value and percentage
        const oneDayReturnMatch = item.one_day_return_text.match(/([+-]₹[\d,]+)\(([\d.]+)%\)/);
        const sensexMatch = item.sensex.match(/([\d,.]+)\(([\d.]+)%\)/);
        const nifty50Match = item.nifty50.match(/([\d,.]+)\(([\d.]+)%\)/);

        return {
          label: item.date,
          value: oneDayReturnMatch ? parseFloat(oneDayReturnMatch[1].replace(/[^\d.-]/g, '')) : null, // Extract the numeric value
          oneDayReturnSymbol: oneDayReturnMatch ? oneDayReturnMatch[1].charAt(0) : '',
          oneDayReturnChange: oneDayReturnMatch ? parseFloat(oneDayReturnMatch[2]) : null, // Extract the percentage change
          sensexChange: sensexMatch ? parseFloat(sensexMatch[2]) : null, // Extract the percentage change for sensex
          nifty50Change: nifty50Match ? parseFloat(nifty50Match[2]) : null, // Extract the percentage change for nifty50
          sensex: sensexMatch ? parseFloat(sensexMatch[1].replace(/[^\d.-]/g, '')) : null, // Extract the numeric value for sensex
          nifty50: nifty50Match ? parseFloat(nifty50Match[1].replace(/[^\d.-]/g, '')) : null // Extract the numeric value for nifty50
        };
      });

      res.status(200).json(data);
    });

  } catch (ex) {
    res.status(400).send('Invalid token');
  }
});
// Profile API
app.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const username = decoded.id;

    usersDb.query('SELECT name, username, email_id as email, password FROM user WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Database error while fetching user profile:', err);
        return res.status(500).send('Internal server error');
      }

      if (results.length === 0) {
        return res.status(400).send('User not found');
      }

      res.status(200).json(results[0]);
    });

  } catch (ex) {
    res.status(400).send('Invalid token');
  }
});
// API to delete user account
app.delete('/delete-account', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const username = decoded.id;

    // Delete the user from the database
    usersDb.query('DELETE FROM user WHERE username = ?', [username], (err, result) => {
      if (err) {
        console.error('Error deleting user from the database:', err);
        return res.status(500).send('Internal server error');
      }

      res.status(200).send('Account deleted successfully');
    });
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
});


// Run script API
app.get('/run-script', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');

    exec('python /Users/prakhartripathi/chartjs-api/driver.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error}`);
        return res.status(500).send('Failed to execute script');
      }

      console.log(`Script output: ${stdout}`);
      res.status(200).send('Script executed successfully');
    });

  } catch (ex) {
    res.status(400).send('Invalid token');
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
