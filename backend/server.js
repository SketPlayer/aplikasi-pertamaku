import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Added this line
app.use(cors({
  origin: 'https://20.5.130.115', // Change the origin
  optionsSuccessStatus: 200,
}));

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter); // Apply rate limiter to all routes

const connection = new sqlite3.Database('./db/aplikasi.db')

// Load SSL certificates
const options = {
  key: fs.readFileSync('/etc/ssl/private/privkey.pem'),
  cert: fs.readFileSync('/etc/ssl/certs/fullchain.pem'),
};

// Parameterized query to get user info
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ?`;

  connection.all(query, [userId], (error, results) => {
    if (error) {
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
});

// Parameterized query to change email
app.post('/api/user/:id/change-email', (req, res) => {
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

https.createServer(options, app).listen(3000, () => {
  console.log('Server running on port 3000');
});
