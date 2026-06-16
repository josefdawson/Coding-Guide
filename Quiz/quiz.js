const questions = [
    {
        question: '(Lua) What keyword is used to declare a local variable in Lua?',
        options: ['local', 'var', 'let', 'int'],
        answer: 0
    },
    {
        question: '(Lua) What index does Lua start counting at?',
        options: ['0', '1', '-1', 'It depends'],
        answer: 1
    },
    {
        question: '(Python) How do you define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        answer: 1
    },
    {
        question: '(Python) What operator is used for floor division in Python?',
        options: ['/', '//', '%', '**'],
        answer: 1
    },
    {
        question: '(JavaScript) How do you print to console in JS?',
        options: ['console.log()', 'print()', 'echo', 'System.out.println()'],
        answer: 0
    },
    {
        question: '(JavaScript) How do you write an arrow function?',
        options: ['function=>{}', '()=>{}', '=>function(){}', 'func=>()'],
        answer: 1
    },
    {
        question: '(C++) What header is needed for cout?',
        options: ['stdio.h', 'iostream', 'fstream', 'string'],
        answer: 1
    },
    {
        question: '(C++) Which operator is used for dynamic memory allocation?',
        options: ['alloc', 'malloc', 'new', 'create'],
        answer: 2
    },
    {
        question: '(Java) What is the entry point of a Java program?',
        options: ['public static void main(String[] args)', 'int main()', 'void start()', 'public void run()'],
        answer: 0
    },
    {
        question: '(Java) Which keyword is used to inherit a class?',
        options: ['extends', 'implements', 'inherits', 'super'],
        answer: 0
    },
    {
        question: '(C) What function prints to stdout in C?',
        options: ['cout', 'print', 'printf', 'echo'],
        answer: 2
    },
    {
        question: '(C) What symbol is used for pointers?',
        options: ['&', '*', '#', '@'],
        answer: 1
    },
    {
        question: '(Python) What are lists called in Python that cannot be changed?',
        options: ['arrays', 'tuples', 'sets', 'dicts'],
        answer: 1
    },
    {
        question: '(JavaScript) What does typeof null return?',
        options: ['null', 'undefined', 'object', 'boolean'],
        answer: 2
    },
    {
        question: '(C++) What keyword handles exceptions?',
        options: ['error', 'try', 'catch', 'both try and catch'],
        answer: 3
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let quizCompleted = false;

const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextQuestionBtn = document.getElementById('next-question');
const resultContainer = document.getElementById('result-container');
const scoreDisplay = document.getElementById('score-display');
const resultMessage = document.getElementById('result-message');
const answersReview = document.getElementById('answers-review');
const nextBtn = document.getElementById('next-btn');

function loadQuestion(index) {
    const q = questions[index];
    questionCounter.textContent = `Question ${index + 1} of ${questions.length}`;
    questionText.textContent = q.question;
    optionsContainer.innerHTML = '';
    nextQuestionBtn.style.display = 'none';

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${String.fromCharCode(65 + i)}) ${opt}`;
        btn.dataset.index = i;
        btn.addEventListener('click', () => selectOption(i));
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selected) {
    if (quizCompleted) return;

    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) {
            btn.classList.add('correct');
        } else if (i === selected && i !== q.answer) {
            btn.classList.add('wrong');
        }
    });

    userAnswers[currentQuestion] = selected;
    if (selected === q.answer) score++;

    nextQuestionBtn.style.display = 'block';
    if (currentQuestion === questions.length - 1) {
        nextQuestionBtn.textContent = 'See Results';
    }
}

nextQuestionBtn.addEventListener('click', () => {
    if (currentQuestion === questions.length - 1) {
        showResults();
    } else {
        currentQuestion++;
        loadQuestion(currentQuestion);
    }
});

function showResults() {
    quizCompleted = true;
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('title').style.display = 'none';
    resultContainer.style.display = 'block';
    nextBtn.style.display = 'inline-block';

    scoreDisplay.textContent = `${score} / ${questions.length}`;

    let msg = '';
    if (score === 15) msg = "Perfect! You're a coding master!";
    else if (score >= 12) msg = 'Great job! Almost perfect!';
    else if (score >= 8) msg = 'Good effort! Review the topics you missed.';
    else msg = 'Keep learning! Try reviewing the lessons again.';
    resultMessage.textContent = msg;

    answersReview.innerHTML = '';
    questions.forEach((q, i) => {
        const div = document.createElement('div');
        div.className = 'review-item';
        const userAns = userAnswers[i] !== undefined ? String.fromCharCode(65 + userAnswers[i]) : '(skipped)';
        const correctAns = String.fromCharCode(65 + q.answer);
        const isCorrect = userAnswers[i] === q.answer;
        div.classList.add(isCorrect ? 'correct' : 'wrong');
        div.textContent = `${i + 1}. ${q.question} — Your answer: ${userAns} | Correct: ${correctAns}`;
        answersReview.appendChild(div);
    });
}

nextBtn.addEventListener('click', () => {
    const user = localStorage.getItem('currentUser') || 'guest';
    const wrongCount = questions.length - score;
    const quizData = {
        score: score,
        total: questions.length,
        answers: questions.map((q, i) => ({
            correct: userAnswers[i] === q.answer,
            selected: userAnswers[i] !== undefined ? String.fromCharCode(65 + userAnswers[i]) : '(skipped)',
            correctAnswer: String.fromCharCode(65 + q.answer)
        })),
        wrongCount: wrongCount,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('quizResult_' + user, JSON.stringify(quizData));
    window.location.href = '../Contact/contact.html';
});

loadQuestion(0);
