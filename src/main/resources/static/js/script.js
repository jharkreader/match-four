// Class names that code is swapping in & out:
//    'currentPick': to reflect selected color
//    'hoverColor_1' thru 'hoverColor_6': to control the onhover colors in the game slots
//    'bgColor_1' thru 'bgColor_6': to control the colors in the game slots
//    'currentTry': to reflect the current guess row (1 - 8, starting at bottom)
//    'blackPeg' and 'whitePeg': to color the pegs after user checks a guess
  
  
//Variables:
//  'pick' is integer 1 - 6 for color selection (1 = red, 2 = orange, etc.)
//  'guessCtr' is integer 1 - 8 for which guess attempt user is on
//    (guessCtr would be initialized to 1 & then a fcn
//    would add 'currentTry' className to the relevant guessing row (& remove from others)

// Global variables - so that Java, etc can access any of these 3 vars...
var myBestTime = -1;  // keep track of user's best time for current session in seconds
var timeSeconds = 0;  // user's total seconds for most recent game
var timeString = "";  // string that shows mins:seconds for most recent game

(function() {
  
    var guesses = 8;    // total # guesses possible
    var guessCtr = 1;   // guess level user is currently on
    var colorPick = 1;  // color user currently has selected
    var secret = [0, 0, 0, 0];  // game solution
    var curGuess = [0, 0, 0, 0];  // user's guess at current guess level
    var startTime;    

  /******************************************************************
   * EVENT LISTENERS
   ******************************************************************/
    
    // Add event listeners for color picker
    var pickers = document.getElementsByClassName("picker");

    // Loop through all colors in palette and assign click event
    Array.prototype.filter.call(pickers, function(el, i){
      el.addEventListener("click", function(){ setCurrentPicker(i + 1); });
    });    
    
    // Add event listeners for clicks on game slots
    for (var j = 1; j <= 8; j++) {
      var slots = document.getElementById("guess_" + j).getElementsByClassName("slot");

      // Loop through all slots for a specific row and assign click event
      // Note that counter i is zero based
      Array.prototype.filter.call(slots, function(el, i){
        el.addEventListener("click", function(){ setColorForSlot(i, el); });
      });
    }

    // Add event listener for new game
     document.getElementById("newGame").addEventListener("click", startGame);
  
    // Add event listener for check answer
    var checks = document.getElementById("gameBoard").getElementsByClassName("checkMark");

    // Loop through all checkmarks and assign click event
    // Note that counter i is zero based
    Array.prototype.filter.call(checks, function(el, i){
      el.addEventListener("click", function(){ checkAnswer(); });
    });    
  
  /***********************************************************************
   * FUNCTIONS CALLED BY USER EVENTS  (start new game, select color, assign color to a slot, check answer)
   **********************************************************************/
  
  
  // My notes below are only suggestions - please feel free to revise in any way
  // that makes sense to you!! - Diane
  
  // Compare user's answer to secret solution, set black/white pegs & move on to next guess
  // TBD...
  function checkAnswer() {
    var results = {};
    console.log('about to check answer and user\'s guess is:');
    console.log(curGuess);

    // If any of elements is 0, alert user that a color must be chosen for all 4 slots before checking & return
    if (curGuess.indexOf(0) !== -1) {
      alert("Oops...you need to choose a color for all four slots before checking your answer.");
      return;
    }
    
    // Otherwise:
        
    // If guessCtr = 1, record start time (millisecs)
    if (guessCtr === 1) {
      startTime = new Date().getTime();
    }

    // Remove hover color for current guess row
    removeHoverColor(guessCtr);
    
    // Call method 'compareSlots' to compare elements in 'secret' to 'curGuess' - return obj 
    // named 'results' with
    // two pieces of info: pass/fail and an array of strings for black and white pegs
    // Example: return {pass: false, pegArray: [...]}
    // where pegArray is: if no matches pass in []
    //            if two black, 0 white pass in ["blackPeg", "blackPeg"] 
    //            if two black, 1 white pass in ["blackPeg", "blackPeg", "whitePeg"] 
    //            if 4 white pass in ["whitePeg", "whitePeg", "whitePeg", "whitePeg"] 
    // if exact match return {pass: true, pegArray: ["blackPeg", "blackPeg","blackPeg", "blackPeg"]}
    results = compareSlots();
    
    // Call method 'setBlackWhitePegs' (pass in results.pegArray from above) to set background colors for 
    // the 'peg' class within the 'currentTry' section
    setBlackWhitePegs(results.pegArray);
    // just using this for testing: setBlackWhitePegs(["blackPeg", "blackPeg", "whitePeg"]);
    
    // TBD If user got correct answer, call methods to get time, give user message, etc. 
    if (results.pass) {
      // checkTimeVsBest(); // this function sets global variables related to time (myBestTime, timeSeconds, timeString)
      //
      // then some user message... to display a message or route to another pg?
      // (later - if best score, save to user's info in db.)
      alert('TBD...this is where js can send a JSON object to the backend to update the db - something like {"user":"123", "bestTime": 187} and any other info that makes updating the db easy');
      
    // TBD else if guessCtr = 8 show message for end of game
    } else if (guessCtr === 8) {
    
    // either route to another pg or call method userMsg('sorry...blah blah')
    // would be good to show the actual solution to user if we have time.
      
    // else move on to next guess:
    } else {
      resetCurGuess();
      guessCtr++;
      setCurrentTry();
      setHoverColor();
    }
  }
  
  // Add a color to a slot on gameboard (slotNum is 0 - 3)
  function setColorForSlot(slotNum, slot) {
    
    //Set color IF user's click was on the 'currentTry' guess row (ignore clicks on other guess rows)
    if (slot.parentElement.classList.contains("currentTry")) {

      // Put the current colorPick value into the selected slot for the current guess row
      curGuess[slotNum] = colorPick;

      // Call function to remove any bgColor class on the slot
      // (because user might choose a color and then change it & we don't want multiple bgColor classes on one el...)
      clearOneSlot(slot);

      // Then add class 'bgColor_1' or 'bgColor_2', etc depending on what the current colorPick value is
      slot.classList.add("bgColor_" + colorPick);
    }
  }
  
  //  Change selected color on palette. Adds the 'currentPick' classname to the selected color
  //  and removes it from any other color in the palette
  function setCurrentPicker(i) {
    var oldPicker = document.getElementById("colorPalette")
                            .getElementsByClassName("currentPick");  // generates array that should only have 1 el


    // Remove 'currentPick' class name from previously selected color
    if (oldPicker.length > 0) {
      oldPicker[0].classList.remove("currentPick");
    }
    
    // Set var to new color
    colorPick = i;
    
    // Add 'currentPick' class to newly selected color
    document.getElementById("pick_" + colorPick).classList.add("currentPick");
    
    // Call functions to remove old hoverColor & set new hoverColor class for the current guess row
    removeHoverColor(guessCtr);
    setHoverColor();
  }
    
  // Start new game
  function startGame() {  
    
    // Clear old gameboard:
    removeHoverColor(1, 8);
    resetPegs();
    clearAllSlots();
    
    // Set up new gameboard:
    guessCtr = 1;
    curGuess = [0, 0, 0, 0];
    startTime = 0;
    setSecret(); 
    setCurrentTry();
    setCurrentPicker(colorPick);  // really just needed on init
    setHoverColor();
  }

  
  /*********************************************************************************
   * OTHER HELPER FUNCTIONS (called by the main fcns above, to avoid repetition)
   ********************************************************************************/  
  
  /***** VIEW:  these fcns are related to the DOM view/display, class settings, etc.****/
  
  // Clear one slot in gameboard
  function clearOneSlot(slot) {
    
    // For 'element' remove all 'bgColor_1' thru 'bgColor_6' classes
    for (var i = 1; i <=6; i++) {
      slot.classList.remove("bgColor_" + i);
    }
  }
  
  // Clear the colors from all slots of gameboard (for a new game)
  function clearAllSlots() {
    var colorClass;
    var elementArray = document.getElementById("gameBoard").getElementsByClassName("slot");
    
    // For elementArray remove all 'bgColor_1' thru 'bgColor_6' classes
    // First loop through each color
    for (var i = 1; i <=6; i++) {
      colorClass = "bgColor_" + i;
      
      // Loop through elementArray, removing colorClass
      for (var j = 0; j < elementArray.length; j++) {
        elementArray[j].classList.remove(colorClass);
      }
    }
  }

  // Remove ALL hoverColor_ classes from one or more guess rows (for any 'pick' value)
  function removeHoverColor(startRow, endRow) {  
    var guess;
    
    // If no endRow argument passed, just use startRow as end value
    var end = (typeof endRow === "undefined") 
              ? startRow 
              : endRow;
    
    // Loop through guess rows & remove hoverColor classes
    for (var i = startRow; i <= end ; i++) {
      guess = document.getElementById('guess_' + i);
      for (var j = 1; j <=6 ; j++) {
        if (guess.classList.contains("hoverColor_" + j)) {
          guess.classList.remove("hoverColor_" + j);
        }
      }
    }
  }
  
  // Reset pegs to neutral by removing 'blackPeg' and 'whitePeg' classes from all guesses
  // Also remove title attributes which get applied when user checks their answer
  function resetPegs() {
    var pegs = document.getElementById("gameBoard")
                        .getElementsByClassName("peg");
    
    for (var i = 0; i < pegs.length ; i++) {

      // Probably best to first check if it contains the class - otherwise not necessary to remove
      pegs[i].classList.remove("blackPeg");
      pegs[i].classList.remove("whitePeg");
      pegs[i].setAttribute("title", "");
    }
  }

  // Set pegs black and/or white for current guess
  // Pass in array with up to four strings for black/white pegs
  // Examples: if no matches pass in []
  //            if two black, 0 white pass in ["blackPeg", "blackPeg"] 
  //            if two black, 1 white pass in ["blackPeg", "blackPeg", "whitePeg"] 
  //            if 4 white pass in ["whitePeg", "whitePeg", "whitePeg", "whitePeg"] 
  function setBlackWhitePegs(pegArray) {
    var title = "";
    var pegs = document.getElementsByClassName("currentTry")[0]
                      .getElementsByClassName("peg");
    
    for (var i = 0 ; i < pegArray.length ; i++) {
      pegs[i].classList.add(pegArray[i]);
      title = (pegArray[i] === "blackPeg")
            ? "a color is in the right slot"
            : ((pegArray[i] === "whitePeg")
                ? "a color is part of the answer, but in the wrong slot"
                : "");
      pegs[i].setAttribute("title", title);
    }    
  }
      
  //  Adds the 'currentTry' classname to 
  // that current guess row and removes it from the other guess rows
  function setCurrentTry() {    
    var allGuessRows = document.getElementsByClassName('guess');
    
    // Loop through all guess rows and remove 'currentTry' class
    Array.prototype.filter.call(allGuessRows, function(el){
      if (el.classList.contains("currentTry")) {
        el.classList.remove("currentTry");
      }
    });
    
    // Assign 'currentTry' class to current guess row
    document.getElementById("guess_" + guessCtr).classList.add("currentTry");
  }
  
  
  // Set hover color for the current guess row
  function setHoverColor() {
    var liveGuess = document.getElementById("guess_" + guessCtr);

    // Add new hoverColor class for current color to the current guess row
    liveGuess.classList.add("hoverColor_" + colorPick);
  }
  
  // Display a message (or instead of this, routing to another page...)
  function userMsg(message) {
    // TBD
  }
  
  
  
  /***** MODEL: these are related to the game logic, calcs, comparisons, etc.****/

  // Get time for most recent game, compare to user's best time
  // Sets 3 GLOBAL variables for java to use as needed (timeSeconds, myBestTime and timeString)
  // TBD: this could set (or return) a more complete message if that's helpful - like
  // "Nice job! You finished in 3 minutes, 23 seconds." 
  // and/or "Congrats! You got your best time today: 3 minutes, 23 seconds."
  function checkTimeVsBest() {
    var endTime = new Date().getTime();
    var mins;
    var seconds;

    timeSeconds = (endTime - startTime) / 1000;
    mins = Math.floor(timeSeconds/60);
    seconds = Math.round(timeSeconds % 60);

    // Compare time to best time & reset if user improved (best is initialized to -1)
    if ((myBestTime === -1) || (timeSeconds < myBestTime)) {
      myBestTime = timeSeconds;
    }

    // Create readable string that shows minutes & seconds - for use in a user msg
    timeString = mins + 
                (mins === 1 ? " minute, " : " minutes, ") + 
                seconds + 
                (seconds === 1 ? " second." : " seconds.");
  }

  // Compare secret to curGuess and return obj or array with #black & # white
  // Note to Jenn - we could just return the pegArray part we discussed
  // but if you also return pass/fail info it will be a bit easier to
  // use this result in checkAnswer method
  function compareSlots() {
    var isCorrect = false;
    var pegArray = [];
    
    // TBD - 
    
    return {pass: isCorrect, pegArray: pegArray};
  }

  // Generate a random number between 1 & 6
  function getRandom() {
    var ran = Math.random();
    return Math.ceil(ran * 6);
  }

  // Reset guess array to all zero
  function resetCurGuess() {
    curGuess = [0, 0, 0, 0];
  }
  
  // Randomly assign 4 integers to 'secret' array ( 1 = red, etc.)
  // Note: showing 3 JS options here for putting random #s into array...
  function setSecret() {
    
    for (var i = 0 ; i < 4 ; i++) {
      secret[i] = getRandom();
    }

//   or you can use the Array object's built-in 'map' method (with arrow function which is new in ES6):
//      secret = secret.map(el => getRandom());
    
    
    console.log('just set secret solution to:');
    console.log(secret);
  }    

  startGame();
})();



