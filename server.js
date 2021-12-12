// Require modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid')
let db = require('./db/db.json')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Have "/" be index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Have "/notes" be notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET db.json to append notes from database
app.get('/api/notes', (req, res) => {
    res.json(db);
})

// POST will send response of added note and write over db.json
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body
    const newNote = {
        title,
        text,
        id: uuid()
    }
    db.push(newNote)
    res.json(db)
});

// DELETE will delete respective note by id and write unto db.json
app.delete(`/api/notes/:id`, (req, res) => {
    if (db.length === 0 || db.length === 1) {
        db = []
        res.json(db)
    } else {
        let newDB = db.filter((item) => item.id !== req.params.id)
        db = newDB
        res.json(db)
    }
})

// logs a link to the app
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
