// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var shortid = require('shortid');

var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
db.defaults({ todos: [] });

app.set('view engine', 'pug');
app.set('views', './views')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//var lists = ['Đi làm','Nấu cơm','Rửa chén','Học codersX']
// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.send('I love CodersX');
});

app.get('/todos', (req, res) => {
  var q = req.query.q ;
  if(q){
    var matchLList = db.value().todos.filter(function(list){
    return list.text.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
  }
  else
    {
      var matchLList = db.value().todos;
    }
  res.render('index',{
    listToDo : matchLList
  });
});
app.get('/todos/create',function(req,res){
  res.render('create');
});
app.post('/todos/create',function(req,res){
   req.body.id = shortid.generate();
  db.get('todos').push(req.body).write();
  res.redirect('/todos');
});
app.get('/todos/:id/delete',function(req,res){
    var id = req.params.id;
    console.log(id);
    var list = db.get('todos')
    .find({ id: id })
    .value()
    var delStudent = db.value().todos.map(function(x,index){
        if(x===list){
            console.log(db.value().todos.splice(index,1));
        }
    })
    res.render('./delete',{
        list: list
    })
});
// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
