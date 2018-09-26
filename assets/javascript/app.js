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
    questionTimeLeft: 10,
    questionTimeout: 10, // In seconds
    nextQuestionTimeout: 10000, // In milliseconds

    startGame: function () {
        this.questionNum = 0;
        this.nextQuestion();
    },

    nextQuestion: function () {
        this.questionTimeLeft = this.questionTimeout;
        this.getQuestion(++this.questionNum);

        // Start question timer.
        this.questionTimer();
    },

    getQuestion: function (num) {
        console.log(questions[num])
    },

    questionTimer: function () {
        var questionTimer = setInterval(function () {
            triviaGame.questionTimeLeft--;
            console.log(triviaGame.questionTimeLeft);

            if (triviaGame.questionTimeLeft === 0) {
                clearInterval(questionTimer);
                triviaGame.nextQuestionTimer();
                console.log("Question Time is up!");
            }
        }, 1000);
    },

    nextQuestionTimer: function () {
        setTimeout(function () {
            console.log("Moving on to the next question!");
            triviaGame.nextQuestion();
        }, triviaGame.nextQuestionTimeout)
    },

    stopTimer: function(){
        clearInterval(1);
    },

    evaluateResult: function(){

    }
}

// triviaGame.startGame();

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$("#start-button").click(function(){
    $(".d-none").removeClass("d-none");
})

$(".choice").click(function(){
    $(".choice").removeClass("active")
    $(this).addClass("active");
})

$("#submit").click(function(){


    $("#resultModal").modal('show');

    setTimeout(function(){
        $("#testing").text("Testing");
    }, 2000)

    setTimeout(function(){
        $("#resultModal").modal('hide');
    }, 4000)
})

// Listens for the modal to be closed to start the next question.
$("#resultModal").on('hidden.bs.modal', function(){
    console.log("This shit is working");
})


function shuffle(array) {
    // Shuffles an array using the Fisher-Yates Algorithm.
    // Source Code: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    var currentIndex = array.length, temporaryValue, randomIndex;
  
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