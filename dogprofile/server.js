/* Requirement and instances */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

/* Enable json parsing */
app.use(express.urlencoded({extended: false, limit: "100mb"}));
app.use(express.json({limit: "100mb"}));

/* Static path */
app.use("/", express.static(__dirname));

/* Any number from the IANA ephemeral port range (49152-65535) */
const port = 15038;

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

/* Read JSON file */
function readJSON(path){
    return new Promise((res, rej) => {
        fs.readFile(path, (err, str) => {
            if(err){
                console.log("File read failed:", err);
                rej();
            }
            res(str);
        });
    })
}

let cmt_file = "./data/comments.json";
let img_file = "./data/images.json";

/* Load comments when entering site */
app.post("/load_comments", async (req, resp) => {
    resp.send(await readJSON(cmt_file));
});

/* Load images when entering site */
app.post("/load_images", async (req, resp) => {
    resp.send(await readJSON(img_file));
});

/* Show the new comment and store it in JSON */
app.post("/post_comment", async (req, resp) => {
    const obj = JSON.parse(await readJSON(cmt_file));
    obj[req.body.id] = req.body.content;

    /* Write back to JSON */
    fs.writeFile(cmt_file, JSON.stringify(obj, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
    });
});

/* Show the new image and store it in JSON */
app.post("/upload_image", async (req, resp) => {
    const obj = JSON.parse(await readJSON(img_file));
    obj[req.body.id] = req.body.image;

    /* Write back to JSON */
    fs.writeFile(img_file, JSON.stringify(obj, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
    });
});