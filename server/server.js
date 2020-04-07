const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()


const app = express();

//routes modules
const authRoutes = require('./routes/auth')

//database
mongoose.connect(process.env.DATABASE, {useNewUrlParser:true,useUnifiedTopology:true})
.then(() => console.log('DB connected'))
.catch(err => console.log(err))

// middlewares
app.use(bodyParser.json())
app.use(cors({ orgin: process.env.CLIENT_URL }))
app.use(morgan('dev'))
app.use('/api',authRoutes)



const port = process.env.PORT 
app.listen(port, () => console.log(`Running on ${port}`))