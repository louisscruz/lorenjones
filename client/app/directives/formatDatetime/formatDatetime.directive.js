'use strict';

angular.module('lorenjonesApp')
  .directive('formatDatetime', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        if (!attrs.formatDatetime) {
          throw ('formatDatetime must specify a date format');
        }
        var validateFn = function (viewValue) {
          var result = viewValue;
          if (viewValue) {
            var momentValue = moment(String(viewValue), 'M/D/YY h:mma');
            if (momentValue.isValid()) {
              controller.$setValidity(attrs.ngModel, true);
              result = momentValue.format();
            } else {
              controller.$setValidity(attrs.ngModel, false);
            }
          }
          return result;
        };
        var formatFn = function (modelValue) {
          var result = modelValue;
          if (modelValue && moment(modelValue).isValid()) {
            result = moment(modelValue).format(attrs.formatDatetime);
          }
          return result;
        };
        controller.$parsers.unshift(validateFn);
        controller.$formatters.push(formatFn);
        element.bind('blur', function() {
          var viewValue = controller.$modelValue;
          angular.forEach(controller.$formatters, function(formatter) {
            viewValue = formatter(viewValue);
          });
          controller.$viewValue = viewValue;
          controller.$render();
        });
      }
    };
  });
