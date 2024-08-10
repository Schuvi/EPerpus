const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const cors = require("cors")

require("dotenv").config()

app.use(cors())

const perpusRouter = require("./routes/perpusRouter")

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/perpus", perpusRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server berjalan pada ${PORT}`)
})