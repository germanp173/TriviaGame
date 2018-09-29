var intervals = [];

var triviaGame = {
    questionNum: 0,
    questionTimeout: 25, // In seconds
    questionTimeLeft: 0,
    nextQuestionTimeout: 5, // In seconds
    nextQuestionTimeLeft: 0,
    numCorrect: 0,
    numWrong: 0,
    timerHtml: "<div class='row'><div class='col-sm-4'><h1><span class='badge badge-primary' id='correct'>0</span></h1></div>" + 
                "<div class='col-sm-4'><h1><span class='badge badge-success' data-state='success' id='timeLeft'>30</span></h1></div>" +
                "<div class='col-sm-4'><h1><span class='badge badge-danger' id='wrong'>0</span></h1></div></div><h3 id='question'></h3>",
    gameOverHtml: "<br><div class='card mb-3 text-white bg-dark' style='margin: auto; max-width: 25rem;'><div class='card-header'>All Done</div>" +
                    "<div class='card-body'><h5 class='card-title'>So, how did you do?</h5><br><div class='row'><div class='col-sm-6'>" +
                    "<h1><span class='badge badge-primary' id='correct'>0</span></h1></div><div class='col-sm-6'>" + 
                    "<h1><span class='badge badge-danger' id='wrong'>0</span></h1></div></div>" +
                    "<h1><span class='badge badge-success' id='percent'>33%</span></h1></div></div><br>" +
                    "<button type=button class='btn btn-primary' id='start-button'>Play Again!</button>",
    
    startGame: function () {
        // Ensure key game properties are reset.
        this.questionNum = 0;
        this.numCorrect = 0;
        this.numWrong = 0;
        this.nextQuestion();
    },

    nextQuestion: function () {
        // Increment question number.
        this.questionNum++;

        // Ensure that there is still questions left. If not, end the game.
        if (this.questionNum > Object.keys(questions).length) {
            this.endGame();
            return;
        }

        // Reset time left for the question and result modal.
        this.questionTimeLeft = this.questionTimeout;
        this.nextQuestionTimeLeft = this.nextQuestionTimeout;

        // Gets the next question and sets the UI.
        this.updateUI(this.questionNum);

        // Start question timer.
        this.startQuestionTimer();
    },

    updateUI: function (num) {
        // Update timers and pill.
        $("#timeLeft").text(this.questionTimeLeft);
        $("#nextQuestionTimeLeft").text(this.nextQuestionTimeLeft);
        this.updateTimerPill("success");

        // Update question in UI.
        var questionObj = questions[num];
        $("#question").text(questionObj.question);

        // Create an array of all possible answers (both right answer and wrong answers).
        var possibleChoices = [];
        questionObj.wrongAnswers.forEach(function(wrongAnswer) { possibleChoices.push(wrongAnswer) });
        possibleChoices.push(questionObj.answer);

        // Shuffle these options.
        possibleChoices = shuffle(possibleChoices);

        // Set possible choices in UI and ensure none of them are selected.
        $(".choice").each(function (i, listItem) {
            $(listItem).text(possibleChoices[i]);
        })
        $(".active").removeClass("active");

        // Update progress bar and tooltip.
        var numComplete = num-1;
        var totalNumOfQuestion = Object.keys(questions).length;
        var percentComplete = Math.round((numComplete/totalNumOfQuestion)*100);
        $("#progress").attr("style", "width: " + percentComplete + "%").attr("data-original-title", numComplete + "/" + totalNumOfQuestion);
    },

    startQuestionTimer: function () {
        // Create Timer Interval. Interval is declared as a varible to be able to easially clear it when the timer is done.
        var questionTimer = setInterval(function () {

            // Update time left and UI.
            triviaGame.questionTimeLeft--;
            $("#timeLeft").text(triviaGame.questionTimeLeft);

            // Update pill as needed or end the question.            
            if (triviaGame.questionTimeLeft === 15) {
                triviaGame.updateTimerPill("warning");
            }
            else if (triviaGame.questionTimeLeft === 5) {
                triviaGame.updateTimerPill("danger");
            } 
            else if (triviaGame.questionTimeLeft === 0) {
                clearInterval(questionTimer);
                triviaGame.evaluateResult();
            }
        }, 1000);

        // Push timer to invervals array so it can be stopped on demand.
        intervals.push(questionTimer);
    },

    stopIntervals: function () {
        // Clears all intervals that were stored in the Intervals array.
        for (var i=0; i < intervals.length; i++){
            clearInterval(intervals[i]);
            intervals.splice(i, 1);
        }
    },

    evaluateResult: function () {
        // Make sure all intervals are stopped in case the user has submitted their answer before the time ran out.
        this.stopIntervals();

        // Set variables needed to evaluate and update the trivia game.        
        var modalTitle = $("#modalCenterTitle");
        var modalBody = $(".modal-body");
        var userChoice = $(".active").text();

        // Evaluate the game.
        if (userChoice === questions[this.questionNum].answer) {
            $("#correct").text(++this.numCorrect);
            modalTitle.html("<img src='assets/images/correct.png' alt='Check Mark' style='width:35px; height:35px'></img> Correct!");
            modalBody.html("<img class='text-center' src='assets/images/pixar-celebration.jpg' alt='Celebration' style='width:350px;height:200px'>");
        } else {
            $("#wrong").text(++this.numWrong);
            // Evaluate whether the answer is wrong or time ran out to determine modal title.
            userChoice === "" ? modalTitle.html("<img src='assets/images/out-of-time.png' alt='Alarm' style='width:35px; height:35px'></img> Out of Time!") : modalTitle.html("<img src='assets/images/wrong.png' alt='X' style='width:35px; height:35px'></img> Wrong!");
            modalBody.html("<p>The correct answer was:</p>");
            modalBody.append("<h3>" + questions[this.questionNum].answer + "</h3>");
        }
        
        // Show results.
        $("#resultModal").modal('show');

        var startNextQuestionInterval = function () {
            // Set timer that will automatically start next question.
            var nextQuestionTimer = setInterval(function () {
                
                triviaGame.nextQuestionTimeLeft--;
                $("#nextQuestionTimeLeft").text(triviaGame.nextQuestionTimeLeft);
                if (triviaGame.nextQuestionTimeLeft === 0) {
                    // Clears the interval. If, however, the modal is closed before the 
                    // interval reaches 0 then the interval will be cleared by the modal on close event.
                    clearInterval(nextQuestionTimer);
                    $("#resultModal").modal('hide');
                }
            }, 1000);

            // Push timer to invervals array so it can be stopped on demand.
            intervals.push(nextQuestionTimer);
        }

        startNextQuestionInterval();
    },

    endGame: function () {
        // Set HTML final results page.
        $("#triviaCanvas").addClass("d-none");
        $("#top-display").html(this.gameOverHtml);
        $("#correct").text(this.numCorrect);
        $("#wrong").text(this.numWrong);
        $("#percent").text(Math.round((this.numCorrect/Object.keys(questions).length)*100) + "%");
    },

    updateTimerPill: function(state) {
        // Update the pill state to cause a change in badge color.
        var pill = $("#timeLeft");
        pill.removeClass("badge-" + pill.attr("data-state"));
        pill.addClass("badge-" + state);
        pill.attr("data-state", state);
    }
}

// Activate Bootstrap Tooltips.
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// Start Button listener. Uses a "delegate event" as appose to a 
// "direct event" handler to support dynamically added buttons with the specified id.
$(document).on('click', "button#start-button", function(){
    // Update top display HTML.
    $("#top-display").html(triviaGame.timerHtml);

    // Start the Trivia Game.
    triviaGame.startGame();

    // Show question hidden UI elements.
    $("#triviaCanvas").removeClass("d-none");
});

// Update list item everytime the player picks a choice
$(".choice").click(function () {
    $(".choice").removeClass("active")
    $(this).addClass("active");
});

// Event listener for the Submit button.
$("#submit").click(function () {
    triviaGame.evaluateResult();
});

// Listens for the modal to be closed to start the next question.
$("#resultModal").on('hidden.bs.modal', function () {
    // Ensure that all intervals have been cleared incase the user close the modal 
    // before the next question time was up.
    triviaGame.stopIntervals();

    // Start playing the next question!
    triviaGame.nextQuestion();
});

function shuffle(array) {
    // Shuffles an array using the Fisher-Yates Algorithm.
    // Source Code: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle.
    while (0 !== currentIndex) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}