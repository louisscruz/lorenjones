'use strict';

angular.module('lorenjonesApp')
  .directive('clickOutside', ['$document', '$parse', function ($document, $parse) {
    return {
      restrict: 'A',
      link: function ($scope, element, attr, controller) {
        var clickFunction = $parse(attr['clickOutside']);
        var documentClickHandler = function(e) {
          var eventOutsideTarget = (element[0] !== event.target) && (0 === element.find(event.target).length);
          if (eventOutsideTarget) {
            $scope.$apply(function() {
              return clickFunction($scope, {});
            });
          }
        };
        $document.on('click', documentClickHandler);
        $scope.$on('$destroy', function() {
          $document.off('click', documentClickHandler);
        });
      }
    };
  }]);
