const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.beeqz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        await client.connect();
        const studentCollection = client.db('student-data').collection('student');

        app.post('/student', async(req, res) => {
            const student = req.body;
            const result = await studentCollection.insertOne(student);
            res.send(result);
        });
        app.get('/student', async(req, res) => {
            const query = {};
            const result = await studentCollection.find(query).toArray();
            res.send(result);
        });
        app.delete('/student/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await studentCollection.deleteOne(filter);
            res.send(result);
        });
        app.get('/profile/:id', async(req, res) => {
           const id = req.params.id;
           const filter = {_id: ObjectId(id)};
           const result = await studentCollection.findOne(filter);
           res.send(result);
        });
        app.patch('/profile/:id', async(req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set: user,
            };
            const result = await studentCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

    }
    finally{

    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hollo from student server');
});

app.listen(port, () => {
    console.log('Listening to port', port)
})