const ADMIN_EMAILS = ['josefdawsonbiler@gmail.com', 'thelittledevchannel@gmail.com'];
const ADMIN_PASSWORD = 'password-admin';
let isAdmin = false;
let pendingAdminEmail = '';

document.getElementById('submit-email').addEventListener('click', () => {
    const email = document.getElementById('admin-email').value.trim().toLowerCase();

    if (!email.includes('@')) {
        document.getElementById('email-status').textContent = 'Please enter a valid email address.';
        return;
    }

    if (ADMIN_EMAILS.includes(email)) {
        pendingAdminEmail = email;
        document.getElementById('password-section').style.display = 'block';
        document.getElementById('submit-email').style.display = 'none';
        document.getElementById('email-status').textContent = 'Enter the admin password.';
    } else {
        document.getElementById('email-status').textContent = "Thank you, we'll keep mind of your email so we can remember you at our future websites";
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
});

document.getElementById('submit-password').addEventListener('click', () => {
    const password = document.getElementById('admin-password').value.trim();

    if (password !== ADMIN_PASSWORD) {
        document.getElementById('email-status').textContent = 'Incorrect admin password.';
        return;
    }

    isAdmin = true;
    document.getElementById('email-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    setupAdminPanel();
});

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '../index.html';
});

function setupAdminPanel() {
    loadUserList();
    loadDataUserList();
    loadBanList();
}

function getAccounts() {
    return JSON.parse(localStorage.getItem('accounts') || '[]');
}

function getBannedUsers() {
    return JSON.parse(localStorage.getItem('bannedUsers') || '[]');
}

function saveBannedUsers(list) {
    localStorage.setItem('bannedUsers', JSON.stringify(list));
}

function loadBanList() {
    const status = document.getElementById('ban-status');
    const banned = getBannedUsers();
    if (banned.length > 0) {
        status.textContent = 'Currently banned: ' + banned.join(', ');
    }
}

function loadUserList() {
    const select = document.getElementById('user-list');
    const accounts = getAccounts();
    select.innerHTML = '';
    if (accounts.length === 0) {
        const opt = document.createElement('option');
        opt.textContent = 'No users registered';
        opt.disabled = true;
        select.appendChild(opt);
        return;
    }
    accounts.forEach(acc => {
        const opt = document.createElement('option');
        opt.value = acc.username;
        opt.textContent = acc.username;
        select.appendChild(opt);
    });
}

function loadDataUserList() {
    const select = document.getElementById('data-user-select');
    const accounts = getAccounts();
    select.innerHTML = '<option value="">-- Select user --</option>';
    accounts.forEach(acc => {
        const opt = document.createElement('option');
        opt.value = acc.username;
        opt.textContent = acc.username;
        select.appendChild(opt);
    });
}

document.getElementById('ban-btn').addEventListener('click', () => {
    const select = document.getElementById('user-list');
    const username = select.value;
    if (!username) return;

    const banned = getBannedUsers();
    if (banned.includes(username)) {
        document.getElementById('ban-status').textContent = username + ' is already banned.';
        return;
    }

    banned.push(username);
    saveBannedUsers(banned);
    document.getElementById('ban-status').textContent = username + ' has been banned from the website.';
    loadBanList();
});

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        const paths = {
            'Lua': '../Lua/lua.html',
            'Python': '../Python/python.html',
            'JavaScript': '../JavaScript/js.html',
            'C++': '../C++/cpp.html',
            'Java': '../Java/java.html',
            'C': '../C/c.html',
            'Quiz': '../Quiz/quiz.html'
        };
        if (paths[lang]) {
            window.location.href = paths[lang];
        }
    });
});

document.getElementById('go-quiz-btn').addEventListener('click', () => {
    window.location.href = '../Quiz/quiz.html';
});

document.getElementById('bypass-quiz-btn').addEventListener('click', () => {
    const user = localStorage.getItem('currentUser') || 'admin';
    const quizData = {
        score: 15,
        total: 15,
        answers: [],
        bypassed: true,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('quizResult_' + user, JSON.stringify(quizData));
    document.getElementById('quiz-bypass-status').textContent = 'Quiz marked as completed with a perfect score!';
});

document.getElementById('view-data-btn').addEventListener('click', () => {
    const username = document.getElementById('data-user-select').value;
    if (!username) return;

    let output = '=== User Data for: ' + username + ' ===\n\n';

    const progress = localStorage.getItem('progress_' + username);
    if (progress) {
        const p = JSON.parse(progress);
        output += 'Current Language: ' + (p.language || 'None') + '\n';
        output += 'Last Lesson: ' + (p.lesson !== undefined ? p.lesson : 'None') + '\n\n';
    } else {
        output += 'No progress saved.\n\n';
    }

    const quiz = localStorage.getItem('quizResult_' + username);
    if (quiz) {
        const q = JSON.parse(quiz);
        output += '=== Quiz Results ===\n';
        output += 'Score: ' + q.score + '/' + q.total + '\n';
        if (q.bypassed) {
            output += '(Bypassed by admin)\n';
        }
        if (q.answers && q.answers.length > 0) {
            output += '\nAnswers:\n';
            q.answers.forEach((a, i) => {
                const status = a.correct ? '✓' : '✗';
                output += '  Q' + (i + 1) + ': ' + status + ' (your answer: ' + a.selected + ', correct: ' + a.correctAnswer + ')\n';
            });
        }
        output += '\nWrong answers: ' + (q.wrongCount || 0) + '\n';
    } else {
        output += 'No quiz results.\n';
    }

    document.getElementById('user-data-display').textContent = output;
});
