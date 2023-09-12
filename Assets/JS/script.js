var answerConfirm = document.getElementsByClassName("answer-check");
var quizContainer = document.getElementById("answer-container");
var questionContainer = document.getElementById("question-container");
var resultsContainer = document.getElementById("results-container");
var questionCount = 0;
var correctAnswer = null;
var secondsLeft = 30;
var timeEl = document.querySelector("#time");
var timerInterval = "";
var score = 0;

var questions = [
    {
        question: 'What Primitive Data Type outcome equals "True/False"?',
        choices: ["1. Number", "2. String", "3. Boolean", "4. Undefined"],
        correctAnswer: 2
    },
    {
        question: 'What method writes text to the Dev Console?',
        choices: ["1. console.log", "2. log.console", "3. console.text", "4. text.console"],
        correctAnswer: 0
    },
    {
        question: 'How do you access an HTML element using JS?',
        choices: ["1. querySelect", "2. selectQuery", "3. queryTarget", "4. querySelector"],
        correctAnswer: 3
    },
    {
        question: "What browser tool is best used for debugging code?",
        choices: ["1. Print Tool", "2. Developer Tool", "3. History", "4. Find Tool"],
        correctAnswer: 1
    }

]


//Ensures that the page is fully loaded and calls attachStartListener function
document.addEventListener("DOMContentLoaded", function() {
    attachStartListener();
});

//Adds an event listener to the Start Button
function attachStartListener() {
    document.addEventListener("click", function(event) {
        if (event.target.id === "start") {
            countdown();
            displayQuestion();
            event.target.style.display = 'none';
        }
    })
}


//Displays the timer when called
function displayTimer() {
    timeEl.textContent = "Time: " + secondsLeft;
}

//Starts the timer countdown
function countdown() {
    //displays the timer immediately
    clearInterval(timerInterval);
    displayTimer();
    timerInterval = setInterval(function() {
        secondsLeft --;
        //ensures that the timer counts down
        displayTimer();
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            finalScore();
        }
    }, 1000);
}


//Cycles through the questions and answers, and displays them on the page
function displayQuestion() {
    if (questionCount < questions.length) {
        const currentQuestion = questions[questionCount];

        var choicesHTML = currentQuestion.choices.map((choice, index) =>
            `<li class="choice"><button onclick="checkAnswer(${index})">${choice}</button></li>`
        ).join('');

        document.getElementById("question-text").textContent = currentQuestion.question;

        quizContainer.innerHTML = `
            <ul class="choice-list">
                ${choicesHTML}
            </ul>
        `;

        correctAnswer = currentQuestion.correctAnswer;
        console.log("next question")
    } else {
        //Calls the final score function when the final question has been answered
        finalScore();
    }
}

//Checks if the selected answer is correct
function checkAnswer(selected) {
    var correctAnswerIndex = correctAnswer;
    //Reduces timer by 5 seconds on wrong answer
    if (selected !== correctAnswerIndex) {
        secondsLeft -= 5;
        //Updates the timer to reflect reduced time
        displayTimer();
        console.log("Timer-update")
    }

    var confirmation = (selected === correctAnswerIndex) ? `<p>Correct!</p>` : `<p>Incorrect!</p>`;

    answerConfirm = document.getElementsByClassName("answer-check");

    for (let i = 0; i < answerConfirm.length; i++) {
        answerConfirm[i].innerHTML = confirmation;
    };
    questionCount ++;
    displayQuestion();

}

//Clears Timer, displays final score, and asks user to input Initials
function finalScore() {
    console.log("OK");
    clearInterval(timerInterval);
    score = secondsLeft;

    Array.from(answerConfirm).forEach(item => item.innerHTML = "");

    questionContainer.innerHTML = `
        <h1 class="question">Final Score: ${secondsLeft}</h1>
        <p class="enter-initials">Enter Initials: <input type="text" id="initials" maxlength="3"/></P>
        <button class="enter-initials" onclick="submitResults()">Submit</button>
    `;

    quizContainer.innerHTML = "";

    console.log(secondsLeft);
}

//Submits user inputed
function submitResults() {
    console.log("Results Submitted")
    var initials = document.getElementById("initials").value;
    var newResult = {
        Initials: initials,
        Score: score
    }
    
    var savedResults = JSON.parse(localStorage.getItem("Results")) || [];

    if (!Array.isArray(savedResults)) {
        console.warn("Unexpected data in localStorage. Resetting...");
        savedResults = [];
    }

    savedResults.push(newResult);

    localStorage.setItem("Results", JSON.stringify(savedResults));
    
    displayResults();
        questionContainer.style.display = 'none';

}

//Displays top scores
function displayResults() {
    resultsContainer.style.display = 'block';

    var storedResults = JSON.parse(localStorage.getItem("Results"));
    var resultsHTML = "";
    if (storedResults && storedResults.length > 0) {
        resultsHTML += '<button class="reset-quiz" onclick="resetQuiz()">Home</button>';
        resultsHTML += '<button class="clear-scores" onclick="clearScores()">Clear Scores</button>';
        storedResults.forEach(result => {
            resultsHTML += `<p>Initials: ${result.Initials}, Score: ${result.Score}</p>`;
        });
    } else {
        resultsHTML += '<button class="reset-quiz" onclick="resetQuiz()">Home</button>';
        resultsHTML += '<button class="clear-scores" onclick="clearScores()">Clear Scores</button>';
        resultsHTML += '<p>No Results</p>';
    }

    resultsContainer.innerHTML = resultsHTML;
}

function clearScores() {
    localStorage.removeItem("Results");
    displayResults();
}

function resetQuiz() {
    questionCount = 0;
    secondsLeft = 30;
    correctAnswer = null;
    timeEl.textContent = "Time: 30";

    questionContainer.style.display = 'block';  
    resultsContainer.style.display = 'none';

    questionContainer.innerHTML = `
        <h2 id="question-text" class="question">HEADER</h2>
        <button id="start">Start</button>
    `;
    
    quizContainer.innerHTML = `
        <div id="answer-container">
            <!--Answers-->
        </div>
    `

    var elements = document.getElementsByClassName("answer-check");
    for(var el of elements) {
        el.remove();
    }

    attachStartListener();
}



