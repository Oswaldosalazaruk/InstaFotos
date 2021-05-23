const mongoose = require("mongoose");

const albumschema = {
    id: Number,
    tag: String,
    post: String,
    url: String

}

const Albums = mongoose.model("albums", albumschema);

module.exports = Albums;