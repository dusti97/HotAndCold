
function Game () {

  // privates 
  var HOT = 25;
  var MAX = 100; 
  // var COLORS = ['#FF0000','#F4000A','#EA0014','#E0001E','#D60028','#CC0033','#C1003D','#B70047','#AD0051','#A3005B','#990066','#8E0070','#84007A','#7A0084','#70008E','#660099','#5B00A3','#5100AD','#4700B7','#3D00C1','#3200CC','#2800D6','#1E00E0','#1400EA','#1400EA','#0000FF'];
  // var COLORS = ['#D2322D','#CD3734','#C83D3B','#C34342','#BE4849','#BA4E50','#B55457','#B0595E','#AB5F65','#A7656C','#A26A73','#9D707A','#987681','#947B89','#8F8190','#8A8797','#858C9E','#8192A5','#7C98AC','#779DB3','#72A3BA','#6EA9C1','#69AEC8','#64B4CF','#5FBAD6','#5BC0DE'];
  var COLORS = ['#D2322D','#C6403E','#BA4E50','#AE5C62','#A26A73','#967985','#8A8797','#7E95A8','#72A3BA','#66B1CC','#5BC0DE']

  var COLD_MSGS   = ["Nice first guess, but you're still way off",
                     "Wake me up when you get any closer",
                     "I heard the weather is quite lovely in the South Pole"];

  var HOT_MSGS    = ["Close, very very close",
                     "Not bad for a first try",
                     "If you got any hotter I would suggest you buy the lottery"];

  var COLDER_MSGS = ["With the way you're going, I'd reckon you as a winter person",
                     "It just got a bit chillier",
                     "You're getting colder", 
                     "You feel that breeze?"];

  var HOTTER_MSGS = ["Another step towards hotness",
                     "You're getting hotter",
                     "You just went from very warm to ver very warm", 
                     "Hello sunshine! Warmth for everybody"];

  var CONGRATS    = ["You're quite good at this. Want to go at it again?", 
                     "How did you read my mind?", 
                     "You got it! Shall we go again?"];

  // publics 
  this.target_num = null; 
  this.last_num = null; 

  // initializer 
  this.init = function () {
    $('#message').html("Pick a number between 1 to " + MAX);
    $('input').val('');  
    $('input').prop('disabled', false); 

    $('#current').height('100px');
    $('#current').width('100px');
    $('#current').css('background-color','#555');

    // get a new target num for the game
    this.target_num = this.generate_random_number(MAX)
  }

  // generate a random number from 1 to argument 
  this.generate_random_number = function ( max_num ) {
    return 1 + Math.floor(Math.random() * max_num );
  }

  // set background color according to diff 
  this.animate_box = function ( diff ) {
    var each_step = ( 100 / COLORS.length ); 
    var this_step = Math.floor(diff / each_step);

    // change the color
    $('#current').css('background-color',COLORS[this_step]);

    var new_percentage = 100 - diff 
    var new_diameter = new_percentage / 100 * 500 + 100; 

    // calculate a percentage for the frame
    $('#current').height( new_diameter + 'px');
    $('#current').width( new_diameter + 'px');
  }

  // pick a random message 
  this.pick_message = function ( array ) {
    var random = Math.floor(Math.random() * array.length)
    return array[random];
  }


  // check for valid input, between 1 to 100  
  this.valid_input = function (input) {
    if ( isNaN(input ) )  {
      $('#message').html("Please enter a Number");
      $('#message').effect('shake');
      return false; 
    } else if ( input < 1 || input > MAX ) {
      $('#message').html("Please enter a Number between 1 to " + MAX);
      $('#message').effect('shake');      
      return false;
    }

    return true; 
  }

  // private function 
  this.update_message = function ( message ) {
    $('#message').html(message);
    $('#message').hide().delay(250).fadeIn(125);
  }

  // differeng game states 
  this.game_won = function () {
    this.update_message(this.pick_message(CONGRATS));

    $("input").prop('disabled', true);

    $('#current').css('background-color','#23B94D');    
    $('#current').height('600px');
    $('#current').width('600px');
  }

  this.game_hotter = function () {
    this.update_message(this.pick_message(HOTTER_MSGS));    
  }

  this.game_colder = function () {
    this.update_message(this.pick_message(COLDER_MSGS));    
  }

  this.game_cold = function () {
    this.update_message(this.pick_message(COLD_MSGS));    
  }

  this.game_hot = function () {
    this.update_message(this.pick_message(HOT_MSGS));    
  }

  // test a number, sent to correct game state
  this.test_number = function (testing_num) {

    // do the real work 
    var current_diff = Math.abs(this.target_num - testing_num); 

    // guessed correclty 
    if ( current_diff === 0 ) {

      this.game_won();

    } else {

      // set a background 
      this.animate_box(current_diff);

      if ( this.last_num !== null ) {
        // has a previous guess 
        var last_diff = Math.abs(this.target_num - this.last_num);

        if ( current_diff < last_diff ) {
          this.game_hotter();
        } else {
          this.game_colder();
        }

      } else {
        // no previous guess
        if ( current_diff < HOT ) {
          this.game_hot();
        } else {
          this.game_cold();
        }
      }
    }

    // save this for next interation 
    this.last_num = testing_num; 

  }

  // call initializer
  this.init(); 

}

$(document).ready( function(){

  var this_game = new Game(); 

  $('input').focus();

  // make sure it's always focused on input
  $(this).click( function() {
    $('input').focus();
  });

  // reset the game
  $('button').click( function () {
    this_game = new Game(); 
  });

  // when enter is pressed, test the input
  $(this).keydown( function (e) {
    if ( e.keyCode === 13 ) {
      var new_num = $('input').val();

      if ( this_game.valid_input(new_num) ) {
        this_game.test_number(new_num);
      }
    }
  });

})