// Require modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid')
const db = require('./db/db.json')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Have "/" be index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(db);
})

// app.post('/api/notes', (req, res) => {
//     fs.readFile('db/db.json', (data) =>{
      
//     })
// });

// logs a link to the app
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
