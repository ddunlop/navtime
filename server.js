var 
  fs = require('fs'),
  Db = require('mongodb').Db,
  Server = require('mongodb').Server,
  BSON = require('mongodb').BSONNative,
  app = require('express').createServer();

var pixel = fs.readFileSync(__dirname + "/images/tracking.gif");

var collection = false;
var db = new Db('navtime', new Server('localhost', 27017), {native_parser:true});
db.open(function(err, db) {
  db.collection('gather', function(err, collect) {
    collection = collect;
    collection.ensureIndex([['name',1]],false,function() {});
    console.log('ready');
  });
});

app.get('/', function(req, res){
    res.send('Nothing to See here');
});

app.get('/data', function(req, res) {
  res.contentType('gif');
  res.send(pixel);
  var data = req.query;
  data['user-agent'] = req.header('User-Agent','none');
  data['referer'] = req.header('Referer','none');
  console.log(data);
  collection.update(
    {day:getFullDay()},
    {'$push':{data:data}},
    {upsert:true}
  );
});

function pad(str, pad) {
  str += "";
  while(str.length < pad) {
    str = '0'+str;
  }
  return str;
}

function getFullDay() {
  var d = new Date();
  return d.getFullYear()+pad(d.getMonth()+1,2)+pad(d.getDate(),2);
}

app.listen(3000);
