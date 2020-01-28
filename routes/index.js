var express = require('express');
var router = express.Router();

const name = "게시판 서버"
var index = 2;
var articles = {'0': {title: "title1", content: "content1"}, '1': {title: "title2", content: "content2"}};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { name: name, articles: articles });
});

/* POST an article */
router.post('/', function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;

  articles[index] = {title: title, content: content};
  index++;
  res.render('index', { name: name, articles: articles });
});

/* DELETE an article */
router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;
  delete articles[id];
  
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
