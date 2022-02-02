const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require("mysql");
require("dotenv");

const PORT= process.env.PORT || 8000;

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '123456789',
    database: 'databasename',
});
// const db = mysql.createConnection({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(express.static('uploads'));


//--------------------------------UPLOAD VIDEO
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
var upload = multer({ storage: storage }).array("file")

app.get("/", (req, res) => {
    res.status(400).json({ message: "Hello!" })
})

app.post("/upload", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.status(500).json({ success: false, err })
        }
        //insert to db
        req.files.map((file) => {
            db.query(
                "INSERT INTO videos (filename, filepath) VALUES (?,?)",
                [file.filename, file.path],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('inserted!');
                    }
                }
            );
        });
        
        return res.status(200).send(req.files)
    })
});

//--------------------------------STORE TO DB
app.post("/insert", (req, res) => {
    const filename = req.body.filename;
    const filepath = req.body.filepath;

    db.query(
        "INSERT INTO videos (filename, filepath) VALUES (?,?)",
        [filename, filepath],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Video Inserted");
            }
        }
    );
});

app.get("/videos", (req, res) => {
    db.query("SELECT * FROM videos", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.put("/update", (req, res) => {
    const id = req.body.id;
    const filename = req.body.filename;
    db.query(
        "UPDATE videos SET filename = ? WHERE id = ?",
        [filename, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

//TODO: also need to remove video from server!
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM videos WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is connected! \nhttp://localhost:${PORT}`)
});