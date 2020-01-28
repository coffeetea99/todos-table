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
router.get('/', async function (req, res, next) {
  const rows = await new Promise((resolve, reject) => {
    db.all("SELECT * from articles", (err, rows) => {
      if (err != null) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
  res.render('index', { name: name, articles: rows });
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
router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;
  db.run(`DELETE FROM articles WHERE id=${id}`);
  
  res.render('index', { name: name, articles: articles });
});

router.get('/write', function(req, res, next) {
  res.render('articleWrite');
});

router.get('/view', function(req, res, next) {
  const id = req.query.id;
  res.render('articleView', { id: id, title: articles[id].title, content: articles[id].content });
});

router.get('/modify/:id', function(req, res, next) {
  var id = req.params.id;
  res.render('articleModify', { id: id, title: articles[id].title, content: articles[id].content });
});

router.post('/:id', function(req, res, next) {
  var id = req.params.id;
  var title = req.body.title;
  var content = req.body.content;

  articles[id] = {title: title, content: content};
  res.render('articleView', { id: id, title: title, content: content});
});

module.exports = router;
