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
//     let cmd = "CREATE TABLE users(id TEXT PRIMARY KEY NOT NULL, name TEXT, profile CLOB, liked TEXT";
//     for (var i = 0; i < 19; ++i) {
//        cmd += ", dog_" + i.toString() + " TINYINT DEFAULT 0";
//     }
//     cmd += ")";
//     console.log(cmd);
//     db.run(cmd);
//     db.run("CREATE TABLE comments(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id TEXT, dog_id INTEGER, comment TEXT, photo CLOB, timestamp DATETIME)");
//     db.run("CREATE TABLE images(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id TEXT, dog_id INTEGER, photo CLOB, likes INTEGER DEFAULT 0, timestamp DATETIME)");
// })

// db.run("DELETE FROM images");

/* Enable json parsing */
app.use(express.urlencoded({extended: false, limit: "1024mb"}));
app.use(express.json({limit: "1024mb"}));

/* Static path */
app.use("/", express.static(__dirname));
app.use("/", express.static(`${__dirname}/aboutus_appv`));

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
    db.run(
        `UPDATE users SET dog_${req.body.dog_id} = ${req.body.score}\n`
    +   `WHERE id = "${req.body.user_id}"`
    );
});

app.post("/get_scores", async (req, resp) => {
    const dog_id = `dog_${req.body.dog_id}`;
    const command = `SELECT ${dog_id} FROM users WHERE ${dog_id} <> 0`;
    var scores = [0,0,0,0,0,0];

    db.each(command, (err, row) => {
        scores[row[dog_id]]++;
    }, (err) => {
        resp.send(scores);
    });
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
        jsonObj[row.id]["title"] = row["title"];
    }, (err) => { // This gets called after each of our rows have been processed
        resp.send(JSON.stringify(jsonObj));
    });
});

app.post("/get_unique_user", async (req, resp) => {
    let command = "SELECT name,profile FROM users WHERE id = \"" + req.body.id + "\"";
    db.get(command, (err, row) => {
      resp.send(JSON.stringify(row));
    });
});

app.post("/query_user", async (req, resp) => {
    let command = `SELECT * FROM users WHERE id = "${req.body.id}"`;
    db.get(command, (err, row) => {
        resp.send(row);
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

app.post("/update_user_profile", async (req, resp) => {
    let command = "";
    command += "UPDATE users\n";
    command += `SET profile = "${req.body.profile}", name = "${req.body.name}"\n`;
    command += `WHERE id = "${req.body.id}"`;
    db.run(command);
});

app.post("/save_title", async (req, resp) => {
    let command = "";
    command += "UPDATE users\n";
    command += `SET title = "${req.body.user_title}"\n`;
    command += `WHERE id = "${req.body.userID}"`;
    db.run(command);
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
        jsonObj[row.rowid]['timestamp'] = row['timestamp'];
    }, (err) => { // This gets called after each of our rows have been processed
        resp.send(JSON.stringify(jsonObj));
    });
});

app.post("/post_comment", async (req, resp) => {
    db.run(
        `UPDATE users SET dog_${req.body.dog_id} = ${req.body.score}\n`
    +   `WHERE id = "${req.body.user_id}"`
    );

    db.get("SELECT datetime('now','localtime')", (err, row) => {
        sqlInsert('comments', {
            "user_id":      req.body.user_id,
            "dog_id":       req.body.dog_id,
            "comment":      req.body.comment,
            "photo":        req.body.photo,
            "timestamp":    Object.values(row)[0]
        }, function() {
            db.get("SELECT MAX(id) FROM comments", (err, row) => {
                resp.send(row["MAX(id)"].toString());
            });
        });
    });
});

app.post("/edit_comment", async (req, resp) => {
    var command = `SELECT * FROM comments WHERE id = ${req.body.comment_id}`;
    db.get(command, (err, row) => {
        db.run(
            `UPDATE users SET dog_${row.dog_id} = ${req.body.score}\n`
        +   `WHERE id = "${row.user_id}"`
        );
    });

    db.run(
        `UPDATE comments\n`
    +   `SET comment = "${req.body.comment}", photo = "${req.body.photo}"\n`
    +   `WHERE id = ${req.body.comment_id}`
    );
});

app.post("/delete_comment", async (req, resp) => {
    sqlDelete('comments', req.body.comment_id);
});

app.post("/get_user_comment_ids", async (req, resp) => {
    var command = `SELECT id as id FROM comments\n`
    command += `WHERE dog_id = ${req.body.dog_id} AND user_id = "${req.body.user_id}"`;
    let arr = [];

    db.each(command, (err, row) => {
        arr.push(row.id);
    }, (err) => {
        resp.send(arr);
    });
});
/**********************************************************/



/**********************************************************/
/* Photos */

app.post("/preload_images", async (req, resp) => {
    var command = "SELECT id as id FROM images WHERE dog_id = ";
    command += req.body.dog_id;
    let arr = [];

    db.each(command, (err, row) => { // This gets called for every row our query returns
        arr.push(row.id);
    }, (err) => { // This gets called after each of our rows have been processed
        resp.send(arr.toLocaleString());
    });
});

app.post("/query_image", async (req, resp) => {
    var command = "SELECT * FROM images WHERE id = ";
    command += req.body.id;

    db.get(command, (err, row) => {
        resp.send(JSON.stringify(row));
    });
});

app.post("/upload_image", async (req, resp) => { 
    db.get("SELECT datetime('now','localtime')" , (err, row) => {
        sqlUpdate('images', {
            "user_id":      req.body.user_id,
            "dog_id":       req.body.dog_id,
            "photo":        req.body.photo,
            "timestamp":    Object.values(row)[0]
        }, function() {
            db.get("SELECT MAX(id) FROM images", (err, row) => {
                resp.send(row["MAX(id)"].toString());
            });
        });
    });
});

app.post("/delete_image", async (req, resp) => {
    db.run(`DELETE from images WHERE id = ${req.body.image_id}`);
});

app.post("/like_image", async (req, resp) => { 

    db.get(`SELECT liked FROM users WHERE id = "${req.body.user_id}"`, (err, row) => {
        var img = parseInt(req.body.image_id);
        var arr = [];

        if (row.liked) {
            arr = row.liked.split(',').map(function(num) {
                return parseInt(num);
            });
        }

        db.get(`SELECT likes FROM images WHERE id = ${img}`, (err, row) => {

            if (row === undefined) {
                console.log(`[Error]: Image id=${img} is not found\n`);
                return;
            }

            var liked = new Set(arr), likes = row.likes;
            if (liked.has(img)) {
                liked.delete(img);
                --likes;
            } else {
                liked.add(img);
                ++likes;
            }

            var arr_str = Array.from(liked).toLocaleString();
            db.run(`UPDATE images SET likes = ${likes} WHERE id = ${img}`);
            db.run(`UPDATE users SET liked = "${arr_str}" WHERE id = "${req.body.user_id}"`);
        });
    });
});

app.post("/get_liked_images", async (req, resp) => {
    db.get(`SELECT liked FROM users WHERE id = "${req.body.user_id}"`, (err, row) => {
        resp.send(row.liked);
    });
});

app.post("/get_user_photo_ids", async (req, resp) => {
    var command = `SELECT id as id FROM images\n`
    command += `WHERE dog_id = ${req.body.dog_id} AND user_id = "${req.body.user_id}"`;
    let arr = [];

    db.each(command, (err, row) => {
        arr.push(row.id);
    }, (err) => {
        resp.send(arr);
    });
});
/**********************************************************/

/* position*/
let position_file = "./map/position.json";

app.get("/dog_position", async (req, resp) => {
    resp.send(JSON.stringify(await sql2JSON('position_original'))); 
});
app.post("/update_position", async (req, resp) => {
    var now = new Date(); 
		db.get("SELECT datetime('now','localtime')", (err, row) => {
    	sqlInsert('position_record',{
        "user_id":  req.body.user_id,
        "dog_id":   req.body.dog_id,
        "lat":      req.body.lat,
        "lng":      req.body.lng,
        "timestamp":now.getTime()
    	})
			console.log('success');
    });
		//let command = "UPDATE position_original SET lat = " + req.body.lat + ", lng = " + req.body.lng + " WHERE dog_id = " + req.body.dog_id;
    //db.run(command);
});
app.post("/marked_position", async (req, resp) => {
    console.log(req.body.dog_id);
    /*let command = "SELECT position_original.lat, position_record.lat FROM position_original,position_record"
									 +" ON position_original.dog_id = position_record.dog_id"
									 +" WHERE position_original.dog_id = '";*/
		let command = "SELECT lat,lng FROM position_original WHERE dog_id = ";
    command += req.body.dog_id;
    //command += "'";
    var number = 0;
    var count = 1;
    let jsonObj = {};
		
    db.each(command, (err, row) => {
        count = (number%10)+1;
        jsonObj[count] = {};
        jsonObj[count]["lat"] = row["lat"];
        jsonObj[count]["lng"] = row["lng"];
        number++;
      }, (err) => {
        //console.log(jsonObj);
        //resp.send(JSON.stringify(jsonObj));
      });
    
		command = "SELECT lat,lng FROM position_record WHERE dog_id = '";
    command += req.body.dog_id;
    command += "'";
		db.each(command, (err, row) => {
        count = (number%10)+1;
        jsonObj[count] = {};
        jsonObj[count]["lat"] = row["lat"];
        jsonObj[count]["lng"] = row["lng"];
        number++;
      }, (err) => {
        //console.log(jsonObj);
        resp.send(JSON.stringify(jsonObj));
    });
});

/***************************************************************/

app.post("/gettime", async (req, resp) => {
  let command = "SELECT timestamp FROM position_record WHERE dog_id = '";
  command += req.body.dog_id;
  command += "'";
  var now = new Date();
  var gap = 0;
	//console.log(now.getTime());
  db.each(command, (err, row) => {
    gap = Math.round((now.getTime()-row["timestamp"])/1000);
		//console.log(now.getTime()-row["timestamp"]);
  }, (err) => {
    //console.log(gap);
    if(gap==0||gap>=604800){//over seven days
      resp.send(`0`);
    }else{
      resp.send(`${gap}`);
    } 
  });
});

app.post("/getheart", async (req, resp) => {
   	let dog_id = "dog_" + req.body.dog_id;
    let command = `SELECT ${dog_id} FROM users`;
    let total = 0;
    let count = 0;
    let score = 0;
    db.each(command, (err, row) => {
      if(row[dog_id]!=0){
        total += row[dog_id];
        count++;
        //console.log(row[dog_id])
			}
    }, (err) => {
      if(count==0){
        console.log(score);
      }else{
        score = Math.round(10 * total / count) / 10;
        //resp.send(`${score}`);
        console.log(score);
      }
      resp.send(`${score}`);
    });
    
});

/* load profile page */
app.post("/load_profile_cmt", async (req, res) => {
  let command = `SELECT * FROM comments WHERE user_id = '${req.body.userID}'`
  var data ={} 
  db.all(command, (err, rows) =>{
    rows.forEach(function(row, i) {
      data[i] = row
    })
    res.send(data)
  })
});

app.post("/load_profile_img", async (req, res) => {
  let command = `SELECT * FROM images WHERE user_id = '${req.body.userID}'`
  var data ={} 
  db.all(command, (err, rows) =>{
    rows.forEach(function(row, i) {
      data[i] = row
    })
    res.send(data)
  })
});

app.post("/get_image", async (req, res) => {
  let command = `SELECT * FROM images INNER JOIN  users ON images.user_id = users.id AND images.id='${req.body.image_id}'`
  var data ={} 
  db.get(command, (err, row) =>{
    res.send(row)
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
  txt = "dog_0"
  for (i=1; i<19; i++){
    txt += `,dog_${i}`
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

function sqlInsert(table, params, callback = function(){}) {
    let keys = Object.keys(params);
    let command = "INSERT INTO " + table + '(' + keys.join(',') + ") VALUES(";

    let q = [];
    for (var i = 0; i < keys.length; ++i) {
        q.push("?");
    }
    command += q.join(',') + ')';

    db.run(command, Object.values(params));
    callback();
}

function sqlUpdate(table, params, callback = function(){}) {
    let keys = Object.keys(params);
    let command = "REPLACE INTO " + table + '(' + keys.join(',') + ") VALUES(";

    let q = [];
    for (var i = 0; i < keys.length; ++i) {
        q.push("?");
    }
    command += q.join(',') + ');';

    db.run(command, Object.values(params));
    callback();
}

function sqlDelete(table, index, callback = function(){}) {
    let command = "delete from " + table + " where id=?";
    db.run(command, index);
    callback();
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
