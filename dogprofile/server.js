/* Requirement and instances */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require('https')
const config = require('./config.js');
const { json } = require("express");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

/* >> npm install --save bcryptjs && npm uninstall --save bcrypt */
// const bcrypt = require('bcryptjs');
// const saltRounds = 10;
// const myPlaintextPassword = 'p@@sW00d_123456';
// const hash = '$2a$10$3WUhJpRd.KxigIJ0/5wbo.WDvtTBWVB.drtzmqNx24u4bdNwA8pP.';

// const correctPassword = 'p@@sW00d_123456';
// const wrongPassword = 'zaqxsw123456'

// bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
//     console.log(hash);
// });

// console.log(bcrypt.compareSync(correctPassword, hash));
// console.log(bcrypt.compareSync(wrongPassword, hash));



// db.run('DROP TABLE users');
// db.run('DROP TABLE comments');
// db.run('DROP TABLE images');
// db.run('CREATE TABLE users(id INTEGER PRIMARY KEY, name, profile)');
// db.run('CREATE TABLE comments(id INTEGER PRIMARY KEY, user_id INTEGER, dog_id INTEGER, comment, photo CLOB, timestamp DATETIME)');
// db.run('CREATE TABLE images(id INTEGER PRIMARY KEY, user_id INTEGER, dog_id INTEGER, photo CLOB, timestamp DATETIME)');



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






/**********************************************************/
/* Paths */
/**********************************************************/

app.post("/load_data", async (req, resp) => {
    resp.send(JSON.stringify(await sql2JSON(req.body.table)));
});



/**********************************************************/
/* Users */

app.post("/update_users", async (req, resp) => {
    sqlUpdate('users', {   
                "id":       req.body.id,
                "name":     req.body.name,
                "profile":  req.body.profile
            });

    resp.send(JSON.stringify(await sql2JSON('users')));
});
/**********************************************************/



/**********************************************************/
/* Comments */

app.post("/load_comments", async (req, resp) => {
    var command = "SELECT rowid AS rowid, * FROM comments WHERE dog_id = ";
    command += req.body.dog_id;
    let jsonObj = {};

    db.each(command, (err, row) => { // This gets called for every row our query returns
        jsonObj[row.rowid] = {};
        jsonObj[row.rowid]['user_id'] = row['user_id'];
        jsonObj[row.rowid]['comment'] = row['comment'];
        jsonObj[row.rowid]['photo'] = row['photo'];
    }, (err) => { // This gets called after each of our rows have been processed
        resp.send(JSON.stringify(jsonObj));
    });
});

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

app.post("/delete_comment", async (req, resp) => {
    sqlDelete('comments', req.body.comment_id);
    resp.send(JSON.stringify(await sql2JSON('comments')));
});
/**********************************************************/



/**********************************************************/
/* Photos */

app.post("/load_images", async (req, resp) => {
    var command = "SELECT rowid AS rowid, * FROM images WHERE dog_id = ";
    command += req.body.dog_id;
    let jsonObj = {};

    db.each(command, (err, row) => { // This gets called for every row our query returns
        jsonObj[row.rowid] = {};
        jsonObj[row.rowid]['user_id'] = row['user_id'];
        jsonObj[row.rowid]['photo'] = row['photo'];
    }, (err) => { // This gets called after each of our rows have been processed
        resp.send(JSON.stringify(jsonObj));
    });
});

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
/**********************************************************/




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






/**********************************************************/
/* Functions */
/**********************************************************/


/**********************************************************/
/* Database functions */

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
    let command = "delete from " + table + " where id=?";
    db.run(command, index);
}

function sqlPrint(table) {
    var command = "SELECT * FROM " + table;
    db.each(command, function (err, row) {
        console.log(row);
    });
}

function sql2JSON(table) {
    return new Promise((res, rej) => {
        var command = "SELECT rowid AS rowid, * FROM " + table;
        let jsonObj = {};

        db.each(command, (err, row) => { // This gets called for every row our query returns
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
/**********************************************************/



/**********************************************************/
/* JSON file functions */

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
/**********************************************************/
