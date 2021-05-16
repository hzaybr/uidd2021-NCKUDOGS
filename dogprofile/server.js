/* Requirement and instances */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require('https')
const config = require('./config.js')

/* Enable json parsing */
app.use(express.urlencoded({extended: false, limit: "100mb"}));
app.use(express.json({limit: "100mb"}));

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

    jsonObj[req.body.id] = {
        "name":     req.body.name,
        "profile":  req.body.profile,
        "score":    score
    };
    
    /* Write back to JSON */
    fs.writeFile(user_file, JSON.stringify(jsonObj, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
    });

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
    const jsonObj = JSON.parse(await readJSON(cmt_file));

    jsonObj[req.body.comment_id] = {
        "user":     req.body.user_id,
        "comment":  req.body.comment,
        "photo":    req.body.photo
    };

    /* Write back to JSON */
    fs.writeFile(cmt_file, JSON.stringify(jsonObj, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
    });

    resp.send(JSON.stringify(jsonObj));
});

/* Delete comment */
app.post("/delete_comment", async (req, resp) => {
    const jsonObj = JSON.parse(await readJSON(cmt_file));
    delete jsonObj[req.body.id];

    fs.writeFile(cmt_file, JSON.stringify(jsonObj, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
    })

    resp.send(JSON.stringify(jsonObj));
});

/**********************************************************/
/* Photos */

/* Load images when entering site */
app.post("/load_images", async (req, resp) => {
    resp.send(await readJSON(img_file));
});

/* Show the new image and store it in JSON */
app.post("/upload_image", async (req, resp) => {
    const jsonObj = JSON.parse(await readJSON(img_file));
    jsonObj[req.body.image_id] = {
        "user": req.body.user_id,
        "photo": req.body.photo
    }

    /* Write back to JSON */
    fs.writeFile(img_file, JSON.stringify(jsonObj, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
    });
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
  fs.writeFile(position_file, JSON.stringify(jsonObj, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
  });
});

/* navigation */
let navig = "./map/navig.json";

app.post("/navig", async (req, resp) => {
  var dogID = req.body.dogID;
  console.log(`dogID: ${dogId}`);

  const jsonObj = JSON.parse(await readJSON(navig));
  jsonObj["dogID"] = dogID; 
  fs.writeFile(navig, JSON.stringify(jsonObj, null, 4), (err) => {
        if(err){
            console.log("Write file failed: " + err);
        }
  });
  });

