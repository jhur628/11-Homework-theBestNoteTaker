// Require modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid')

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

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            text,
            title,
            id: uuid()
        };

        const noteString = JSON.stringify(newNote);
        fs.writeFile(`db/db.json`, noteString, 
        (err, data) => err ? console.log(err) : console.log(`note for ${newNote.title} has been written to json file`));

        const response = {
            status: "success",
            body: newNote
        };

        res.status(201).json(response)
    } else {res.status(500).json(`Error in posting note!`)}
});

// logs a link to the app
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
