var answerConfirm = document.getElementsByClassName("answer-check");
var quizContainer = document.getElementById("answer-container");
var questionCount = 0;
var correctAnswer = "";
var secondsLeft = "60";
var timeEl = document.querySelector("#time")

var questions = [
    {
        question: 'What Primitive Data Type outcome equals "True/False"?',
        choices: ["Number", "String", "Boolean", "Undefined"],
        correctAnswer: 2
    },
    {
        question: 'What method writes text to the Dev Console?',
        choices: ["console.log", "log.console", "console.text", "text.console"],
        correctAnswer: 0
    },
    {
        question: 'How do you access an element using JS?',
        choices: ["querySelect", "selectQuery", "queryTarget", "querySelector"],
        correctAnswer: 3
    },
    {
        question: "What browser tool is best used for debugging code?",
        choices: ["Print Tool", "Developer Tool", "History", "Find Tool"],
        correctAnswer: 1
    }

]





document.addEventListener("DOMContentLoaded", function() {
    attachStartListener();
});

function attachStartListener() {
    var startButton = document.querySelector("#start");
    if (startButton) {
        startButton.addEventListener("click", function() {
            countdown();
            displayQuestion();
        });
    }
}



function countdown() {
    var timerInterval = setInterval(function() {
        secondsLeft --;
        timeEl.textContent = "Time: " + secondsLeft;

        if (secondsLeft === 0) {
            clearInterval(timerInterval);
            finalScore();
        }
    }, 1000);
}



function displayQuestion() {
    if (questionCount < questions.length) {
        const currentQuestion = questions[questionCount];

        var choicesHTML = currentQuestion.choices.map((choice, index) =>
            `<li><button onclick="checkAnswer(${index})">${choice}</button></li>`
        ).join('');

        quizContainer.innerHTML = `
            <h2>${currentQuestion.question}</h2>
            <ol>
                ${choicesHTML}
            </ol>
        `;

        correctAnswer = currentQuestion.correctAnswer;

        questionCount ++;
    } else {
        finalScore();
    }
}


function finalScore() {
    console.log("OK")
}


function resetQuiz() {
    const quizContainer = document.getElementById("answer-container");
    quizContainer.innerHTML = '<button id="start">Start</button>';
    attachStartListener();
}



function checkAnswer(selected) {
    var correctAnswerIndex = correctAnswer;
    var confirmation = (selected === correctAnswerIndex) ? `<p>Correct!</p>` : `<p>Incorrect!</p>`;

    answerConfirm = document.getElementsByClassName("answer-check");

    for (let i = 0; i < answerConfirm.length; i++) {
        answerConfirm[i].innerHTML = confirmation;
        displayQuestion()
    }
}
