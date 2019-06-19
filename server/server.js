const db = {};

const express = require('express');
const app = express();
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var formidable = require('formidable');
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/video', (req, res) => {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    const userId = `user${JSON.parse(fields.data).videoId}`;
    db[userId] = {};

    let buffer = new Buffer.from(fs.readFileSync(files.file.path), "base64");
    db[userId]["videoObj"] = buffer;
  });
});

app.post('/upload', (req, res) => {
  let receivedObj = req.body;
  let user = "user" + receivedObj.userid;
  receivedObj.finished = false;
  db[user]["final"] = receivedObj
});

app.get('/list', (req, res) => {
  res.sendFile('views/interface.html', {root: __dirname });
})

app.post('/deleteId', (req, res) => {
  delete db[`user${req.body.user}`];
});

app.get('/interface.js', (req, res) => {
  res.sendFile('views/interface.js', {root: __dirname });
})

app.get('/allData', (req, res) => {
  res.status(200);
  res.send(db);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))