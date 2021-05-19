/* Requirement and instances */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require('https')
const config = require('./config.js');
const { json } = require("express");

/* Enable json parsing */
app.use(express.urlencoded({extended: false, limit: "1024mb"}));
app.use(express.json({limit: "1024mb"}));

/* Static path */
app.use("/", express.static(__dirname));

/* Any number from the IANA ephemeral port range (49152-65535) */
const port = 15038;

const sslOptions = {
  key: fs.readFileSync(config.key_path),
  ca: fs.readFileSync(config.ca_path),
  cert: fs.readFileSync(config.cert_path)
}

const server = https.createServer(sslOptions, app)
server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

/* Read JSON file */

/* 
 * __readJSON() sometimes returns incomplete json data
 * without giving any error message.
 * This function trys parsing the data until success.
 * 
 * Notice that this function will enter endless loop if
 * the json file to read is already invalid.
 */
async function readJSON(path) {
    while (true) {
        try {
            const obj = await __readJSON(path);
            JSON.parse(obj);
            return obj;
        } catch (err) {
            if (err == -1) {
                return "";
            }
            console.log(`Failed to read ${path} -> ${err}`);
        }
    }
}

function __readJSON(path) {
    return new Promise((res, rej) => {
        fs.readFile(path, (err, str) => {
            if(err){
                console.log("File read failed:", err);
                rej(-1);
            }
            res(str);
        });
    })
}

function writeJSON(path, data) {
    fs.writeFile(path, JSON.stringify(data, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
    });
}

let cmt_file  = "./data/comments.json";
let img_file  = "./data/images.json";
let user_file = "./data/users.json";

/**********************************************************/
/* Users */

/* Send user data json files to other scripts */
app.post("/load_users", async (req, resp) => {
    resp.send(await readJSON(user_file));
});

/* Update user data */
app.post("/update_users", async (req, resp) => {
    const jsonObj = JSON.parse(await readJSON(user_file));

    let score = 0;
    if (req.body.score != "") {
        score = parseInt(req.body.score, 10);
    }
    else if (jsonObj[req.body.id] != undefined) {
        score = jsonObj[req.body.id].score;
    }

    if (jsonObj.hasOwnProperty(req.body.id)) { // existed user
        jsonObj[req.body.id].name = req.body.name;
        jsonObj[req.body.id].profile = req.body.profile;
        jsonObj[req.body.id].score = score;
    }
    else { // new user
        jsonObj[req.body.id] = {
            "name":     req.body.name,
            "profile":  req.body.profile,
            "score":    score,
            "comments": {},
            "photos":   {}
        };
    }
    
    writeJSON(user_file, jsonObj);
    resp.send(await readJSON(user_file));
});

/**********************************************************/
/* Comments */

/* Load comments when entering site */
app.post("/load_comments", async (req, resp) => {
    resp.send(await readJSON(cmt_file));
});

/* Show the new comment and store it in JSON */
app.post("/post_comment", async (req, resp) => {

    /* Write comment to comments.json */
    const cmtJsonObj = JSON.parse(await readJSON(cmt_file));
    cmtJsonObj[req.body.comment_id] = {
        "user":     req.body.user_id,
        "comment":  req.body.comment,
        "photo":    req.body.photo
    };
    writeJSON(cmt_file, cmtJsonObj);

    /* Write comment to users.json */
    const userJsonObj = JSON.parse(await readJSON(user_file));
    userJsonObj[req.body.user_id].comments[req.body.comment_id] = req.body.comment;
    writeJSON(user_file, userJsonObj);

    /* Return comment json object */
    resp.send(JSON.stringify(cmtJsonObj));
});

/* Delete comment */
app.post("/delete_comment", async (req, resp) => {

    /* Delete comment in comments.json */
    const cmtJsonObj = JSON.parse(await readJSON(cmt_file));
    delete cmtJsonObj[req.body.comment_id];
    writeJSON(cmt_file, cmtJsonObj);

    /* Write comment to users.json */
    const userJsonObj = JSON.parse(await readJSON(user_file));
    delete userJsonObj[req.body.user_id].comments[req.body.comment_id];
    writeJSON(user_file, userJsonObj);

    /* Return comment json object */
    resp.send(JSON.stringify(cmtJsonObj));
});

/**********************************************************/
/* Photos */

/* Load images when entering site */
app.post("/load_images", async (req, resp) => {
    resp.send(await readJSON(img_file));
});

/* Show the new image and store it in JSON */
app.post("/upload_image", async (req, resp) => {

    /* Write image to images.json */
    const imgJsonObj = JSON.parse(await readJSON(img_file));
    imgJsonObj[req.body.image_id] = {
        "user": req.body.user_id,
        "photo": req.body.photo
    }
    writeJSON(img_file, imgJsonObj);

    /* Write image to users.json */
    const userJsonObj = JSON.parse(await readJSON(user_file));
    userJsonObj[req.body.user_id].photos[req.body.image_id] = req.body.photo;
    writeJSON(user_file, userJsonObj);
});

/* position*/
let position_file = "./map/position.json";

app.post("/update_position", async (req, resp) => {
    console.log(req.body.dogID);
    console.log(req.body.lat);
    console.log(req.body.lng);
    const jsonObj = JSON.parse(await readJSON(position_file));
    jsonObj[req.body.dogID] = {
        "lat":  parseFloat(req.body.lat),
        "lng":  parseFloat(req.body.lng)
    };
    writeJSON(position_file, jsonObj);
});

/* navigation */
let navig = "./map/navig.json";

app.post("/navig", async (req, resp) => {
    var dogID = req.body.dogID;
    console.log(`dogID: ${dogID}`);

    const jsonObj = JSON.parse(await readJSON(navig));
    jsonObj["dogID"] = dogID;
    writeJSON(navig, jsonObj);
});

