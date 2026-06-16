function getAccounts() {
    return JSON.parse(localStorage.getItem('accounts') || '[]');
}

function saveAccounts(accounts) {
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

document.getElementById('admin-btn').addEventListener('click', () => {
    window.location.href = 'admin.html';
});

document.getElementById('signup-btn').addEventListener('click', () => {
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-password').value.trim();

    if (user === '' || pass === '') {
        showAlert('Please enter both a username and password!', false);
        return;
    }

    const banned = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    if (banned.includes(user)) {
        showAlert('This username is banned from the website.', false);
        return;
    }

    const accounts = getAccounts();
    if (accounts.length >= 5) {
        showAlert('Max 5 accounts reached!', false);
        return;
    }

    if (accounts.find(a => a.username === user)) {
        showAlert('Username already taken!', false);
        return;
    }

    accounts.push({ username: user, password: pass });
    saveAccounts(accounts);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', user);

    showAlert('Boom! Signed up successfully. Redirecting...', true);
    setTimeout(() => {
        window.location.href = '../Dashboard/dashboard.html';
    }, 500);
});

document.getElementById('login-btn').addEventListener('click', () => {
    const loginUser = document.getElementById('login-username').value.trim();
    const loginPass = document.getElementById('login-password').value.trim();

    const banned = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    if (banned.includes(loginUser)) {
        showAlert('This account has been banned from the website.', false);
        return;
    }

    const accounts = getAccounts();
    const match = accounts.find(a => a.username === loginUser && a.password === loginPass);

    if (match) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', loginUser);
        showAlert('Login successful! Redirecting...', true);
        setTimeout(() => {
            window.location.href = '../Dashboard/dashboard.html';
        }, 500);
    } else {
        showAlert('Invalid username or password!', false);
    }
});

function showAlert(message, isSuccess = true) {
    const alertBox = document.getElementById('custom-alert');
    const alertText = document.getElementById('alert-text');
    alertText.innerText = message;
    alertBox.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
    alertBox.classList.add('show');
    setTimeout(() => alertBox.classList.remove('show'), 3000);
}