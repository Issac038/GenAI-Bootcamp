require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const PORT = 3000
const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connection successful"))
    .catch(() => console.log("MongoDB connection failed"))

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})