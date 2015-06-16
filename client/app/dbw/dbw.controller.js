'use strict';

angular.module('lorenjonesApp')
  .controller('DbwCtrl', function ($scope, stellar) {
    stellar.against('body, .stellar-window, .stellar-image');
    $scope.movements = [
      {
        title: "Ohlone Song",
        subtitle: "San Francisco Bay Area's first people",
        year: "1600",
        content: "One of the things least known about San Francisco history is the story of the local Indians who lived here for thousands of years before the rest of the world invaded."
      },{
        title: "Ave Maria Yerba Buena",
        subtitle: "Mission Dolores",
        year: "1776",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Gold Rush",
        subtitle: "San Francisco becomes a city",
        year: "1849",
        content: "One of the things least known about San Francisco history is the story of the local Indians who lived here for thousands of years before the rest of the world invaded."
      },{
        title: "Dragon Gate",
        subtitle: "Chinatown",
        year: "1850's",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Barbary Coast March",
        subtitle: "Waterfront",
        year: "1860's",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Mid-Winter Exposition",
        subtitle: "West Coast's first World's Fair",
        year: "1894",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "The Outside Lands",
        subtitle: "Golden Gate Park",
        year: "1900",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Earthquake & Fire",
        subtitle: "The city dies and is reborn",
        year: "1906",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Playland",
        subtitle: "San Francisco's seaside amusement park",
        year: "1920's",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Golden Gate Bridge",
        subtitle: "The world's greatest bridge",
        year: "1930's",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "North Beach",
        subtitle: "Little Italy and The Beats",
        year: "1950's",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "Haight Ashbury",
        subtitle: "The hippies",
        year: "1960's",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "The Castro",
        subtitle: "Gay liberation",
        year: "1970's",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      },{
        title: "The City by the Sea",
        subtitle: "Beyond",
        year: "Now",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores."
      }
    ];
    $scope.currentMovement = $scope.movements[0];
    $scope.changeInfo = function(content) {
      $scope.currentMovement = content;
    };
  });
