var express = require('express');
var router = express.Router();
var index;
const name = "게시판 서버"
var articles = {};

/* --- database settings finished --- */

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/articles.db', (err) => {
  if ( err ) {
    return console.error(err.message);
  } else {
    console.log("Connected to database file");
  }
});
db.run("CREATE TABLE IF NOT EXISTS articles (id INTEGER, title TEXT(100), content TEXT(10000))");
db.get("SELECT MAX(id) FROM articles", (err, row) => {
  index = row['MAX(id)'] + 1;
})

/* --- database settings finished --- */

/* GET home page. */
router.get('/', function (req, res, next) {
  db.all("SELECT * from articles", (err, rows) => {
    res.render('index', { name: name, articles: rows });
  });
});

/* POST an article */
router.post('/', async function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;

  await new Promise((resolve, reject)=>{
    db.run(`INSERT INTO articles (id, title, content) VALUES(${index}, '${title}', '${content}')`, (err) => {
      if ( err != null ) {
        reject(err);
        return;
      }
      resolve();
    });
  });
  index++;
  res.render('articleView', { id: index-1, title: title, content: content });
});

/* DELETE an article */
router.get('/delete/:id', async function(req, res, next) {
  var id = req.params.id;
  db.serialize(()=>{
    db.run(`DELETE FROM articles WHERE id=${id}`);
    db.all("SELECT * from articles", (err, rows) => {
      res.render('index', { name: name, articles: rows });
    });
  });
});

/* go to article write page */
router.get('/write', function(req, res, next) {
  res.render('articleWrite');
});

/* go to a certain article page */
router.get('/view', function(req, res, next) {
  const id = req.query.id;
  db.get(`SELECT title, content FROM articles WHERE id=${id}`, (err, row) => {
    res.render('articleView', { id: id, title: row.title, content: row.content });
  });
});

/* go to article modify page */
router.get('/modify/:id', function(req, res, next) {
  var id = req.params.id;
  db.get(`SELECT title, content FROM articles WHERE id=${id}`, (err, row) => {
    res.render('articleModify', { id: id, title: row.title, content: row.content });
  });
});

/* modify an article */
router.post('/:id', function(req, res, next) {
  var id = req.params.id;
  var title = req.body.title;
  var content = req.body.content;

  db.serialize(()=>{
    db.run(`UPDATE articles SET title='${title}', content='${content}' WHERE id=${id}`, (err) => {
      res.render('articleView', { id: id, title: title, content: content});
    });
  });
});

module.exports = router;
