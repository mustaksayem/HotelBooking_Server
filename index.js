const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 9000
const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',

    ],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wdpofk5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const roomCollection = client.db('HotelManagement').collection('Rooms')

        app.get('/rooms', async (req, res) => {
            const result = await roomCollection.find().sort({price_per_night:1}).toArray()    
            res.send(result)
          })

          app.get('/roomdetails/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await roomCollection.findOne(query)
            res.send(result);
        })

    

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from  Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))