'use strict';

angular.module('lorenjonesApp')
  .controller('DbwCtrl', function ($scope, parallaxHelper, works, $window, soundcloud) {
    var introSpeed = -0.5;
    $scope.background = parallaxHelper.createAnimator(-0.3);
    $scope.fastBackground = parallaxHelper.createAnimator(-0.8);
    $scope.titleBackground = parallaxHelper.createAnimator(introSpeed);
    $scope.fadeOut = function(elementPosition) {
      var height = $window.innerHeight;
      var pos = elementPosition.elemY;
      if (pos < (-0.66 * height) || pos > 0) { return; }
      var percent = (-1 * pos) / height;
      var opacity = Math.pow(Math.cos(3.14 * percent / 2), 2);
      return opacity;
    };
    $scope.fadeInOut = function(elementPosition) {
      var offset;
      var opacity;
      var width = $window.innerWidth;
      if (width <= 480) {
        offset = 60;
      } else if (width <= 992) {
        offset = 120;
      } else {
        offset = 160;
      }
      var pos = (1 - (elementPosition.elemY + offset) / $window.innerHeight);
      if (pos < 0 || pos > 1) {
        opacity = 0;
        return opacity;
      }
      opacity = Math.pow(Math.sin(3.14 * pos), 2);
      return opacity;
    };
    $scope.videoUrl = 'https://www.youtube.com/watch?v=CCwB4TRJUgc';
    $scope.dbwMovements = works.dbwMovements;
    $scope.movements = [
      {
        movement: 1,
        title: '1. Ohlone Song*',
        subtitle: 'San Francisco Bay Area\'s first people',
        year: '1600',
        content: 'One of the things least known about San Francisco history is the story of the local Indians who lived here for thousands of years before the rest of the world invaded. There were approximately 10,000 Native Americans in the area, consisting of over forty tribelets of 150 to 200 people, speaking dozens of separate languages, living in relative harmony in the San Francisco Bay Area, from Sonoma to Monterey. The Ohlone were renowned for their crafts, especially basket-weaving. Ohlone songs were often accompanied by clapper sticks, shell shakers, bone whistles, and flutes. This movement was inspired by their traditional vocal songs, though I\'ve taken the liberty of using a Native American flute and frame drum. The Yelamu were the original people of San Francisco. The villages of Sitlintac and Chutchui were located in the valley of Mission Creek, near what is now Mission Dolores. The Amuctac and Tubsinte were established in the Visitation Valley area to the south, and the village of Petlanuc was located in what is now the Presidio.'
      },{
        movement: 2,
        title: '2. Ave Maria Yerba Buena',
        subtitle: 'Mission Dolores',
        year: '1776',
        content: 'In 1776, the Spanish established the Presidio and the settlement named Yerba Buena, followed by Mission San Francisco de Assis, later known as the Mission Dolores. The missions represented the first major effort by Europeans to colonize the Pacific Coast regions, and gave Spain a valuable toehold in California. The Spanish occupation of California also brought with it serious negative consequences for the Native American populations with whom the missionaries came in contact. The government of Mexico shut down the missions in the 1830\'s. In the end, the mission had mixed results in its objective to convert, educate and \"civilize\" the indigenous population and transform the natives into Spanish colonial citizens. Today, the missions are among the state\'s oldest structures and the most-visited historic monuments. One of the positive things that the missionaries and first settlers brought to the new world was their music. This melody is based on an anonymous song sung at down in the Mission praising the Virgin Mary.'
      },{
        movement: 3,
        title: '3. Gold Rush',
        subtitle: 'San Francisco becomes a city',
        year: '1849',
        content: 'The Spanish settlement of San Francisco was originally called Yerba Buena. The bay, however, was known as San Francisco Bay. In 1846, the US took possession of California and promptly changed the name of the settlement from Yerba Buena to San Francisco. In the begginning of 1849, the village that had become San Francisco was home to 700 people. Within a year, the gold rush had brought the population up to 40,000. Dreamers, adventurers, the hopeful, the rich, the poor, the honest, and the crooked poured into the city from all over the world in search of riches. From 1849 to 1851, new arrivals by sea were greeted by a graveyard of hundreds of sailing ships in San Francisco harbor. They had all been abandoned by their crews as every man had jumped ship in search of gold. Some were converted into make-shift hotels or brothels, but most were just left to rot. It\'s a strange image, a harbor of abandoned ships. The common music of this period included banjo, fiddle, and guitar.'
      },{
        movement: 4,
        title: '4. Dragon Gate*',
        subtitle: 'Chinatown',
        year: '1850\'s',
        content: 'The building boom throughout the West had brought thousands of Chinese laborers to San Francisco, and Chinatown became the largest Chinese settlement in the United States, a city within a city, China in the middle of San Francisco. The entrance to Chinatown was named Dragon Gate. Since its establishment in 1848, it has been highly important and influential in the history and culture of ethnic Chinese immigrants to the United States and North America. Chinatown is an active enclave that continues to retain its own customs, languages, places of worship, social clubs, and identity. It has developed its own government, traditions, over 300 restaurants, and as many shops. There are two hospitals, numerous parks and squares, a post office, herbal shops, temples, pagoda roofs and dragon parades. In addition to being a starting point and home for thousands of Chinese immigrants, it is also a major tourist attraction, drawing more visitors annually than the Golden Gate Bridge. The two instruments featured here are the erhu and the pipa. Comparable slightly to the western violin, the erhu has a beautiful sound that is very Eastern and completely unique. The pipa is similar to a lute.'
      },{
        movement: 5,
        title: '5. Barbary Coast March',
        subtitle: 'Waterfront',
        year: '1860\'s',
        content: 'My uncle owned an antique organ grinder from a place called the Barbary Coast Salloon. It had wooden spoke wheels and a maple box that contained over ten musical instruments activated by a hand-cranked piano roll. The sounds and melodies that came out of it were over 150 years old. Yerba Beuna Cove, later called the Barbary Coast, extended from where the Bay Bridge is now, to Nob Hill. The graveyard of gold-rush ships is buried beneath that part of the city. This melody reminiscent of my uncle\'s organ grinder, was the result of listening to dozens of Civil War era tunes, and it is more reflective of the upbeat story of those lucky men and women who didn\'t get kidnapped or murdered in the wild coastal boomtown of early San Francisco.'
      },{
        movement: 6,
        title: '6. Mid-Winter Exposition',
        subtitle: 'West Coast\'s first World\'s Fair',
        year: '1894',
        content: 'The California Midwinter International Exposition, held in what was to become Golden Gate Park in 1894, was the first World\'s Fair west of the Mississippi River. The fair celebrated a town that, in less than 50 years, had gone from a village of fewer than 250 people, to a city that had become the commercial, financial, and social capital of the West Coast. The fair took place in the area that the De Young Museum and the California Academy of Sciences now occupy. The Japanese Tea Garden was one of the original exhibits from the Midwinter Exposition. The music here is representative of the popular waltzes of the period.'
      },{
        movement: 7,
        title: '7. The Outside Lands*',
        subtitle: 'Golden Gate Park',
        year: '1870 - 1900',
        content: 'West of the new city was a desolate windswept world of sand dunes called the Outside Lands. In 1870, William Hammond Hall began a project that most people thought was impossible: turning this vast wasteland into a park. In 1887, a landscape gardener from Scotland named John McLaren began his 56-year career as the superintendent of Golden Gate Park. His father told him, \"Me boy, if yea have nothing to do, go plant a tree and it\'ll grow while yea sleep.\" In his lifetime, he personally planted over two million trees, many of them in Golden Gate Park. Today, the park covers over a thousand acres. It\'s about three miles long, a half-mile wide, and has over one million trees, many lakes, streams, waterfalls and a small mountain. It\'s one of the largest man-made city parks in the world. Over the years, I\'ve spent a lot of time in the park. It was very important for me to create music that really captured not only its history, but also my own feelings, as this is the first movement that\'s based partly on my own personal experiences. In honor of John McLaren, I used a bit of a Celtic melody by the Irish Harper Turlough O\'Carolan (1670 - 1738). The rest is influenced by both British and American orchestral music.'
      },{
        movement: 8,
        title: '8. Earthquake & Fire',
        subtitle: 'The city dies and is reborn',
        year: '1906',
        content: 'Just after 5:00 a.m. on April 18, 1906, San Francisco was devastated by a major earthquake, and then ravaged by a great fire that burned for four days. Over 3,000 people lost their lives. A quote from an Oakland paper read: \"After darkness, thousands of the homeless were making their way with their blankets and scant provisions to Golden Gate Park and the beach to find shlter. Everbody in San Francisco is prepared to leave the city, for the belief is firm that San Francisco will be totally destroyed.\" Influenced by hundred of photographs, life stories, and letters written during this period, this movement was created during the earthquake\'s one hundred year anniversary. The movement begins with the clock striking 5:00 a.m. then uses percussion and effects to create the quake and its aftermanth.'
      },{
        movement: 9,
        title: '9. Playland*',
        subtitle: 'San Francisco\'s seaside amusement park',
        year: '1920\'s',
        content: 'As early as 1884, there was a roller coaster at Ocean Beach, but Playland-at-the-Beach really began in 1928. At the entrance to Playland, \"Laughing Sal\" was the mechanical laughing lunatic who greeted visitors to the Crazy House, later called the Fun House. It included the world\'s greatest mirror maze, saved from the Midwinter Exposition. High above the moving sidewalks, shooting air holes, and staggering staircases, loomed a 200-foot, six-lane slide of polished hardwood, the largest indoor slide in the world. There was a great roller coaster, a scary, haunted house, dark ride, a diving bell, bumper cars, many other rides, and hundreds of concessions and minor amusements. A carnival atmosphere prevailed at this cousin of Coney Island. At night, the place glowed with thousands of glittering lights, creating a \"fairly-like effect.\" In the 1960\'s, it began to run down, and developed a rather sleazy, ominous atmosphere; however, it still retained much of the magic and joy of an earlier era. Sadlly, Playland was demolished in 1972 and replaced by condominiums. The sounds of Ocean Beach and Laughing Sal begin this movement, followed by a melody that\'s reminiscent of a merry-go-round. Laughing Sal and many of Playland\'s original player pianos and other wonderful curios can still be experienced at the Musée Mecanique at Fisherman\'s Wharf.'
      },{
        movement: 10,
        title: '10. Golden Gate Bridge',
        subtitle: 'The world\'s greatest bridge',
        year: '1930\'s',
        content: 'The Golden Gate Bridge was completed after much controversy, and more than four years of construction at a cost of 35 million dollars. It opened on May 28,1937, ahead of schedule and under budget, when President Franklin D. Roosevelt pressed a telegraph key in the White House announcing the event. The bridge\'s 4,200 - foot long main suspension span was a world record that stood for 27 years. On opening day my father was the first motorcycle rider to cross the bridge, and 50 years later, in his 80\'s, he led the 1987 anniversary parade, once again on a motorcycle. The Golden Gate Bridge is a work of art, as well as one of the world\'s great modern architectural masterpieces. The music here reflects not only the grandeur of the completed bridge, but also it’s construction.'
      },{
        movement: 11,
        title: '11. North Beach',
        subtitle: 'Little Italy and The Beats',
        year: '1950\'s',
        content: 'Along with Chinatown and the Barbary Coast, this was one of the original neighborhoods of San Francisco. For more than a century, North Beach has been a predominantly Italian neighborhood. The Beatnik era of the 1950\'s drew poets and artists here from around the world. When I was a kid, my parents would frequently take me out to dinner to one of their favorite Italian North Beach restaurants. I loved the narrow streets, the steep hills around Coit Tower, the Beat scene, and a girl who worked in an art store who looked like she was from the \"Addam\'s Family\" When I grew up, I wanted to be a Beatnik. Today, North Beach is still the Little Italy of the West Coast, as well as a home for young and old Beaniks and Hipsters. This begins with an accordion playing an Italian tune, followed by a bongo/bass riff, and finished with a jazz sextet.'
      },{
        movement: 12,
        title: '12. Haight Ashbury',
        subtitle: 'The hippies',
        year: '1960\'s',
        content: 'What is now the Haight Ashbury was originally a collection of isolated farms and acres of sand dunes. In 1897, the new Haight Street cable car line connected the west end of Golden Gate Park with the Market Street Line, and the area became a residential distric. It was one of the few neighborhoods spared from the fires that followed the earthquake of 1906. The Haight Ashbury became a haven for hippies during the 1960\'s because of the availability of cheap and vacant properties for rent or sale in the district. The Haight was home to a number of pioneering psychedelic rock groups and performers of that period. No one has yet been able to truly capture the emotions, hopes, dreams, power, magic, or the tragedy of that elusive moment in time. History holds only a faded, and often inaccurate memory, but it was the beginning of a new era for San Francisco and the whole countery. The innocence and naivety of the first half of the century was ending, and the rebelliousness and struggles of youth, combined with the arts, Eastern philosophy, political activism, and psychedelics created a worldwide movement, with the Haight being its epicenter. I lived in the Haight during the later 1960\'s, and it was an amazing time. This movement is based on local music from the period, as well as memories of being there. Yes, I was there, and yes, I remember.'
      },{
        movement: 13,
        title: '13. The Castro*',
        year: 'The Gay 1970\'s',
        content: 'Castro Street was named for José Castro, governor of Alta California from 1835-1836. The neighborhood became known as the Castro, named after the landmark theater near the corner of Castro and Market Streets. In the 1950\'s, what was once a thriving residential district, was slowly abandoned as people moved to the suburbs and the Victorians and business became vacant. It came of age as a gay center following the controversial Summer of Love in the neighboring Haight Ashubry district in 1967. The activism of the \'60\'s and \'70\'s forged a community with sizable political and economic power. The assassination in 1978 of openly gay San Francisco Supervisor Harvey Milk and Mayor George Moscone, and the tragedy of AIDS, was a turning point in the community\'s history. The Castro became not just open, but celebratory about its thriving gay and lesbian population. Once again, a San Francisco neighborhood was on of the first places in the country where a new lifestyle was accepted and grew.'
      },{
        movement: 14,
        title: '14. The City by the Sea*',
        year: 'Now - Beyond',
        content: 'The finale briefly revisits several of the earlier movements, leading to the closing choral piece, \"The City by the Sea,\" from a poem by George Sterling (1869 - 1926). In his day, George Sterling was celebrated in Northern California as one of the great American poets, although he never gained much fame in the rest of the United States. Sterling was a significant figure in Bohemian literary circles in nothern California in the first quarter of the 20th century, and was a leader in the development of the artists\' colony in Carmel. Like the cliffs at Ocean Beach, this poem has been washed away by time and forgotten, but it\'s still as relevant as ever: \"At the end of our streets, the stars.\"'
      }
    ];
    $scope.currentMovement = $scope.movements[0];
    $scope.changeInfo = function(content) {
      $scope.currentMovement = content;
    };
    $scope.$on('youtube.player.playing', function($event, player) {
      console.log('playing');
      soundcloud.player.pause();
    });
  });
