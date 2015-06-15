'use strict';

angular.module('lorenjonesApp')
  .controller('DbwCtrl', function ($scope, stellar) {
    stellar.against('body, .stellar-window, .stellar-image');
    $scope.movements = [
      {
        title: "Ohlone Song",
        subtitle: "San Francisco Bay Area's First People",
        year: "1600",
        content: "One of the things least known about San Francisco history is the story of the local Indians who lived here for thousands of years before the rest of the world invaded."
      },{
        title: "Ave Maria Yerba Buena",
        subtitle: "Mission Dolores",
        year: "1776",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Ohlone Song",
        subtitle: "San Francisco Bay Area's First People",
        year: "1600",
        content: "One of the things least known about San Francisco history is the story of the local Indians who lived here for thousands of years before the rest of the world invaded."
      },{
        title: "Ave Maria Yerba Buena",
        subtitle: "Mission Dolores",
        year: "1776",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Ave Maria Yerba Buena",
        subtitle: "Mission Dolores",
        year: "1776",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Ave Maria Yerba Buena",
        subtitle: "Mission Dolores",
        year: "1776",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Ave Maria Yerba Buena",
        subtitle: "Mission Dolores",
        year: "1776",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      }
    ];
    $scope.currentMovement = $scope.movements[0];
    $scope.changeInfo = function(content) {
      $scope.currentMovement = content;
    };
    //$scope.movement = 1;
    $scope.view_tab = "tab1";
    //$scope.changeMovement = function(tab) {
    //  $scope.movement = 0;
    //  $scope.movement = tab;
    //};
    $scope.changeTab = function(tab) {
      $scope.view_tab = tab;
    }
  });
