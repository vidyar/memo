/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $rootScope, $http, $routeParams, memoService) {
    $scope.localDir = 'file:///Users/eqo/src/nodejs/memo';
    $scope.hostDir = '/files';
    var types = {
      markdown: ['md'],
      book: ['pdf'],
      image: ['jpg', 'gif', 'png'],
      ms: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
    };

    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.dir = 'memos' + ($routeParams.dir ? '/' + $routeParams.dir : '');
    $scope.dirSplit = memoService.getDirSplit($scope.dir, true);

    $rootScope.title = $scope.dir;

    $scope.memos = [];

    $http.get($scope.dir).success(function (memos) {
      var mlength = memos.length;
      for (var i = 0; i < mlength; i++) {
        for (var type in types) {
          var tlength = types[type].length;
          for (var j = 0; j < tlength; j++) {
            var t = types[type][j];
            if (memos[i].name.substr(-(t.length + 1)) === ('.' + t)) {
              memos[i].type = type;
            }
          }
        }
      }

      $scope.memos = memos;
    });

    $('.modal').on('shown.bs.modal', function (e) {
      $(this).find('input').focus().select();
    });

    $('.modal').keypress(function (e) {
      if (e.charCode === 13) {
        var isDir = $(e.target).attr('id') === 'dirName';
        $scope.create(isDir);
      }
    });

    $scope.create = function (isDir) {
      var name;
      if (isDir) {
        name = $scope.dirName + '/';
      } else {
        name = $scope.memoName;
      }

      if (name) {
        $http.post($scope.dir + '/' + name).success(function () {
        });
      }

      $('.modal').modal('hide');
    };
  });
