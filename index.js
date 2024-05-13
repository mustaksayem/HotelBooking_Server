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
        const bookRoomCollection = client.db('HotelManagement').collection('Booking')
        const reviewCollection = client.db('HotelManagement').collection('Review')

        app.get('/rooms', async (req, res) => {
            const result = await roomCollection.find().sort({price_per_night:1}).toArray()    
            res.send(result)
          })
        //   review 
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().sort({reviewDate:-1}).toArray()    
            res.send(result)
          })




          app.get('/roomdetails/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await roomCollection.findOne(query)
            res.send(result);
        })

        // dfghjk

        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await roomCollection.findOne(query)
            res.send(result);
        })


// booking single id get
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await bookRoomCollection.findOne(query)
            res.send(result);
        })







        // save booking rooms in database
          app.post('/booking',async (req,res) =>{
            const bookingData = req.body
            const result = await bookRoomCollection.insertOne(bookingData)
            res.send(result)
          })

        //   save review in database
        app.post('/review',async (req,res) =>{
            const reviewData = req.body
       
            const result = await reviewCollection.insertOne(reviewData)
            res.send(result)
            
          })
          
           //update avalability
           app.put("/rooms/:id", async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            const data = {
                $set: {
                    availability: req.body.availability,
                 
                }
            }
            console.log(data);
            const result = await roomCollection.updateOne(query, data)
            res.send(result)
        })


        // update date

        app.put("/update/:id", async (req, res) => {
            // Add console log here
            console.log("Received PUT request for id:", req.params.id);
          
            const query = { _id: new ObjectId(req.params.id) };
            const data = {
              $set: {
                bookingDate: req.body.bookingDate,
              },
            };
            console.log(data);
            const result = await bookRoomCollection.updateOne(query, data);
            res.send(result);
          });
          



          app.get('/mybookings/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await bookRoomCollection.find(query).toArray()
            res.send(result);
        })

        app.delete('/mybooking/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookRoomCollection.deleteOne(query)
            res.send(result)
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