'use strict';
/* jshint expr: true */
angular.module('lorenjonesApp')
  .controller('AdminAboutCtrl', function ($scope, $http, socket, Modal) {
    $scope.bioEntries = [];
    $scope.editing = false;
    $scope.copiedEntry;
    $http.get('/api/bio_entries', {}).success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      $scope.bioEntries[0].active = true;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });
    $scope.toggleEntry = function(id) {
      for (var i = 0; i < $scope.bioEntries.length; i++) {
        if ($scope.bioEntries[i]._id === id) {
          $scope.bioEntries[i].active = true;
        } else {
          $scope.bioEntries[i].active = false;
        }
      }
    };
    $scope.toggleEdit = function(entry) {
      if ($scope.editing === entry._id) {
        $scope.editing = false;
        $scope.copiedEntry = null;
      } else {
        $scope.editing = entry._id;
        $scope.copiedEntry = angular.copy(entry);
      }
    };
    $scope.addBioEntry = function(isValid) {
      if (isValid) {
        $http.post('/api/bio_entries', {
          title: $scope.newTab,
          content: $scope.newContent
        });
        $scope.newTab = '';
        $scope.newContent = '';
        $scope.bioForm.$setUntouched();
      }
    };
    $scope.updateBioEntry = function(entry) {
      return $http.put('/api/bio_entries/' + entry._id, {
        title: entry.title,
        content: entry.content,
        index: entry.index
      }).success(function() {
        for (var i = 0; i < $scope.bioEntries.length; i++) {
          if ($scope.bioEntries[i]._id === entry._id) {
            $scope.bioEntries[i].active = true;
          }
        }
        $scope.editing = false;
        $scope.copiedEntry = null;
      });
    };
    $scope.deleteEntry = function(id) {
      $http.delete('/api/bio_entries/' + id);
    };
    $scope.confirmDelete = Modal.confirm.delete(function(entry) {
      $scope.deleteEntry(entry._id);
    });
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('bio_entry');
    });
    var tmp = [];
    var toggleCache;
    $scope.sortableOptions = {
      update: function(e, ui) {
        tmp = [];
        angular.forEach($scope.bioEntries, function(value, key) {
          tmp.push(value.index);
          if (value.active) {
            toggleCache = value._id;
          }
        });
      },
      stop: function(e, ui) {
        var reorderedEntries = [];
        angular.forEach($scope.bioEntries, function(value, key) {
          if (tmp[key] !== value.index) {
            $http.put('/api/bio_entries/' + value._id, {
              title: value.title,
              content: value.content,
              index: tmp[key]
            });
          }
        });
        $scope.toggleEntry(toggleCache);
      }
    }
  });
