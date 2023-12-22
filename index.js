const express = require("express");
const port = process.env.PORT || 5000;
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


// middleware 
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    
    res.send("Abu Do It!!")
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS_SECRET}@cluster0.gbdj4eh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        const myTasksDB = client.db("myTasksDB");
        const tasksCollection = myTasksDB.collection("tasks");

        // api for add task 
        app.post("/tasks", async(req, res) => {
            const newTask = req.body
            const result = await tasksCollection.insertOne(newTask);
            res.send(result);
        });

        // api for get all tasks 
        app.get("/tasks", async(req, res) => {
            const {user} = req.query;
            const query = {user};
            console.log(user);
            const cursor = await tasksCollection.find(query).toArray();
            res.send(cursor);
        });






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`my-tasks server running on port: ${port}`);
})