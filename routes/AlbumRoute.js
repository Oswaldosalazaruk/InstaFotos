const express = require("express");
const router = express.Router();
const Albums = require("../models/albumModel");
const fs = require('fs');


//ruta para dar servicio de datos en formato json segun el directorio requerido en la variable {format}
router.route("/api/albums/:format").get((req, res) => {

    var format = req.params.format;
    Albums.find({ tag: format })
        .then(foundalbums => res.json(foundalbums))
        .catch((error) => {
            res.status(400).json({ message: error.message });
        });

});

//ruta para subir foto al directorio upload y actualizar base de datos mongodb
router.route("/upload").post((req, res) => {
    // console.log(req.files.files.name);
    const file = req.files.files;
    console.log(file.name, file.path);
    fs.copyFile(file.path, `instafotos/public/pictures/uploads/${file.name}`, (err) => {
        if (err) {
            res.status(400).json({ message: error.message });
            console.log("Error Found:", err);
        } else {
            console.log("Archivo copiado al directorio /uploads")
            res.json({ "msg": "file movido al directorio /upload" });
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("Error Found:", err);
                } else {
                    console.log("Archivo borrado de /tmp")
                }
            });
        }
    });
    Albums.countDocuments({ tag: "uploads" }, function(error, numOfDocs) {
        console.log('I have ' + numOfDocs + ' documents in my /uploads' + file.name);
        const tag = 'uploads';
        const post = '#uploads';
        const url = file.name;
        const id = numOfDocs + 1;
        console.log("registro No :" + id);
        const newalbum = new Albums({
            id,
            tag,
            post,
            url
        });
        newalbum.save();
    });

});


//ruta para actualizar el campo post en la base de datos mongodb
router.route("/update").post((req, res) => {
    const ObjectId = require('mongodb').ObjectID;
    console.log(req.fields.albumid, req.fields.albumpost);
    //const id = `ObjectId("${req.fields.albumid}")`;
    const id = req.fields.albumid;
    const post = req.fields.albumpost;

    Albums.updateOne({ _id: ObjectId(id) }, { "post": post }, function(err, docs) {
        if (err) {
            console.log(err)
        } else {
            console.log("Updated Docs : ", docs);
        }
    });


    return res.json({ "msg": "actualizado", "id": id })
});

module.exports = router;