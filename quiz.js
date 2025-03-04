let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let playerName = '';

const questions = [
    {
        question: "Quelle est la principale différence entre un trou noir de Schwarzschild et un trou noir de Kerr ? 🕳️",
        answers: ["Un trou noir de Schwarzschild est non-rotatif", "Un trou noir de Kerr est non-rotatif", "Les deux sont identiques", "Je sais pas"],
        correct: "Un trou noir de Schwarzschild est non-rotatif"
    },
    {
        question: "Quelle est l'expression de l'effet de 'frame-dragging' ? 🌌",
        answers: ["r = 2GM/c²", "g = 0", "ds² = -c²dt² + (1 + 2GM/c²r)dr²", "ds² = -c²dt²"],
        correct: "ds² = -c²dt² + (1 + 2GM/c²r)dr²"
    },
    {
        question: "L'IA pourrait-elle détruire le monde de manière irréversiple ? ☠️",
        answers: ["Oui, si elle dépasse les contrôles humains", "Non, l'IA ne peut pas agir de manière autonome", "Oui, mais uniquement dans des simulations", "Non, elle n'a pas la capacité de détruire le monde"],
        correct: "Oui, si elle dépasse les contrôles humains"
    },
];

document.getElementById("name-form").addEventListener("submit", function(event) {
    event.preventDefault();
    playerName = document.getElementById("player-name").value.trim();
    if (playerName) {
        startQuiz();
    }
});

function startQuiz() {
    document.getElementById("name-form").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    loadQuestion();
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;
    
    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = '';
    
    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.onclick = () => checkAnswer(answer);
        answersContainer.appendChild(button);
    });

    startTimer();
}

function startTimer() {
    timeLeft = 30;
    document.getElementById("time-left").innerText = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById("time-left").innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

function checkAnswer(selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].correct;
    if (selectedAnswer === correctAnswer) {
        score++;
    }
    document.getElementById("next-button").style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        document.getElementById("next-button").style.display = "none";
    } else {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById("quiz").style.display = "none";
    document.getElementById("scoreboard").style.display = "block";

    if (playerName) {
        saveScore(playerName, score);
        loadScores();
    } else {
        alert("Le prénom n'a pas été fourni.");
    }
}

function saveScore(name, score) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "save_score.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`name=${encodeURIComponent(name)}&score=${score}`);
}

function loadScores() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "load_scores.php", true);
    xhr.onload = function() {
        const scores = JSON.parse(xhr.responseText);
        const scoresTableBody = document.querySelector("#scores-table tbody");
        scoresTableBody.innerHTML = '';
        scores.forEach(scoreData => {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            const scoreCell = document.createElement("td");
            nameCell.innerText = scoreData.name;
            scoreCell.innerText = scoreData.score;
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            scoresTableBody.appendChild(row);
        });
    };
    xhr.send();
}

document.getElementById("delete-scores-button").addEventListener("click", function() {
    if (confirm("Êtes-vous sûr de vouloir supprimer tous les scores ?")) {
        fetch("delete_scores.php", { method: "POST" })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Les scores ont été supprimés avec succès.");
                    loadScores(); 
                } else {
                    alert("Une erreur est survenue lors de la suppression des scores.");
                }
            })
            .catch(error => alert("Erreur de connexion : " + error.message));
    }
});
