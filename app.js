const totalTime = 300; // Total time for the entire quiz in seconds (adjust as needed)
let timeLeft = totalTime; // Initialize timeLeft with the total time
let currentQuestionIndex = 0; // To keep track of the current question
let score = 0; // To keep track of the user's score

const timerElement = document.getElementById("timer");
const feedbackElement = document.getElementById("feedback");
const feedbackTextElement = document.getElementById("feedback-text");

// Sample questions array
const questions = [
  {
    question: "What does 'JS' stand for?",
    options: ["JavaScript", "JustScript", "JavaSource", "JScript"],
    answer: "JavaScript",
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: ["var", "int", "string", "variable"],
    answer: "var",
  },
  {
    question: "What allows the variable value to be reassigned? ",
    options: [, "int","let", "string", "const"],
    answer: "let"
  },
  {
    question: "What is a loop?",
    options: ["Allows code to handle events and callbacks once triggered", "The same code repeated", " A design", " Allows code to trigger a 404"],
    answer: "Allows code ro handle events and callbacks once triggered"
},
];


document.addEventListener('DOMContentLoaded', function() {
    const startQuizButton = document.getElementById('start-quiz');
    const introSection = document.getElementById('intro');
    const quizContainer = document.getElementById('quiz-container');

    startQuizButton.addEventListener('click', function(event) {
        event.preventDefault(); 

        // Hide the intro section
        introSection.classList.add('hidden');
        
        // Show the quiz container
        quizContainer.classList.remove('hidden');

        
    });
});


// Function to update the timer display
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  if (timeLeft === 0) {
    clearInterval(timerInterval);
    endQuiz();
  } else {
    timeLeft--;
  }
}

// Start the timer when the quiz begins
const timerInterval = setInterval(updateTimer, 1000);

// Function to display a question
function displayQuestion(questionObj) {
  const quizSection = document.getElementById("quiz");
  quizSection.innerHTML = ""; // Clear previous question
  feedbackTextElement.textContent = ""; 
  // Create question element
  const questionElement = document.createElement("h2");
  questionElement.textContent = questionObj.question;

  // Create options elements
  const optionsList = document.createElement("ul");
  questionObj.options.forEach((option) => {
    const optionItem = document.createElement("li");
    optionItem.textContent = option;

    // Add a click event listener to check the answer
    optionItem.addEventListener("click", () => {
      checkAnswer(option, questionObj.answer);
    });

    optionsList.appendChild(optionItem);
  });

  // Append question and options to the quiz section
  quizSection.appendChild(questionElement);
  quizSection.appendChild(optionsList);
}

// Function to check the selected answer
function checkAnswer(selectedAnswer, correctAnswer) {
  // Disable click events on options while displaying feedback
  const optionsList = document.querySelectorAll("ul li");
  optionsList.forEach((optionItem) => {
    optionItem.style.pointerEvents = "none";
  });

  if (selectedAnswer === correctAnswer) {
    feedbackTextElement.textContent = "Correct!";
    feedbackElement.classList.add("correct");
    score++; // Increase the score
  } else {
    feedbackTextElement.textContent = "Wrong!";
    feedbackElement.classList.add("wrong"); // Apply a CSS class for wrong answer
  }

  // Display the feedback
  feedbackElement.classList.remove("hidden");

  // Wait for 1 seconds and then proceed to the next question
  setTimeout(() => {
    feedbackElement.classList.add("hidden");
    feedbackElement.classList.remove("correct", "wrong"); // Remove answer-specific classes

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(questions[currentQuestionIndex]);

      // Re-enable click events on options
      optionsList.forEach((optionItem) => {
        optionItem.style.pointerEvents = "auto";
      });
    } else {
      // All questions have been answered, end the quiz
      endQuiz();
    }
  }, 1000); 
}

// Function to end the quiz
function endQuiz() {
  clearInterval(timerInterval);

  // Display "All done" message
  const allDoneMessage = document.createElement("h2");
  allDoneMessage.textContent = "All done!";
  const quizSection = document.getElementById("quiz");
  quizSection.innerHTML = ""; 
  quizSection.appendChild(allDoneMessage);

  const finalScore = document.createElement("p");
  finalScore.textContent = `Your final score is ${score}`;
  quizSection.appendChild(finalScore);

  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("placeholder", "Enter your name");
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";

  // Event listener for the submit button
  submitButton.addEventListener("click", () => {
    const playerName = nameInput.value;

    // Get existing high scores from local storage or initialize an empty array
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    const playerData = {
      name: playerName,
      score: score,
    };

    highScores.push(playerData);

    highScores.sort((a, b) => b.score - a.score);

    // Store the updated high scores array in local storage
    localStorage.setItem("highScores", JSON.stringify(highScores));

    displayHighScores();
  });

  // Append name input and submit button to the quiz section
  quizSection.appendChild(nameInput);
  quizSection.appendChild(submitButton);

  const feedbackElement = document.getElementById("feedback");
  feedbackElement.classList.add("hidden");
}

// Call the function to display the first question when the quiz starts
displayQuestion(questions[0]);
function displayHighScores() {
  const highScoresSection = document.getElementById("high-scores");
  const highScoresList = document.getElementById("high-scores-list");
  const formSection = document.getElementById("quiz"); 
  const clearScoresButton = document.getElementById("clear-scores-button");

  // Get high scores from local storage
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  // Clear previous high scores
  highScoresList.innerHTML = "";

  // Populate and display high scores
  highScores.forEach((playerData) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${playerData.name}: ${playerData.score}`;
    highScoresList.appendChild(listItem);
  });

  // Show the high scores section
  highScoresSection.classList.remove("hidden");
  formSection.classList.add("hidden");
  clearScoresButton.addEventListener("click", () => {
    localStorage.removeItem("highScores");
    highScoresList.innerHTML = "";
        window.location.href = 'index.html';
  });
}

