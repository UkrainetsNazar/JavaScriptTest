let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

const question = document.getElementById('question');
const answersContainer = document.getElementById('answers-container');
const submitBtn = document.getElementById('submit-button');
const finishBtn = document.getElementById('finish-button');
const resultContainer = document.getElementById('result-container');
const resultValue = document.querySelector('.result-value');
const restartBtn = document.getElementById('restart-button');

async function loadQuestions(){
    try{
        const response = await fetch('questions.json');
        questions = await response.json();
        showQuestion();
    }
    catch(e){
        question.textContent = "Can`t fetch data from json";
    }
}

function showQuestion() {
    const getQuestion = questions[currentQuestionIndex];
    question.textContent = getQuestion.question;

    answersContainer.innerHTML = "";
    getQuestion.options.forEach(option => {
        const label = document.createElement("label");
        label.classList.add("answer-option");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = option;

        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        answersContainer.appendChild(label);
    });

    if(currentQuestionIndex === questions.length - 1){
        submitBtn.classList.add("hidden");
        finishBtn.classList.remove("hidden");
    }
}

function handleNextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedAnswer) {
        alert("Please select an answer!");
        return;
    }

    if(selectedAnswer.value === questions[currentQuestionIndex].answer)
        correctAnswers++;

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    }
}

function finishTest(){
    resultValue.textContent = `${correctAnswers} / ${questions.length}`;

    document.querySelector(".questions-container").classList.add("hidden");
    resultContainer.classList.remove("hidden");
}

function restartTest(){
    currentQuestionIndex = 0;
    correctAnswers = 0;

    document.querySelector(".questions-container").classList.remove("hidden");
    resultContainer.classList.add("hidden");
    submitBtn.classList.remove("hidden");
    finishBtn.classList.add("hidden");

    showQuestion();
}

submitBtn.addEventListener("click", handleNextQuestion);
finishBtn.addEventListener("click", finishTest);
restartBtn.addEventListener("click", restartTest);

loadQuestions();