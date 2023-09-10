var correctAnswer = ""
var answerConfirm = document.getElementsByClassName("answer-check");

document.addEventListener("DOMContentLoaded", function() {
    attachStartListener();
});

function attachStartListener() {
    var startButton = document.querySelector("#start");
    if (startButton) {
        startButton.addEventListener("click", startQuiz);
    }
}

function startQuiz() {
    correctAnswer = 2;
    var quizContainer = document.getElementById("answer-container");
    
    quizContainer.innerHTML = `
        <h2>What is the Primitive Type of "True"?</h2>
        <ul>
            <li><button onclick="checkAnswer(0)">Number</button></li>
            <li><button onclick="checkAnswer(1)">String</button></li>
            <li><button onclick="checkAnswer(2)">Boolean</button></li>
            <li><button onclick="checkAnswer(3)">Undefined</button></li>
        </ul>
    `;
}

function question2() {
    correctAnswer = 0;
    var quizContainer = document.getElementById("answer-container");

    quizContainer.innerHTML = `
        <h2>What method writes text to the Dev Console?</h2>
        <ul>
            <li><button onlclick="checkAnswer(0)">Console.log</button></li>
            <li><button onlclick="checkAnswer(1)">Console.message</button></li>
            <li><button onlclick="checkAnswer(2)">Log.console</button></li>
            <li><button onlclick="checkAnswer(3)">Text.log</button></li>
        </ul>
    `;
}



function checkAnswer(selected) {
    var correctAnswerIndex = correctAnswer;
    if (selected === correctAnswerIndex) {
        answerConfirm.innerHTML = `
            <p>Correct!</p>
        `
        question2();
    } else {
        answerConfirm.innerHTML = `
            <p>Incorrect!</p>
        `
        question2();
    }
}

function resetQuiz() {
    const quizContainer = document.getElementById("answer-container");
    quizContainer.innerHTML = '<button id="start">Start</button>';
    attachStartListener();
}