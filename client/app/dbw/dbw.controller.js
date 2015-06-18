'use strict';

angular.module('lorenjonesApp')
  .controller('DbwCtrl', function ($scope, stellar) {
    stellar.against('body, .stellar-window, .stellar-image');
    $scope.movements = [
      {
        title: "Ohlone Song",
        subtitle: "San Francisco Bay Area's first people",
        year: "1600",
        content: "One of the things least known about San Francisco history is the story of the local Indians who lived here for thousands of years before the rest of the world invaded. There were approximately 10,000 Native Americans in the area, consisting of over forty tribelets of 150 to 200 people, speaking dozens of separate languages, living in relative harmony in the San Francisco Bay Area, from Sonoma to Monterey. The Ohlone were renowned for their crafts, especially basket-weaving. Ohlone songs were often accompanied by clapper sticks, shell shakers, bone whistles, and flutes. This movement was inspired by their traditional vocal songs, though I've taken the liberty of using a Native American flute and frame drum. The Yelamu were the original people of San Francisco. The villages of Sitlintac and Chutchui were located in the valley of Mission Creek, near what is now Mission Dolores. The Amuctac and Tubsinte were established in the Visitation Valley area to the south, and the village of Petlanuc was located in what is now the Presidio."
      },{
        title: "Ave Maria Yerba Buena",
        subtitle: "Mission Dolores",
        year: "1776",
        content: "In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores. The missions represented the first major effort by Europeans to colonize the Pacific Coast regions, and gave Spain a valuable toehold in California. The Spanish occupation of California also brought with it serious negative consequences for the Native American populations with whom the missionaries came in contact. The government of Mexico shut down the missions in the 1830's. In the end, the mission had mixed results in its objective to convert, educate and 'civilize' the indigenous population and transform the natives into Spanish colonial citizens. Today, the missions are among the state's oldest structures and the most-visited historic monuments. One of the positive things that the missionaries and first settlers brought to the new world was their music. This melody is based on an anonymous song sung at down in the Mission praising the Virgin Mary."
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
        content: "The finale briefly revisits several of the earlier movements, leading to the closing choral piece, 'The City by the Sea,' from a poem by George Sterling (1869 - 1926). In his day, George Sterling was celebrated in Northern California as one of the great American poets, although he never gained much fame in the rest of the United States. Sterling was a significant figure in Bohemian literary circles in nothern California in the first quarter of the 20th century, and was a leader in gthe development of the artists' colongy in Carmel. Like the cliffs at Ocean Beach, this poem has been washed away by time and forgotten, but it's still as relevant as ever: 'At the end of our streets, the stars.'"
      }
    ];
    $scope.currentMovement = $scope.movements[0];
    $scope.changeInfo = function(content) {
      $scope.currentMovement = content;
    };
  });
