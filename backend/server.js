import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Added this line
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));

// Cookie parser middleware for CSRF tokens in cookies
app.use(cookieParser());
// Set up CSRF protection
const csrfProtection = csurf({ cookie: true });

const connection = new sqlite3.Database('./db/aplikasi.db')

// Parameterized query to get user info
app.get('/api/user/:id', csrfProtection, (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ?`;

  connection.all(query, [userId], (error, results) => {
    if (error) {
      res.status(500).send('Database error');
      return;
    }
    // Include CSRF token in the response
    res.json({ users: results, csrfToken: req.csrfToken() });
  });
});

// Parameterized query to change email
app.post('/api/user/:id/change-email', csrfProtection, (req, res) => {
  const newEmail = req.body.email;
  const userId = req.params.id;

  const query = `UPDATE users SET email = ? WHERE id = ?`;

  connection.run(query, [newEmail, userId], function (err) {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    if (this.changes === 0) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send('Email updated successfully');
    }
  });
});

app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url); 
  const __dirname = path.dirname(__filename); 

  const filePath = path.join(__dirname, 'files', req.query.name);
  res.sendFile(filePath);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
