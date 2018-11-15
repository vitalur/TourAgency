const express = require('express'),
  bodyParser = require('body-parser'),
  mysql = require('mysql'),
  path = require('path'),
  app = express();

app.use(express.static(path.join(__dirname, 'views/public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '01',
  database: 'TourAgency'
});
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});
//connect
app.get("/addNewServicePage", function (req, res) {
  res.render("addNewServicePage.ejs");
});

app.get("/adminPage", function (req, res) {
  res.render("adminPage.ejs");
});

app.post("/conect_admin", function (req, res) {
  let login = req.body.login, password = req.body.password;
  if (login === 'login' && password === 'password') {
    res.render("adminPage.ejs");
  } else {
    res.redirect("connect.ejs");
  }
});
/*    OPEN MAIN PAGE    */
app.get("/", function (req, res) {
  let sql = 'SELECT * from tour';
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('index.ejs', {posts: results});
  });
});
/*    OPEN ADMIN PAGE   */
app.get("/conect", function (req, res) {
  res.render("conect.ejs");
});
/*         SELECT       */
app.get("/selectServices", (req, res) => {
  let sql = 'SELECT * FROM tour';
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render("show.ejs", {posts: results});
  });
});
/* SELECT SINGLE SERVICE */
app.get('/service/:id', (req, res) => {
  let sql = `SELECT * FROM tour WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("showSingleService.ejs", {post: result});
  });
});
/*         DELETE        */
app.delete('/deleteService/:id', (req, res) => {
  let sql = `DELETE from tour WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, readminPagesult) => {
    if (err) throw err;
  });
});
/*         UPDATE        */
app.post('/updateService', (req, res) => {
  let id = req.body.id, new_title = req.body.title, new_cost = req.body.cost, new_image = req.body.image,
    new_description = req.body.description;
  console.log('1 ' + new_title + ' ' + new_cost + ' ' + new_image + ' ' + new_description);
  let sql = `UPDATE tour SET title = '${new_title}', cost = '${new_cost}', description = '${new_description}', pic = '${new_image}' WHERE id = '${id}'`;
  let query = db.query(sql, (err, result) => {
    if (err) console.log(err);
  });
});

app.post("/new_service", function (req, res) {
  let new_title = req.body.text, new_cost = req.body.cost, new_image = req.body.image,
    new_description = req.body.description;
  let arr = new_image.split('.');
  if ((arr[arr.length - 1] === 'jpg' || arr[arr.length - 1] === 'png') && isNumeric(new_cost)) {
    let sql = 'INSERT INTO tour SET ?';
    let query = db.query(sql, {
      title: new_title,
      cost: new_cost,
      description: new_description,
      pic: new_image
    }, (err, result) => {
      if (err) console.log(err);
      console.log(result);
    });
    res.render("adminPage.ejs");
  } else {
    res.redirect(req.get('referer'));
  }
});

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//обработчик единичного поста
app.get("/post/:id", function (req, res) {
  let id = req.params.id;
  res.render('post.ejs', {post: posts[id - 1]});
});

//добавление поста
app.get("/write", function (req, res) {
  res.render("write.ejs");
});

//обработчик получения данных
app.post("/write", function (req, res) {
  let title = req.body.title, content = req.body.content;
  posts.push({title: title, content: content});
  res.redirect("/");
});

/*//create db
app.get( '/createdb', (req, res) => {
  let sql = 'CREATE DATABASE';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send( 'database created...' );
  } );
});
//create table
app.get('/createposttable', (req, res) => {
  let sql = 'CREATE TABLE post(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.send( 'Post table crated...' );
  } );
} );
//insert post 1
app.get( '/addpost1', (req, res) => {
  let post = { title: 'post one', body: 'my body' };
  let sql = 'INSERT INTO posts SET ?';
  let query = db.query(sql, post, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.send( 'Post added...' );
  } );
} );
//select posts
app.get( '/getposts', (req, res) => {
  let sql = 'SELECT * FROM posts';
  let query = db.query(sql, (err, results) => {
    if (err) console.log(err);
    console.log(results);
    res.send( 'Posts fetched...' );
  } );
} );
//select single post
app.get( '/getpost/:id', (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.send( 'Post fetched...' );
  } );
} );
//UPDATE post
app.get( '/updatepost/:id', (req, res) => {
  let newTitle = 'newTitle', newBody = 'newBody';
  let sql = `UPDATE posts SET title = ${newTitle}, body = ${newBody} WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.send( 'Post updated...' );
  } );
} );
//DELETE post
app.get( '/deletepost/:id', (req, res) => {
  let newTitle = 'newTitle', newBody = 'newBody';
  let sql = `DELETE from posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.send( 'Post deleted...' );
  } );
} );
*/
app.listen(3000, function () {
  console.log('work on 3000 port')
});