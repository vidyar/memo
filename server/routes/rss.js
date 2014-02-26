
var rssConfig = require('../config').rssConfig;

var rss = require('rss');
var feed = new rss(rssConfig);

exports.get = function(req, res) {
  var xml = feed.xml();
  // console.log(xml);
  res.set('Content-Type', 'application/xml');
  res.send(xml);
};

exports.post = function(req, res) {
  var path = req.params[0];
  console.log(path);

  res.send();
};
