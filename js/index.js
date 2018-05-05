$(document).ready(function() {
  //default game object. tracks the current move, pc moves, user moves, and a seperate tracker to match up with array positions. 
    
    var game = {
      count: 0,
      roundClicks: -1,
      colors: ['green', 'red', 'yellow', 'blue'],
      user: [],
      pc: [], 
      randomColors: [],
      clicked: function(input) {
        game.sound[input].play();
        game.user.push(input);
        game.roundClicks++;
        $('#'+input).css('background-color', input);
        $('#'+input).mouseup(function() {
          $('#'+input).css('background-color', '');
        });
      },
      twentyColors: function() {
        for (i = 0; i < 21; i ++) {
          var randomNumber = Math.floor(Math.random() * 4);
          game.randomColors.push(game.colors[randomNumber]);
        }
      },
      moves: '',
      gameIsOn: false,
      gameIsStarted: false,
      strictModeOn: false,
      userTurn: false,
      clear: false,
      sound: {
        green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'), 
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'), 
        yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'), 
        blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
      }
    }
  //clears the game. Will be used when game is switched on and off.  
    function clearAll() {
      clearInterval(game.moves);
      game.count = 0;
      game.roundClicks = -1;
      game.randomColors = [];
      game.user = [];
      game.pc = []; 
      game.strictModeOn = false;
      game.gameIsOn = false;
      game.gameIsStarted = false;
      game.userTurn = false;
      $('#count').html('--');
      $('#count').css('color', '');
      $('#on-switch').html('OFF');
      $('#strict').css('background-color', '');
      $('.flexParent div').css('background-color', '');
    }
    
  //restarts game if strict mode is on, or hits the start button after the game has began. 
    function restart() {
      $('#count').html('--');
      clearInterval(game.moves);
      if (game.count === 20) {
        $('#count').html('W');
      } else {
        $('#count').html('!!');
      }     
      game.userTurn = false;
      game.count = 0;
      game.roundClicks = -1;
      game.pc = [];
      game.user = [];
      game.count++;
      game.randomColors = [];
      game.twentyColors();
    }
    
  //Switches between on and off. Clears on off. generates 20 random pc moves. 
    $('#on-switch').click(function() {
      if (game.gameIsOn === false) {
        game.twentyColors();
        game.gameIsOn = true;
        $(this).html('ON');
        $('#count').css('color', 'red');
      } else {
          $(this).html('OFF'); 
          game.gameIsOn = false;
          clearAll();
      }
    });
    
  //enables strict mode
    $('#strict').click(function() {
      if (game.strictModeOn === false && game.gameIsOn === true) {
        $(this).css('background-color', 'red');
        game.strictModeOn = true;
      } else {
          $(this).css('background-color', '');
          game.strictModeOn = false;
      }
    });
  
  //the pc will repeat it's previous move up to the current game count for each round.
    function pcMove() {
      game.userTurn = false;
      var i = 0;   
  
      game.moves = setInterval(function() {    
        i++; 
        $('#'+game.randomColors[i]).css('background', game.randomColors[i]);
        
        game.sound[game.randomColors[i]].play();
        setTimeout(function() {
          $('#'+game.randomColors[i]).css('background','');
          if (game.randomColors[i] !== undefined) {
            game.pc.push(game.randomColors[i]);
            console.log(game.pc);
          }
        }, 500);
  
        if (i === game.count) {
          clearInterval(game.moves);
          game.userTurn = true; 
        }
      }, 1000);
      
      setTimeout(function() {
        $('#count').html(game.count);
      }, 1000);
    }
    
  //tracks the user move against the current move and pc moves. If the current user move does not match the current pc move, then the round restarts. if the lengths are equal then all the values are equal and the next round will begin.  
    function userMove() {
      var click = game.roundClicks;
      
      if (game.user[click] !== game.pc[click]) {
        if (!game.strictModeOn) {
          $('#count').html('!!');
          game.roundClicks = -1;
          game.user = [];
          game.pc = [];
          pcMove();
        } else {
            restart();
            pcMove();
        }
      }
      
      if (game.user.length === game.pc.length && game.user.length !== 0) {
        if (game.count < 20) {
          game.roundClicks = -1;
          game.user = [];
          game.pc = [];
          game.count++;
          pcMove();
        }
        else if (game.count === 20) {
          restart();
          pcMove();       
        }
      } 
    }
    
  //starts game on click if the game is turned on.  
    $('#start-circle').click(function() {
      if (game.gameIsOn === true && game.gameIsStarted === false) {
        game.count++;
        game.gameIsStarted = true;
        pcMove();
      }
      else if (game.gameIsOn && game.gameIsStarted) {
        $('.flexParent div').css('background-color', '');
        restart();
        pcMove();
      }
    });
    
  //clicked button will light up, and store its values in an array to track if it matches pc moves.
    $('.flexParent div').mousedown(function() {
      if (game.gameIsStarted === true && game.userTurn) {
        var $color = $(this).attr('id');
        game.clicked($color);
        userMove();
      }
    });
    
    
    
  });