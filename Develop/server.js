const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming request bodies
app.use(express.json());

// Route to serve notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});



// RETURN all saved notes in DB to notes html 
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname,'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read the notes database' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Route to serve index.html for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
