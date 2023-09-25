import express from "express"
import "./dbConnect.js"
import config from "config"


const app = express() // Instantition

const port = config.get("PORT");

app.use(express.json()) // Body Parser

app.get("/", (req, res) => {
    res.status(200).json({success : "Hello there"})
})


app.listen(port, () => {
    console.log(`Server started at ${port}`)
})