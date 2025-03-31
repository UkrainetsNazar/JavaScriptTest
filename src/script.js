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
const progressBar = document.getElementById('progress-bar');

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        shuffleArray(questions);
        showQuestion();
        updateProgress();
    } catch(e) {
        question.textContent = "Can't fetch data from json";
        showToast("⚠️ Failed to load questions", "error");
    }
}

function showToast(message, type) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateProgress() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

async function showQuestion() {
    answersContainer.classList.remove("fade-out", "fade-in");
    
    const getQuestion = questions[currentQuestionIndex];
    question.textContent = `${currentQuestionIndex+1}. ${getQuestion.question}`;
    
    answersContainer.innerHTML = "";
    
    let shuffledOptions = [...getQuestion.options];
    shuffleArray(shuffledOptions);
    
    shuffledOptions.forEach((option, index) => {
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
    
    if(currentQuestionIndex === questions.length - 1) {
        submitBtn.classList.add("hidden");
        finishBtn.classList.remove("hidden");
    }
}

async function handleNextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');

    if (!selectedAnswer) {
        showToast("⚠️ Choose answer!", "warning");
        return;
    }

    selectedAnswer.parentElement.style.transform = "scale(1.05)";
    setTimeout(() => {
        selectedAnswer.parentElement.style.transform = "scale(1)";
    }, 200);

    if (selectedAnswer.value === questions[currentQuestionIndex].answer) {
        showToast("✅ Correct!", "success");
        correctAnswers++;
    } else {
        showToast(`❌ Incorrect! Correct answer is ${questions[currentQuestionIndex].answer}`, "error");
    }

    currentQuestionIndex++;
    updateProgress();

    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 1000);
    }
}

async function finishTest() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');

    if (!selectedAnswer) {
        showToast("⚠️ Choose answer!", "warning");
        return;
    }

    if (selectedAnswer.value === questions[currentQuestionIndex].answer) {
        showToast("✅ Correct!", "success");
        correctAnswers++;
    } else {
        showToast(`❌ Incorrect! Correct answer is ${questions[currentQuestionIndex].answer}`, "error");
    }
    
    document.querySelector(".questions-container").classList.add("fade-out");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    document.querySelector(".questions-container").classList.add("hidden");
    resultContainer.classList.remove("hidden");
    resultContainer.classList.add("fade-in");
    
    resultValue.textContent = `${correctAnswers} / ${questions.length}`;
    
    setTimeout(() => {
        resultValue.classList.add('result-scale');
        setTimeout(() => resultValue.classList.remove('result-scale'), 1000);
    }, 300);
}

async function restartTest() {
    resultContainer.classList.add("fade-out");
    await new Promise(resolve => setTimeout(resolve, 500));
    resultContainer.classList.add("hidden");
    resultContainer.classList.remove("fade-out");

    currentQuestionIndex = 0;
    correctAnswers = 0;
    updateProgress();

    const questionsContainer = document.querySelector(".questions-container");
    questionsContainer.classList.remove("hidden");
    questionsContainer.classList.add("fade-in");
    questionsContainer.style.opacity = "1";

    shuffleArray(questions);
    
    await showQuestion();
    
    submitBtn.classList.remove("hidden");
    finishBtn.classList.add("hidden");
}


submitBtn.addEventListener("click", handleNextQuestion);
finishBtn.addEventListener("click", finishTest);
restartBtn.addEventListener("click", restartTest);

loadQuestions();