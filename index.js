import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import 'colors';
import postRouts from './routes/posts.js';


const app = express()

app.use('/posts', postRouts)
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

const CONNEXION_URL = "mongodb+srv://massi:massi@cluster0.dbdjjuf.mongodb.net/?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5001;


mongoose.set('strictQuery', false)
mongoose.connect(CONNEXION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(PORT, console.log(`Server running on port: ${PORT}`.green.underline.italic))
  })
  .catch((err) => console.log(err.message.red))

// mongoose.set('useFindAndModify', false)