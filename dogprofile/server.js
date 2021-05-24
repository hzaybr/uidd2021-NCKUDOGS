/* Requirement and instances */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require('https')
const config = require('./config.js');
const { json } = require("express");
const sqlite3 = require('sqlite3').verbose();

/* Database */
const db = new sqlite3.Database('data.db');
// db.run('DROP TABLE users');
// db.run('DROP TABLE comments');
// db.run('DROP TABLE images');
// db.run('CREATE TABLE users(id INTEGER PRIMARY KEY, name, profile)');
// db.run('CREATE TABLE comments(id INTEGER PRIMARY KEY, user_id INTEGER, dog_id INTEGER, comment, photo CLOB, timestamp DATETIME)');
// db.run('CREATE TABLE images(id INTEGER PRIMARY KEY, user_id INTEGER, dog_id INTEGER, photo CLOB, timestamp DATETIME)');

function sqlInsert(table, params) {
    let keys = Object.keys(params);
    let command = "INSERT INTO " + table + '(' + keys.join(',') + ") VALUES(";

    let q = [];
    for (var i = 0; i < keys.length; ++i) {
        q.push("?");
    }
    command += q.join(',') + ')';

    db.run(command, Object.values(params));
}

function sqlUpdate(table, params) {
    let keys = Object.keys(params);
    let command = "REPLACE INTO " + table + '(' + keys.join(',') + ") VALUES(";

    let q = [];
    for (var i = 0; i < keys.length; ++i) {
        q.push("?");
    }
    command += q.join(',') + ')';

    db.run(command, Object.values(params));
}

function sqlDelete(table, index) {
    var sqlDel = "delete from " + table + " where id=?";
    db.run(sqlDel, index);
}

function sqlPrint(table) {
    var sqlSELECT = "SELECT * FROM " + table;
    db.each(sqlSELECT, function (err, row) {
        console.log(row);
    });
}

function sql2JSON(table) {
    return new Promise((res, rej) => {
        var sqlSELECT = "SELECT rowid AS rowid, * FROM " + table;
        let jsonObj = {};

        db.each(sqlSELECT, (err, row) => { // This gets called for every row our query returns
            let keys = Object.keys(row);
            jsonObj[row.rowid] = {};
            for (var i = 0; i < keys.length; ++i) {
                jsonObj[row.rowid][keys[i]] = row[keys[i]];
            }
        }, (err) => { // This gets called after each of our rows have been processed
            res(jsonObj);
        });
    });
}


/* Enable json parsing */
app.use(express.urlencoded({extended: false, limit: "1024mb"}));
app.use(express.json({limit: "1024mb"}));

/* Static path */
app.use("/", express.static(__dirname));

const sslOptions = {
    key: fs.readFileSync(config.key_path),
    ca: fs.readFileSync(config.ca_path),
    cert: fs.readFileSync(config.cert_path)
}

/* Any number from the IANA ephemeral port range (49152-65535) */
const port = 15037;

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
    resp.send(JSON.stringify(await sql2JSON('users')));
});

/* Update user data */
app.post("/update_users", async (req, resp) => {
    sqlUpdate('users', {   
                "id":       req.body.id,
                "name":     req.body.name,
                "profile":  req.body.profile
            });

    resp.send(JSON.stringify(await sql2JSON('users')));
});

/**********************************************************/
/* Comments */

/* Load comments when entering site */
app.post("/load_comments", async (req, resp) => {
    resp.send(JSON.stringify(await sql2JSON('comments')));
});

/* Show the new comment and store it in JSON */
app.post("/post_comment", async (req, resp) => {
    db.each('SELECT datetime(\'now\')', (err, row) => {
        sqlUpdate('comments', {
            "id":           req.body.comment_id,
            "user_id":      req.body.user_id,
            "dog_id":       req.body.dog_id,
            "comment":      req.body.comment,
            "photo":        req.body.photo,
            "timestamp":    Object.values(row)[0]
        });
    });
    resp.send(JSON.stringify(await sql2JSON('comments')));
});

/* Delete comment */
app.post("/delete_comment", async (req, resp) => {
    sqlDelete('comments', req.body.comment_id);
    resp.send(JSON.stringify(await sql2JSON('comments')));
});

/**********************************************************/
/* Photos */

/* Load images when entering site */
app.post("/load_images", async (req, resp) => {
    resp.send(JSON.stringify(await sql2JSON('images')));
});

/* Show the new image and store it in JSON */
app.post("/upload_image", async (req, resp) => { 
    db.each('SELECT datetime(\'now\')', (err, row) => {
        sqlUpdate('images', {
            "id":           req.body.image_id,
            "user_id":      req.body.user_id,
            "dog_id":       req.body.dog_id,
            "photo":        req.body.photo,
            "timestamp":    Object.values(row)[0]
        });
    });
    resp.send(JSON.stringify(await sql2JSON('images')));
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

