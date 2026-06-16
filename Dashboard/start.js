const loggedInUser = localStorage.getItem('currentUser');

if (!loggedInUser || localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = '../Sign Up and Sign in/ue.html';
} else {
  const userDisplay = document.getElementById('user-display');
  if (userDisplay) {
    userDisplay.textContent = 'Logged in as ' + loggedInUser;
  }

  const langPaths = {
    Lua: '../Lua/lua.html',
    Python: '../Python/python.html',
    JavaScript: '../JavaScript/js.html',
    'C++': '../C++/cpp.html',
    Java: '../Java/java.html',
    C: '../C/c.html',
  };

  const progressKey = 'progress_' + loggedInUser;
  const saved = localStorage.getItem(progressKey);
  if (saved) {
    try {
      const progress = JSON.parse(saved);
      const btn = document.getElementById('continue-btn');
      if (btn) {
        const lang =
          progress.language || progress.currentLanguage || progress.lang;
        const lesson =
          progress.lesson || progress.currentLesson || progress.lessonNumber;
        const path = langPaths[lang];
        if (path) {
          btn.textContent = '▶ Continue: ' + lang + ' (Lesson ' + lesson + ')';
          btn.style.display = '';
          btn.addEventListener('click', () => {
            window.location.href = path;
          });
        }
      }
    } catch (_) {}
  }
}

document.getElementById('deleteAcc').addEventListener('click', () => {
  if (confirm('Are you sure you want to permanently delete your account?')) {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const updated = accounts.filter(a => a.username !== loggedInUser);
    localStorage.setItem('accounts', JSON.stringify(updated));
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../Sign Up and Sign in/ue.html';
  }
});

document.getElementById('start').addEventListener('click', () => {
  window.location.href = '../Lua/lua.html';
});
