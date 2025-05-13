import express from 'express';
import { JSONFile } from 'lowdb/node';
import { Low } from 'lowdb';

const adapter = new JSONFile('db.json');
const db = new Low(adapter, []);

const app = express();
app.use(express.json());

// Routes

// Home
app.get('/', (_, res) => res.status(200).send("Hello"));

// Get
app.get('/get', async (_, res) => {
    try {
        await db.read();
        res.status(200).json({ foods: db.data });
    }
    catch(err) {
        res.status(500).json({ foods: [] });
    }
});

// Post
app.post('/post', async (req, res) => {
    try {
        await db.read();
        const { food } = req.body;
        if (food) {
            db.data.push(food);
            await db.write();
            res.status(200).json({ status: 'success' });
        }
        else {
            res.status(400).json({ status: 'fail' });
        }
    }
    catch(err) {
        res.status(500).json({ status: 'fail' });
    }
});

// Listen
const port = process.env.PORT || 8080;
app.listen(port);