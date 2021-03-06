'use strict';

var rss = require('express').Router();

var Rss = require('rss');
var fs = require('fs');
var path = require('path');
var marked = require('marked');

var config = require('../config');
var memoConfig = config.memoConfig;
var rssConfig = config.rssConfig;

var memoDir = path.join(__dirname, '../..', memoConfig.dir);
var rssDir = path.join(memoDir, rssConfig.dir);


rss.get('/memo.rdf', function(req, res) {
  var url =  'http://' + req.headers.host + '/';
  rssConfig.feed_url = url + 'rss/memo.rdf';
  rssConfig.site_url = url;
  rssConfig.image_url = url + 'images/yeoman.png';
  rssConfig.docs = url;
  rssConfig.ttl = 60;

  var feed = new Rss(rssConfig);

  fs.readdir(rssDir, function (err, files) {
    files.sort(function (a, b) {
      return a > b ? -1 : 1;
    });

    for (var i = 0, l = files.length; i < l; i++) {
      var file = files[i];
      if (file.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})_(.*)/)) {
        var date = new Date();
        date.setTime(Date.UTC(RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6));

        var title = RegExp.$7 || '(No title)';
        var memo = path.join(rssDir, fs.readlinkSync(path.join(rssDir, file)));
        var url =  'http://' + req.headers.host + '/#/memos' + memo.replace(memoDir, '');
        var description = marked(fs.readFileSync(memo).toString());

        feed.item({
          title: title,
          description: description,
          url: url,
          author: rssConfig.author,
          date: date
        });

        if (feed.items.length >= 10) {
          break;
        }
      }
    }

    res.set('Content-Type', 'application/xml');
    // res.type('rss');
    res.send(feed.xml());
  });
});

rss.post('/*', function(req, res) {
  var title = req.query.t;
  var src = path.join(rssDir, getDataString() + '_' + title);
  var dst = path.join('../..', memoConfig.dir, req.params[0]);

  fs.symlink(dst, src, function (err) {
    if (err) {
      throw err;
    }
  });

  res.send();
});

function getDataString() {
  function getValue(d, funcName) {
    var value = d['getUTC' + funcName]();
    if (funcName === 'Month') {
      value++;
    }
    if (value < 10) {
      value = '0' + value;
    }
    return value;
  }

  var date = new Date();
  var funcNames = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds'];
  var dateString = '';
  for (var i = 0, l = funcNames.length; i < l; i++) {
    dateString += getValue(date, funcNames[i]);
  }
  return dateString;
}


module.exports.rss = rss;
