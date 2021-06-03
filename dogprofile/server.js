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
const request = require('request');



// db.serialize(function() {
//     /* Delete table */
//     db.run('DROP TABLE users');
//     db.run('DROP TABLE comments');
//     db.run('DROP TABLE images');

//     /* Create table */
//     let cmd = "CREATE TABLE users(id TEXT PRIMARY KEY, name TEXT, profile CLOB";
//     for (var i = 0; i < 19; ++i) {
//        cmd += ", dog_" + i.toString() + " TINYINT DEFAULT 0";
//     }
//     cmd += ")";
//     console.log(cmd);
//     db.run(cmd);
//     db.run("CREATE TABLE comments(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, dog_id INTEGER, comment TEXT, photo CLOB, timestamp DATETIME)");
//     db.run("CREATE TABLE images(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, dog_id INTEGER, photo CLOB, timestamp DATETIME)");
// })

// db.run("DELETE FROM images");

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


/* get userID from id token*/
app.post("/idtoken", (req, res)=>{
  p = new Promise((resolve, reject) =>{
  var token = req.body.idToken
  resolve(token)
  })
  p.then((token)=>{
    request({
        uri: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    }, function(error, response, body) {
      body = JSON.parse(body)
      res.send(body)
    });
  })
})



/**********************************************************/
/* Paths */
/**********************************************************/


/**********************************************************/
/* Score */

app.post("/update_score", async (req, resp) => {
    let command = "UPDATE users SET dog_" + req.body.dog_id + " = " + req.body.score
                    + " WHERE id = \"" + req.body.user_id + "\"";
    db.run(command);
});
/**********************************************************/



/**********************************************************/
/* Users */

app.post("/load_users", async (req, resp) => {
    var command = "SELECT * FROM users";
    let jsonObj = {};
    let dog_id = "dog_" + req.body.dog_id;

    db.each(command, (err, row) => { // This gets called for every row our query returns
        jsonObj[row.id] = {};
        jsonObj[row.id]["name"] = row["name"];
        jsonObj[row.id]["profile"] = row["profile"];
        jsonObj[row.id]["score"] = row[dog_id];
    }, (err) => { // This gets called after each of our rows have been processed
        resp.send(JSON.stringify(jsonObj));
    });
});

app.post("/update_users", async (req, resp) => {
    let command = "SELECT name FROM users WHERE id = \"" + req.body.id + "\"";
    db.get(command, (err, row) => {
        if (!row) { // User first log in
            sqlUpdate('users', {   
                "id":       req.body.id,
                "name":     req.body.name,
                "profile":  req.body.profile
            });
        }
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
    db.serialize(function() {
        db.get("SELECT datetime('now','localtime')", (err, row) => {
            let cmt = {
                "user_id":      req.body.user_id,
                "dog_id":       req.body.dog_id,
                "comment":      req.body.comment,
                "photo":        req.body.photo,
                "timestamp":    Object.values(row)[0]
            };
            if (req.body.comment_id != -1) { // edit comment
                cmt["id"] = req.body.comment_id;
            }
            sqlUpdate('comments', cmt);
        });
    
        db.get("SELECT MAX(id) FROM comments", (err, row) => {
            resp.send(row["MAX(id)"].toString());
        });
    });
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
    db.serialize(function() {
        db.get("SELECT datetime('now','localtime')" , (err, row) => {
            sqlUpdate('images', {
                "user_id":      req.body.user_id,
                "dog_id":       req.body.dog_id,
                "photo":        req.body.photo,
                "timestamp":    Object.values(row)[0]
            });
        });
    
        db.get("SELECT MAX(id) FROM images", (err, row) => {
            resp.send(row["MAX(id)"].toString());
        });
    });
});
/**********************************************************/

/* position*/
let position_file = "./map/position.json";

app.get("/dog_position", async (req, resp) => {
    resp.send(JSON.stringify(await sql2JSON('position_original'))); 
});
app.post("/update_position", async (req, resp) => {
		db.get("SELECT datetime('now','localtime')", (err, row) => {
    	sqlInsert('position_record',{
        "user_id":  req.body.user_id,
        "dog_id":   req.body.dog_id,
        "lat":      req.body.lat,
        "lng":      req.body.lng,
        "timestamp":Object.values(row)[0]
    	})
			console.log('success');
		});
   /* console.log(req.body.user_id)
    console.log(req.body.dog_id);
    console.log(req.body.lat);
    console.log(req.body.lng);*/
   /* const jsonObj = JSON.parse(await readJSON(position_file));
    jsonObj[req.body.dogID] = {
        "lat":  parseFloat(req.body.lat),
        "lng":  parseFloat(req.body.lng)
    };
    writeJSON(position_file, jsonObj);*/
});


/* load profile page */
app.post("/load_profile_cmt", async (req, res) => {
  let command = `SELECT dog_id, comment, photo, timestamp FROM comments WHERE user_id = '${req.body.userID}'`
  var data ={} 
  db.all(command, (err, rows) =>{
    rows.forEach(function(row, i) {
      data[i] = row
    })
    res.send(data)
  })
});

app.post("/load_profile_img", async (req, res) => {
  let command = `SELECT dog_id, photo, timestamp FROM images WHERE user_id = '${req.body.userID}'`
  var data ={} 
  db.all(command, (err, rows) =>{
    rows.forEach(function(row, i) {
      data[i] = row
    })
    res.send(data)
  })
});

app.post("/load_profile_position", async (req, res) => {
  let command = `SELECT dog_id, lat, lng, timestamp FROM position_record WHERE user_id = '${req.body.userID}'`
  var data ={} 
  db.all(command, (err, rows) =>{
    rows.forEach(function(row, i) {
      data[i] = row
    })
    res.send(data)
  })
})

app.post("/load_score", async (req, res) => {
  var txt = "dog_0"
  for (var i=1; i<19; i++) {
    txt+= `,dog_${i}`
  }
  let command = `SELECT ${txt} FROM users WHERE id = '${req.body.userID}'`
  db.get(command, (err, row) =>{
    res.send(row)
  })
});

app.post("/load_time", async (req, res) =>{
  db.get("SELECT datetime('now','localtime')", (err, row) => {
    res.send(Object.values(row)[0])
  })
})



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
    command += q.join(',') + ');';

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
