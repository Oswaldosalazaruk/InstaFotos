const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const formidable = require('express-formidable');

app.use(formidable());
app.use(cors());
app.use(express.json());

//require route
app.use("/", require("./routes/AlbumRoute"));
//connect to mongoose   
const CONNECTION_URL = "mongodb://localhost:27017/instafotos";

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3001, function() {
        console.log("express server is running on port 3001")
    }))
    .catch((error) => console.log(`${error} did not connect`))