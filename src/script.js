let questions = [];
let currentQuestionIndex = 0;

const question = document.getElementById('question');
const answersContainer = document.getElementById('answers-container');
const submitBtn = document.getElementById('submit-button');
const finishBtn = document.getElementById('finish-button');
const resultContainer = document.getElementById('result-container');
const resultValue = document.querySelector('.result-value');
const resultBtn = document.getElementById('restart-button');

async function loadQuestions(){
    try{
        const response = await fetch('23questions.json');
        questions = await response.json();
    }
    catch(e){
        question.textContent = "Can`t fetch data from json";
    }
}

loadQuestions();