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
var clearCheckAnswer;
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

document.addEventListener("DOMContentLoaded", function() {
    // Wait for the entire document to be loaded before attaching the listener

    var topScoreButton = document.getElementById("top-score");
    if (topScoreButton) { // Make sure the element exists
        topScoreButton.addEventListener("click", function() {
            displayResults();

            if (questionContainer) {
                questionContainer.style.display = "none";
            }
        });
    } 
});


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
            `<li><button class="choice" onclick="checkAnswer(${index})">${choice}</button></li>`
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

//Checks if the selected answer is correct and then calls displayQuestion again.
function checkAnswer(selected) {
    var correctAnswerIndex = correctAnswer;
    //Reduces timer by 5 seconds on wrong answer
    if (selected !== correctAnswerIndex) {
        secondsLeft -= 5;
        //Updates the timer to reflect reduced time
        displayTimer();
        console.log("Timer-update")
    }

    var confirmation = (selected === correctAnswerIndex) ? `<h3>Correct!<h3>` : `<h3>Incorrect!</h3>`;

    answerConfirm = document.getElementsByClassName("answer-check");

    for (let i = 0; i < answerConfirm.length; i++) {
        answerConfirm[i].innerHTML = confirmation;
        answerConfirm[i].style.display = "flex";
    };

    //Resets the timer for setTimeout after it is called
    if (clearCheckAnswer) {
        clearTimeout(clearCheckAnswer);
    }
    //Ensures the checkAnswer message is cleared after each check
    clearCheckAnswer = setTimeout(function() {
        for (var i=0; i < answerConfirm.length; i++) {
            answerConfirm[i].innerHTML = "";
            answerConfirm[i].style.display = "none";
        }
    }, 2000)


    questionCount ++;
    displayQuestion();

}

//Clears Timer, displays final score, and asks user to input Initials
function finalScore() {
    console.log("OK");
    clearInterval(timerInterval);
    score = secondsLeft;

    //Array.from(answerConfirm).forEach(item => item.innerHTML = "");

    questionContainer.innerHTML = `
        <h1 class="question">Final Score: ${secondsLeft}</h1>
        <p class="enter-initials">Enter Initials: <input type="text" id="initials" maxlength="3"/></P>
        <button onclick="submitResults()">Submit</button>
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
    var hideHeader = document.getElementById("header")
    resultsContainer.style.display = 'flex';
    hideHeader.style.display = "none";

    var storedResults = JSON.parse(localStorage.getItem("Results"));
    var resultsHTML = "";
    if (storedResults && storedResults.length > 0) {
        resultsHTML += '<h2 id="displayScoreTitle">TOP SCORES</h2>';
        resultsHTML += '<button id="reset-quiz" class="resetButton" onclick="resetQuiz()">Home</button>';
        resultsHTML += '<button id="clear-scores" class="resetButton" onclick="clearScores()">Clear Scores</button>';
        storedResults.forEach(result => {
            resultsHTML += `<ol><li id="results-list">${result.Initials} - ${result.Score}</li></ol>`;
        });
    } else {
        resultsHTML += '<h2 id="displayScoreTitle">TOP SCORES</h2>';
        resultsHTML += '<button id="reset-quiz" onclick="resetQuiz()">Home</button>';
        resultsHTML += '<button id="clear-scores" onclick="clearScores()">Clear Scores</button>';
        resultsHTML += '<p id="noResults">No Results</p>';
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
    timeEl.textContent = "Time: 0";
    var showHeader = document.getElementById("header");

    questionContainer.style.display = "flex";  
    resultsContainer.style.display = "none";
    showHeader.style.display = "flex";

    questionContainer.innerHTML = `
        <h1 id="question-text" class="questionText">HEADER</h1>
        <button id="start">Start</button>
    `;
    
    quizContainer.innerHTML = `
            <!--Answers-->
        <div class="answer-check" style="display: none;">
        </div>
    `;

    resultsContainer.innerHTML = `
        <!--Results-->
    `

    var elements = document.getElementsByClassName("answer-check");
    for(var el of elements) {
        el.remove();
    }

    attachStartListener();
}



