/* global io */

'use strict';

angular.module('memoApp')
  .service('memoService', function memoService() {
    this.socket = io.connect(window.location.protocol + '//' + window.location.hostname);

    this.watch = function (file) {
      this.socket.emit('watch', file);
    };

    this.load = function (file, callback) {
      this.socket.on('memo', function (data) {
        if (callback) {
          callback(data);
        }
      });
    };

    this.save = function (file, memo) {
      this.socket.emit('save', {
        file: file,
        memo: memo
      });
    };

    this.getDirSplit = function (dir, disableLastItem) {
      var dirSplit = [];
      var fullDir = '';

      var dirs = dir.split('/');
      var length = dirs.length;
      for (var i = 0; i < length; i++) {
        var d = {
          name: dirs[i]
        };
        if (!disableLastItem || (i !== length - 1)) {
          d.link = fullDir + dirs[i];
        }
        dirSplit.push(d);
        fullDir += dirs[i] + '/';
      }

      return dirSplit;
    };
  });
