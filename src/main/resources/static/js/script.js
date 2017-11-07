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
// TBD: ideally initialize myBestTime to -1. (not sure how to get ajax call to return -1 if not logged in...)
var myBestTime = 0;  // keep track of user's best time for current session in seconds
var timeSeconds = 0;  // user's total seconds for most recent game
var timeString = "";  // string that shows mins:seconds for most recent game


(function() {

    var guesses = 8;    // total # guesses possible
    var guessCtr = 1;   // guess level user is currently on
    var colorPick = 1;  // color user currently has selected
    var secret = [0, 0, 0, 0];  // game solution
    var curGuess = [0, 0, 0, 0];  // user's guess at current guess level
    var allowDuplicates = false;
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

    // Add event listeners for 'next game' icon that appears only when a game is over
    // This is equivalent to choosing 'New Game' from main menu which is always available
    var nextGameIcons = document.getElementsByClassName("nextGame");

    // Loop through all 'nextGame' icons in gameboard and assign click event
    // TBD I think there's a bit shorter way since we don't need to pass in el & i here
    Array.prototype.filter.call(nextGameIcons, function(el, i){
      el.addEventListener("click", startGame);
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

    // Add event listener for changing repeat setting - force new game cuz changing in middle doesn't make sense
    // TBD better to add to settings option in main menu...
     document.getElementById("duplicates").getElementsByTagName("input")[0].addEventListener("click", toggleDuplicates);

    // Add event listener for check answer
    var checks = document.getElementById("gameBoard").getElementsByClassName("checkMark");

    // Loop through all checkmarks and assign click event
    // Note that counter i is zero based
    Array.prototype.filter.call(checks, function(el, i){
      el.addEventListener("click", function(){ checkAnswer(); });
    });

  // Add event listener to toggle user help
  document.getElementById("instructionsShow").addEventListener("click", toggleInstructions);
  document.getElementById("instructionsHide").addEventListener("click", toggleInstructions);

  /***********************************************************************
   * FUNCTIONS CALLED BY USER EVENTS  (start new game, select color, assign color to a slot, check answer)
   **********************************************************************/


  // Compare user's answer to secret solution, set black/white pegs & move on to next guess
  function checkAnswer() {
    var results = {};
    var endTime;

    // If any of elements is 0, alert user that a color must be chosen for all 4 slots before checking & return
    if (curGuess.indexOf(0) !== -1) {
      alert("Oops...please choose a color for all four slots before checking your answer.");
      return;
    }

    // Otherwise:

    // If guessCtr = 1, record start time (millisecs)
    if (guessCtr === 1) {
      startTime = new Date().getTime();
    }

    // Remove info for current guess row
    removeHoverColor(guessCtr);

    // Function 'compareSlots' returns obj with {pass: boolean, pegArray: [...]}
    // where pegArray is: if no matches pass in []
    //            if two black, 0 white pass in ["blackPeg", "blackPeg"]
    //            if two black, 1 white pass in ["blackPeg", "blackPeg", "whitePeg"]
    //            if 4 white pass in ["whitePeg", "whitePeg", "whitePeg", "whitePeg"]
    // if exact match return {pass: true, pegArray: ["blackPeg", "blackPeg","blackPeg", "blackPeg"]}
    results = compareSlots();

    // Set background colors for the pegs to indicate how much of user's guess is correct
    setBlackWhitePegs(results.pegArray);
    removeClassFromGuess("currentTry");

    // If game is over, show results
    if ((results.pass) || (guessCtr === 8)) {
      setGameOverRow();

      // Otherwise show user their time info for correct answer
      if (results.pass) {

        showTimeInfo();

      // Otherwise if user did not get correct answer, set the correct colors in 4 slots at top & display
      } else {

        showSolution(results.pegArray.length);
      }

      //Also set guessCtr which affects whether pegs are shown or not, etc.
      guessCtr = 0;

    } else {
      guessCtr++;
      resetCurGuess();
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
    resetCurGuess();
    startTime = 0;
    setSecret();
    removeClassFromGuess("currentTry");
    removeClassFromGuess("gameOver");
    removeSolution();
    setCurrentTry();
    setCurrentPicker(colorPick);  // really just needed on init
    setHoverColor();
    ajaxGetBestTime();
  }

  // Toggle between showing instructions & showing question mark
  function toggleInstructions() {
    var qMark = document.getElementById("justQuestionMark");
    var directions = document.getElementById("gameDirections");

    if (directions.classList.contains("showThis")) {
      directions.classList.remove("showThis");
      qMark.classList.add("showThis");
    } else if (qMark.classList.contains("showThis")) {
      qMark.classList.remove("showThis");
      directions.classList.add("showThis");
    }
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

  //  Removes classname from 'guess' rows
  function removeClassFromGuess(className) {
    var allGuessRows = document.getElementsByClassName('guess');

    // Loop through all guess rows and remove 'currentTry' class
    Array.prototype.filter.call(allGuessRows, function(el){
      if (el.classList.contains(className)) {
        el.classList.remove(className);
      }
    });
  }

  //  Removes classname from 'correctAnswer'  & 'youGotIt' rows so they're hidden
  function removeSolution() {
    var answer= document.getElementById("correctAnswer");
    var youGotIt = document.getElementById("youGotIt");

    if (answer.classList.contains("showSolution")) {
      answer.classList.remove("showSolution");
    }

    if (youGotIt.classList.contains("showSolution")) {
      youGotIt.classList.remove("showSolution");
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

  //  Adds the 'currentTry' classname to the current guess row
  function setCurrentTry() {

    // Assign 'currentTry' class to current guess row, unless at game end
    if (guessCtr > 0) {
      document.getElementById("guess_" + guessCtr).classList.add("currentTry");
    }
  }

  //  Adds the 'gameOver' classname to the last valid row, which controls
  // which guess rows show pegs
  function setGameOverRow() {

    // Assign 'gameOver' class to final guess row
    if (guessCtr > 0) {
      document.getElementById("guess_" + guessCtr).classList.add("gameOver");
    }
  }


  // Set hover color for the current guess row (unless game over)
  function setHoverColor() {
    if (guessCtr > 0) {
      var liveGuess = document.getElementById("guess_" + guessCtr);

      // Add new hoverColor class for current color to the current guess row
      liveGuess.classList.add("hoverColor_" + colorPick);
    }
  }

  //  Set info needed & show final answer
  function showSolution(n) {
    var answer = document.getElementById("correctAnswer");
    var slots = answer.getElementsByClassName("slot");
    var userMsg = getErrorMsg(n);
    var para;
    var content;
    var msgDiv = document.getElementById("userMsg");
    var child = msgDiv.getElementsByTagName("p");

    // Assign solution colors
    for (var i = 0; i < secret.length ; i++) {
      slots[i].classList.add("bgColor_" + secret[i]);
    }

    // Remove any existing <p> and attach new <p> el to userMsg div
    if (child.length > 0) {
      msgDiv.removeChild(child[0]);
    }

    // Create & attach a <p> element with user msg
    para = document.createElement("p");
    content = document.createTextNode(userMsg);
    para.appendChild(content);
    msgDiv.appendChild(para);


    // Assign 'showSolution' class to solution row
    answer.classList.add("showSolution");
  }

    //  Set & show time info for correct answer
  function showTimeInfo() {
    var youGotIt = document.getElementById("youGotIt");
    var userMsg = getSuccessMsg();  // Returns array for 4 line message
    var para;
    var content;
    var msgDiv = document.getElementById("userTime");
    var child = msgDiv.getElementsByTagName("p");

    // Remove any existing <p> and attach new <p> el to userMsg div
    for (var i = (child.length - 1); i >=0; i--) {
      msgDiv.removeChild(child[i]);
    }

    // Create & attach a <p> element with user msg
    for (var i = 0; i < userMsg.length; i++) {
      para = document.createElement("p");
      content = document.createTextNode(userMsg[i]);
      para.appendChild(content);
      msgDiv.appendChild(para);
    }

    // Assign 'showSolution' class to user's time message
    youGotIt.classList.add("showSolution");
  }


  /***** MODEL: these are related to the game logic, calcs, comparisons, etc.****/


  // Compare secret to curGuess and return obj or array with #black & # white
  // Use temp arrays to do this so that we can flip elements to -1 if match found -
  // this helps avoid double counting if user specifies two reds & solution has one red
  // Returns pass/fail boolean and pegArray
  function compareSlots() {
    var isCorrect = false;
    var pegArray = [];
    var tempSecret = secret.slice(); // must use slice so that changes to tempSecret don't affect secret
    var tempGuess = curGuess.slice();
    var exact = 0;
    var matchedIndex;

    for (i = 0; i < tempGuess.length; i++) {
      if (tempGuess[i] == tempSecret[i]) {
        pegArray.push("blackPeg");

        // Track number of exact matches
        exact++;

        // Set both to -1 so that neither can be counted twice when looking for white pegs
        tempGuess[i] = -1;
        tempSecret[i] = -1;
      }
    }

    for (i = 0; i < tempGuess.length; i++) {
      if (tempSecret.includes(tempGuess[i]) && (tempGuess[i] != -1)) {
        pegArray.push("whitePeg");

        // Find location of matched color and change the secret to -1 so it doesn't get matched more than once
        matchedIndex = tempSecret.indexOf(tempGuess[i]);
        tempSecret[matchedIndex] = -1;
      }
    }

    if (exact === 4) {
      isCorrect = true;
    }

    return {pass: isCorrect, pegArray: pegArray};
  }

  function getErrorMsg(n) {
    var userMsg = '';

    // Give different error messages, depending on how many pegs matched
    if (n > 3) {
      userMsg += "YOU WERE SO CLOSE!";
    } else if (n > 2) {
      userMsg += "Almost!";
    } else {
      userMsg += "";
    }

    return userMsg;
  }

  // Generate a random number between 1 & 6
  function getRandom() {
    var ran = Math.random();
    return Math.ceil(ran * 6);
  }

  // Get time for most recent game, compare to user's best time
  // Sets 3 GLOBAL variables (maybe for java to use later - timeSeconds, myBestTime and timeString)
  function getSuccessMsg() {
    var endTime = new Date().getTime();
    var userMsg = [];
    userMsg[0] = "YES!";

    timeSeconds = (endTime - startTime) / 1000;
    mins = Math.floor(timeSeconds/60);
    seconds = Math.round(timeSeconds % 60);

    userMsg[1] = 'You got it in ' + guessCtr + ' guesses';
    userMsg[2] = 'with a time of ' + timeString(timeSeconds) + '!';

    // Compare time to best time & reset if user improved (best is initialized to -1)
    //    if ((myBestTime === -1) || (timeSeconds < myBestTime)) {
    // Compare time to best time & reset if user improved 
    // (best is initialized to 0 - but if ajax call can return -1 for user not logged in, then
    // change this code and use -1, making it possible to catch perfect times of 0)
    if ((myBestTime === 0) || (timeSeconds < myBestTime)) {
      myBestTime = timeSeconds;

      // AJAX call sets best time in db
      ajaxSetBestTime("POST", myBestTime);
      userMsg[3] = 'THAT\'S YOUR BEST TIME!';
    } else {
      userMsg[3] = 'Best time: ' + timeString(myBestTime) + '.';
    }

    return userMsg;

    // Create readable string that shows minutes & seconds - for use in a user msg
    function timeString(n) {
      var mins;
      var seconds;
      var timeMsg;

      mins = Math.floor(n/60);
      seconds = Math.round(n % 60);

      timeMsg = mins +
                  (mins === 1 ? " minute, " : " minutes, ") +
                  seconds +
                  (seconds === 1 ? " second." : " seconds");

      return timeMsg;
    }
  }

  // AJAX call - POST - for setting user's best time
  // Java function will store new time if it's user's best
  function ajaxSetBestTime(type, myTime) {
    $.ajax({
      type: type,
      url: "/path-to/hosting/save?time=" + myTime,
      success: function(data) {
        console.log("Success! Your time is" + myTime)
      }
    });

  }

  // AJAX call - GET
  // Gets users previous best time, for comparison
  function ajaxGetBestTime() {
    $.ajax({
      type: "GET",
      url: "/path-to/hosting/save",
      success: function(data) {

        // Only change myBestTime if user is logged in (ajax returns 0 if not logged in)
        if (data !== 0) {
          myBestTime = data;
        }
      }
    });
  }

  // Reset guess array to all zero
  function resetCurGuess() {
    curGuess = [0, 0, 0, 0];
  }

  // Randomly assign 4 integers to 'secret' array ( 1 = red, etc.)
  function setSecret() {
    var pool = [];
    var index;

    if (allowDuplicates) {
        for (var i = 0 ; i < 4 ; i++) {
          secret[i] = getRandom();
        }
    } else {
        // From Jen, I think this will allow us to generate a code without duplicate colors
        pool = [1, 2, 3, 4, 5, 6];

        for (var i = 0 ; i < 4 ; i++) {
          index = Math.floor(Math.random() * pool.length);
          secret[i] = pool[index];
          pool.splice(index, 1);
         }
    }
  }

  function toggleDuplicates() {
    allowDuplicates = document.getElementById("duplicates").getElementsByTagName("input")[0].checked;
    startGame();
  }

  startGame();
})();



