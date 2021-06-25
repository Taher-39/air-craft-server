const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const port = process.env.PORT || 4000
require("dotenv").config()

app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const { connect } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvvgh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const airRoutesCollection = client.db("AirCraft").collection("Routes");
    //service upload
    app.post('/addARoutes', (req, res) => {
        const file = req.files.file;
        const serviceFrom = req.body.serviceFrom;
        const serviceTo = req.body.serviceTo;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        airRoutesCollection.insertOne({ serviceFrom, serviceTo, image: image })
            .then(result => {
                res.send(result.insertedCount > 0);
                if (result.insertedCount > 0){
                    console.log('true')
                }
            })
    })
});



app.listen(port)