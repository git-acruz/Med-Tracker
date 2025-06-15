const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('.dbsqlite');

app.use(cors());
app.use(bodyParser.json());

//Create tables
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        name TEXT,
        schedule TEXT,
        taken INTEGER,
        takenTime TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
    )
`);

// sign up route
app.post('/signup', (req, res) => { // create the route for POST requests to /signup
    const { username, password } = req.body; // data from front end

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)'; //SQL query to insert new data to users(id)
    db.run(query, [username, password], function (err) { // executes the sql using sqlite
        if (err) {
            return res.status(400).json({ error: 'Username already exists' }); 
        }
        res.json({ message: 'Sign up successful', userId: this.lastID }); // error message if error, success messafe if not error
    });
});

// login route POST
app.post('/login', (req, res) => { // route for POST requests to /login
    const { username, password } = req.body; // data from frontend

    const query = 'SELECT id FROM users WHERE username = ? AND password = ?'; //SQL query to select matching data
    db.get(query, [username, password], (err, row) => { // use the username and password and pass the input values to query ? also use db.get to get 1 row only
        if (err || !row) {
            return res.status(401).json({ error: 'Invalid credentials' });
        } 
        res.json({ message: 'Login successful', userId: row.id }); // error if the user/password not matched, success message if matched
    });
});

// for saving medication list
app.post('/medications', (req, res) => {
    const { userId, name, schedule, taken, takenTime } = req.body;

    const query = `
        INSERT INTO medications (userId, name, schedule, taken, takenTime)
        VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [userId, name, schedule, taken ? 1 : 0, takenTime], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to save medications' });
        }
        res.json({ message: 'Medication list saved', id: this.lastID });
    });
    /* userId, name, schedule, taken, takenTime - from front end
        INSERT INTO medications - to save data into medications table
        db.run para mag execute ng INSERT query
        read taken as true or false, hence 1 or 0
     */
});

// load medication list (GET)
app.get('/medications', (req, res) => {
    const { userId } = req.query;

    const query = 'SELECT * FROM medications WHERE userId = ?';
    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch medications' });
        }
        res.json(rows); // error if failed to load, load rows
    });
    /* app.get() - para kuhanin ang lahat ng data ng isang user,
        { userId } = req.query to determine who the user is.
        SELECT * FROM medications WHERE userId = ? = to look into the medications table with the specific userId
        db.all() ginagamit para kuhanin ang lahat ng rows na match sa query.
        res.json(rows) - to respond an object of arrays containing the all the rows on medications table (userId, name, schedule, taken, takenTime)
    */
});

// delete medication list (DELETE)
app.delete('/medications/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM medications WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete medication' });
    }
    res.json({ message: 'Medication deleted' });
  });
  /* app.delete() - defines delete route
    :id | { id } = req.params - get the specific id from medications table
    db.run('DELETE FROM medications WHERE id = ?', [id], - executes sql query to delete data with the specific id
    ? is placeholder, [id] is the value for the ? */
});


// declare PORT and listen
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});