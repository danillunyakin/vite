import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())


app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
        
    }
    console.log(`Сервер на порту ${PORT}`)
})