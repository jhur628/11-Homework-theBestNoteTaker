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
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        let dbNotes = JSON.parse(data);
        let newNote = req.body;
        newNote.id = uuid();
        dbNotes.push(newNote);
        let dbStringified = JSON.stringify(dbNotes);
        console.log(dbNotes);
        fs.writeFile('db/db.json', dbStringified, (err) => {
            if (err) console.log(`ERROR!`);
            else {
                console.log(`SUCCESS! WROTE db.json!`);
                res.json(dbStringified);
            };
        })
    })
});

// DELETE will delete respective note by id and write unto db.json
app.delete(`/api/notes/:id`, (req, res) => {
    const id = req.params.id;
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        let oldNotes = JSON.parse(data);
        let newNotes = oldNotes.filter(keptObj => {
            return keptObj.id !== id;
        })
        newNotes = JSON.stringify(newNotes);
        console.log(newNotes);
        fs.writeFile('db/db.json', newNotes, (err) => {
            console.log(`SUCCESS! WROTE db.json without ${id}!`);
            res.json(newNotes);
        })
    })
})

// logs a link to the app
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
