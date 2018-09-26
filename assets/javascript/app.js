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
    }
}

triviaGame.startGame();
