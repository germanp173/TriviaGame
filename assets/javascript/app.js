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
    }
}

var triviaGame = {
    questionNum: 0,
    questionTimeout: 30, // In seconds
    questionTimeLeft: 0,
    nextQuestionTimeout: 10, // In seconds
    nextQuestionTimeLeft: 0,
    timerHtml = "<h1><span class=\"badge badge-success\" id=\"timeLeft\">30</span></h1><h3 id=\"question\"></h3>",

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
        }

        // Reset time left for the question and result modal.
        this.questionTimeLeft = this.questionTimeout;
        this.nextQuestionTimeLeft = this.nextQuestionTimeout;

        // Gets the next question and sets the UI.
        this.setQuestionUI(this.questionNum);

        // Start question timer.
        this.questionTimer();
    },

    setQuestionUI: function (num) {
        var questionObj = questions[num];

        // Update timers.
        $("#timeLeft").text(this.questionTimeLeft);
        $("#next-question-timer-left").text(this.nextQuestionTimeLeft);

        // Update question in UI.
        $("#question").text(questionObj.question);

        // Create an array of all possible answers (both right and wrong answers).
        var possibleChoices = questionObj.wrongAnswers;
        possibleChoices.push(questionObj.answer);

        // Shuffle these choices.
        possibleChoices = shuffle(possibleChoices);

        // Set possible choices in UI.
        $(".choice").each(function (i, listItem) {
            $(listItem).text(possibleChoices[i]);
        })
    },

    questionTimer: function () {
        var questionTimer = setInterval(function () {
            triviaGame.questionTimeLeft--;
            $("#timeLeft").text(triviaGame.questionTimeLeft);

            if (triviaGame.questionTimeleft === 20) {
                this.updateTimerPill("warning");
            } else if (triviaGame.questionTimeLeft === 10) {
                this.updateTimerPill("danger");
            } else if (triviaGame.questionTimeLeft === 0) {
                clearInterval(questionTimer);
                this.evaluateResult();
            }
        }, 1000);
    },

    nextQuestionTimer: function () {
        setTimeout(function () {
            console.log("Moving on to the next question!");
            triviaGame.nextQuestion();
        }, triviaGame.nextQuestionTimeout)
    },

    stopTimer: function () {
        clearInterval(1);
    },

    evaluateResult: function () {
        this.stopTimer();

        // Set variables needed to evaluate and update the trivia game.        
        var modalTitle = $("#modalCenterTitle");
        var modalBody = $(".modal-body");
        var modalFooter = $("#nextQuestionTimeLeft");
        var userChoice = $(".active").text();

        // Evaluate the game.
        if (userChoice === questions[this.questionNum].answer) {
            modalTitle.text("Correct!");
            modalBody.text("Add some awesome celebration here");
        } else {
            modalTitle.text("Wrong!");
            modalBody.text("The correct answer is: " + questions[this.questionNum].answer);
        }

        startNextQuestionInterval();

        var startNextQuestionInterval = function () {
            var interval = setInterval(function () {

                triviaGame.nextQuestionTimeLeft--;
                $("#nextQuestionTimeLeft").text(triviaGame.nextQuestionTimeLeft);

                if (triviaGame.nextQuestionTimeLeft === 0) {
                    clearInterval(interval);
                    $("#resultModal").modal('hide');
                }
            }, 1000);
        }
    },

    endGame: function () {
        
    },

    pillClassSuffix: "success",

    updateTimerPill: function (classSuffix) {
        var pill = $("#timeLeft");
        pill.removeClass("badge-" + this.pillClassSuffix);
        pill.addClass("badge-" + classSuffix);
        this.pillClassSuffix = classSuffix;
    }
}

// Activate Bootstrap Tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
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
    console.log("This shit is working");
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