const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const port = 2123;

app.use(express.urlencoded({extended: false, limit: "100mb"}));
app.use(express.json({limit: "100mb"}));
app.use("/",express.static(__dirname));


app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
    });
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
