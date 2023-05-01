const express = require('express');
const fs = require('fs');
const path = require('path');

const { v4: uuidv4 } = require('uuid');


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

// POST /api/notes to save a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read the notes database' });
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to save the new note' });
        } else {
          res.json(newNote);
        }
      });
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
