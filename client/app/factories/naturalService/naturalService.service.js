'use strict';

angular.module('lorenjonesApp')
  .factory('naturalService', function () {
    var padding = function(value) {
      return "00000000000000000000".slice(value.length);
    },
    toString = function(value) {
      if(value === null || value === undefined) return '';
      return ''+value;
    },
    natValue = function(value) {
      return toString(value).replace(/(\d+)((\.\d+)+)?/g, function ($0, integer, decimal, $3) {
        if (decimal !== $3) {
          return $0.replace(/(\d+)/g, function ($d) {
            return padding($d) + $d;
          });
        } else {
          decimal = decimal || ".0";
          return padding(integer) + integer + decimal + padding(decimal);
        }
      });
    };
    return {
      naturalValue: natValue,
      naturalSort: function(a, b) {
        a = natValue(a);
        b = natValue(b);
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
      }
    };
  });
