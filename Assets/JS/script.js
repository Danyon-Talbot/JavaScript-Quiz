var answerConfirm = document.getElementsByClassName("answer-check");
var quizContainer = document.getElementById("answer-container");
var questionContainer = document.getElementById("question-container");
var resultsContainer = document.getElementById("results-container");
var textInfo = document.getElementById("quizInfo");
var scoreContainer = document.getElementById("final-score")
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
            event.target.style.display = "none";
            textInfo.style.display = "none";
        }
    })
}


document.addEventListener("DOMContentLoaded", function() {
    // Wait for the entire document to be loaded before attaching the listener

    var topScoreButton = document.getElementById("top-score");
    if (topScoreButton) { //Ensures the element exists
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
        //finds the current displayed question's answers and assigns them to an element
        var choicesHTML = currentQuestion.choices.map((choice, index) =>
            `<li><button class="choice" onclick="checkAnswer(${index})">${choice}</button></li>`
        ).join('');
        //displays current question text
        document.getElementById("question-text").textContent = currentQuestion.question;
        //displays current question answers
        quizContainer.innerHTML = `
            <ul class="choice-list">
                ${choicesHTML}
            </ul>
        `;
        //sets the correct answer for the current question
        correctAnswer = currentQuestion.correctAnswer;
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
    //var sets If selected is Stictly equal: displays Correct!, else Incorrect!
    var confirmation = (selected === correctAnswerIndex) ? `<h3>Correct!<h3>` : `<h3>Incorrect!</h3>`;

    //Checks selected answer against displayed answers
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

    //increments the question number and displays next question
    questionCount ++;
    displayQuestion();

}

//Clears Timer, displays final score, and asks user to input Initials
function finalScore() {
    console.log("Final Score");
    scoreContainer.style.display = "flex";
    clearInterval(timerInterval);
    score = secondsLeft;

    //Array.from(answerConfirm).forEach(item => item.innerHTML = "");
    scoreContainer.innerHTML = `
        <h1 class="question">Final Score: ${secondsLeft}</h1>
        <p class="enter-initials">Enter Initials: <input type="text" id="initials" maxlength="3"/></P>
        <button onclick="submitResults()">Submit</button>
    `;

    questionContainer.style.display = "none";
    quizContainer.style.display = "none";

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
    //Ensures that all saved results are viable
    if (!Array.isArray(savedResults)) {
        console.warn("Unexpected data in localStorage. Resetting...");
        savedResults = [];
    }
    //Ensures that new results are added to the existing storage and not replaced
    savedResults.push(newResult);

    localStorage.setItem("Results", JSON.stringify(savedResults));
    
    displayResults();
    //hides itself
    scoreContainer.style.display = 'none';

}

//Displays top scores
function displayResults() {
    console.log("Display Results")
    var hideHeader = document.getElementById("header")
    resultsContainer.style.display = 'flex';
    hideHeader.style.display = "none";
    textInfo.style.display = "none";

    var storedResults = JSON.parse(localStorage.getItem("Results"));
    var resultsHTML = "";
    //If results are found, displays them on screen with nav buttons
    if (storedResults && storedResults.length > 0) {
        resultsHTML += '<h2 id="displayScoreTitle">TOP SCORES</h2>';
        resultsHTML += '<button id="reset-quiz" class="resetButton" onclick="resetQuiz()">Home</button>';
        resultsHTML += '<button id="clear-scores" class="resetButton" onclick="clearScores()">Clear Scores</button>';
        storedResults.forEach(result => {
            resultsHTML += `<ol><li id="results-list">${result.Initials} - ${result.Score}</li></ol>`;
        });

    //if no scores are found, displays "No Results" and nav buttons
    } else {
        resultsHTML += '<h2 id="displayScoreTitle">TOP SCORES</h2>';
        resultsHTML += '<button id="reset-quiz" onclick="resetQuiz()">Home</button>';
        resultsHTML += '<button id="clear-scores" onclick="clearScores()">Clear Scores</button>';
        resultsHTML += '<p id="noResults">No Results</p>';
    }

    resultsContainer.innerHTML = resultsHTML;
}

//Function is called when Clear Score button is clicked
function clearScores() {
    localStorage.removeItem("Results");
    displayResults();
}

//Resets the quiz back to default settings.
function resetQuiz() {
    //defaults variables
    questionCount = 0;
    secondsLeft = 30;
    correctAnswer = null;
    timeEl.textContent = "Time: 0";
    var showHeader = document.getElementById("header");

    //resets display values
    questionContainer.style.display = "flex";
    quizContainer.style.display = "flex";
    resultsContainer.style.display = "none";
    showHeader.style.display = "flex";
    textInfo.style.display = "flex";
    document.getElementById("start").style.display = "block";

    //resets question text to original header
    questionContainer.innerHTML = `
        <h1 id="question-text" class="questionText">JavaScript Quiz</h1>
    `;

    //resets the quiz container to hidden
    quizContainer.innerHTML = `
            <!--Answers-->
        <div class="answer-check" style="display: none;">
        </div>
    `;

    //resets results to empty
    resultsContainer.innerHTML = `
        <!--Results-->
    `

    //clears any remaining elements in answer check
    var elements = document.getElementsByClassName("answer-check");
    for(var el of elements) {
        el.remove();
    }

}



