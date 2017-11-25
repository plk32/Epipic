const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const minify = require('express-minify');

app.use(minify());
app.use(express.static('public'));
app.use(bodyParser.json());

// Root sends index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api/pictures', (req, res) => {
  //let myImages = fs.readFileSync('./api/1500-random-images.json');
  let myImages = fs.readFileSync('./api/myimages.json');
  let pictures = JSON.parse(myImages);

  let array = [];
  let cursor = -1;
  if (req.query.cursor != undefined) {
    cursor = parseInt(req.query.cursor);
  }
  let max = cursor + parseInt(req.query.amount);
  console.log('cursor: ' + cursor);

  if (cursor > pictures.length - 1) {
    return res.sendStatus(404);
  }

  for(let i = cursor + 1; (i <= max) && (i < pictures.length); i++) {
    let obj = {}
    obj.id = pictures[i].id;
    obj.index = pictures[i].index;
    obj.picture = pictures[i].picture;
    obj.caption = pictures[i].caption;

    //console.log(JSON.stringify(obj));
    array.push(obj);
  }
  res.send({ 'pictures' : array });
});

app.post('/api/pictures', (req, res) => {
  if (req.body.picture == null) {
    return res.sendStatus(500);
  }

  let myImages = fs.readFileSync('./api/myimages.json');
  let pictures = JSON.parse(myImages);

  let obj = {}
  obj.id = pictures[pictures.length - 1].id + 1;
  obj.index = pictures.length;
  obj.picture = req.body.picture;
  obj.caption = req.body.caption;

  pictures.push(obj);
  let picturesNew = JSON.stringify(pictures);
  fs.writeFileSync('./api/myimages.json', picturesNew);

  res.send('Picture posted');
  console.log(obj);
});

app.delete('/api/pictures/:id', (req, res) => {
  let myImages = fs.readFileSync('./api/myimages.json');
  let pictures = JSON.parse(myImages);

  for (let i = 0; i < pictures.length; i++) {
    if (pictures[i].id == req.params.id) {
      pictures.splice(i, 1);
    }
  }

  let picturesNew = JSON.stringify(pictures);
  fs.writeFileSync('./api/myimages.json', picturesNew);
  res.send('DELETE request for id: ' + req.params.id);
});

// start your server
app.listen(4242, () => {
  console.log('EPIPIC listening on port 4242!');
});

//module.exports = app;
