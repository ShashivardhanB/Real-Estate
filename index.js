const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const route = require('./src/routes/route')
const multer = require('multer')


// require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(multer().any())

// console.log(process.env.DB)

mongoose.connect("mongodb+srv://Shashi123:Shashi123@cluster0.ixqul.mongodb.net/RealEstateDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,useUnifiedTopology: true
})
.then(() =>console.log("MongoDB is connected"))
.catch(err => console.log(err) )

// SqfThey4gQxFH3i9a8mAuCk0sYzM2onV1NUK5jpBLPOwdEJvcWwux4cY32fVdDz9lkqPKIhtLN87ynM1
app.use('/',route)


app.listen(3000 ,  function(){

    console.log("Express app is running on" + " "+ 3000 +" "+"Port")
})



