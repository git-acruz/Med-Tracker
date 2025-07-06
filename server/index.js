require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import mongoose

// Mongoose will create it for you if it doesn't exist.
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err);
});

const app = express();

app.use(cors({
    origin: [
        'https://med-tracker-front.vercel.app',
        'http://localhost:3000' // just in case
    ]
}));

app.use(express.json());


// Create schema mongodb
const bcrypt = require('bcrypt'); // import bcrypt

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// This is a pre-save "hook" that automatically hashes the password before saving a new user
// This is a massive security improvement over storing plain text passwords.
UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', UserSchema);

const MedicationSchema = new mongoose.Schema({
    // link to the user model using its ObjectID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    schedule: { type: String, required: true },
    taken: { type: Boolean, default: false },
    takenDate: { type: String },
    takenTime: { type: String }
});

const Medication = mongoose.model('Medication', MedicationSchema);


// sign up route mongodb
app.post('/signup', async (req, res) => {

    try {
        const { username, password } = req.body;

        const newUser = new User({ username, password });
        
        const savedUser = await newUser.save();

        res.json({ message: 'Sign up successful', userId: savedUser._id }); // In MongoDB, the primary key is automatically named _id
    } catch (err) {
        res.status(400).json({ error: 'Username already exists or server error.' })
    }
});


// login route mongodb
app.post('/login', async (req, res) => {
    
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
});


// save medication route (POST) mongodb
app.post('/medications/all', async (req, res) => {
    console.log('/medications body @ save:', req.body)

    try {
        const { medicinesWithUserId } = req.body;

        // Extract the userId. MongoDB IDs need to be handled as ObjectId types.
        const userId = medicinesWithUserId.length > 0 ? medicinesWithUserId[0].userId : null;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing' });
        }
        
        await Medication.deleteMany({ userId: userId });

        const verifiedMeds = medicinesWithUserId.map(med => ({
            ...med,
            taken: Boolean(med.taken) // convert 0/1 to T/F to ensure taken is boolean
        }));

        await Medication.insertMany(verifiedMeds);

        res.json({ message: 'Medication(s) saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save medications' });
    }
});


// load medication list (GET) mongodb
app.get('/medications', async (req, res) => {

    try {
        const { userId } = req.query;

        const loadmeds = await Medication.find({ userId: userId }); 
        res.json(loadmeds);
    } catch (err) {
        res.status(500).json({ error: 'Load failed' });
    }
});


// delete medication list (DELETE) mongodb
app.delete('/medications/all', async (req, res) => {
    
    try {
        const { userId } = req.query;

        const result = await Medication.deleteMany({ userId: userId });
        res.json({ message: 'All medications deleted', changes: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

// declare PORT and listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});