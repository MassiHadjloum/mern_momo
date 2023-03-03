import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import 'colors';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';
import dotenv from 'dotenv'


const app = express()
dotenv.config()

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/posts', postRoutes)
app.use('/user', userRoutes)

// const CONNEXION_URL = "mongodb+srv://massi:massi@cluster0.dbdjjuf.mongodb.net/?retryWrites=true&w=majority"
const PORT = process?.env?.PORT || 5001;


mongoose.set('strictQuery', false)
mongoose.connect(process?.env?.CONNEXION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(PORT, console.log(`Server running on port: ${PORT}`.green.underline.italic))
  })
  .catch((err) => console.log(err.message.red))

// mongoose.set('useFindAndModify', false)