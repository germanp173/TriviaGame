// Initial notes:
// 1. Need an object that holds each question
//      - Question
//      - String Right answer
//      - Array of wrong answers?
// 2. Will need a timer for each question
// 3. Need a counter that keeps track of question progress
// 4. Function that calls a set timeout function which contains the functionality that automatically starts the next question 
// 5. Button to restart the game after it's over
// 6. Only one answer for each question can be chosen

var questions = {
    1: {
        question: "What year was Pixar started?",
        answer: "1999",
        wrongAnswers: [
            "1955",
            "1944",
            "2018"
        ]
    },
    2: {
        question: "What year did Steve Jobs go to Pixar?",
        answer: "2001",
        wrongAnswers: [
            "1400",
            "1988",
            "2005"
        ]
    },
    3: {
        question: "How many Toy Story Movies have been released?",
        answer: "3",
        wrongAnswers: [
            "1",
            "5",
            "4"
        ]
    }
}

var intervals = [];

var triviaGame = {
    questionNum: 0,
    questionTimeout: 30, // In seconds
    questionTimeLeft: 0,
    nextQuestionTimeout: 10, // In seconds
    nextQuestionTimeLeft: 0,
    timerHtml: "<h1><span class=\"badge badge-success\" data-state=\"success\" id=\"timeLeft\">30</span></h1><h3 id=\"question\"></h3>",

    startGame: function () {
        this.questionNum = 0;
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

        // Create an array of all possible answers (both right and wrong answers).
        var possibleChoices = questionObj.wrongAnswers;
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
            if (triviaGame.questionTimeLeft === 20) {
                triviaGame.updateTimerPill("warning");
            }
            else if (triviaGame.questionTimeLeft === 10) {
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
            modalTitle.text("Correct!");
            modalBody.text("Add some awesome celebration here");
        } else {
            userChoice === "" ? modalTitle.text("Time ran out!") : modalTitle.text("Wrong!");
            modalBody.text("The correct answer is: " + questions[this.questionNum].answer);
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
        
    },

    updateTimerPill: function(state) {
        var pill = $("#timeLeft");
        pill.removeClass("badge-" + pill.attr("data-state"));
        pill.addClass("badge-" + state);
        pill.attr("data-state", state);
    }
}

// Activate Bootstrap Tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})

// Start Button listener
$("#start-button").click(function () {

    // Update top display HTML.
    $("#top-display").html(triviaGame.timerHtml);

    // Start the Trivia Game.
    triviaGame.startGame();

    // Show question hidden UI elements.
    $(".d-none").removeClass("d-none");
})

// Update list item everytime the player picks a choice
$(".choice").click(function () {
    $(".choice").removeClass("active")
    $(this).addClass("active");
})

// Event listener for the Submit button.
$("#submit").click(function () {
    triviaGame.evaluateResult();
})

// Listens for the modal to be closed to start the next question.
$("#resultModal").on('hidden.bs.modal', function () {
    // Ensure that all intervals have been cleared incase the user close the modal 
    // before the next question time was up.
    triviaGame.stopIntervals();

    // Start playing the next question!
    triviaGame.nextQuestion();
})

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