const paragraphs = [
    document.getElementById('p1'),
    document.getElementById('p2'),
    document.getElementById('p3'),
    document.getElementById('p4'),
    document.getElementById('p5'),
    document.getElementById('p6'),
    document.getElementById('p7'),
    document.getElementById('p8'),
    document.getElementById('p9'),
    document.getElementById('p10')
];
const title = document.getElementById('title');
const templateButton = document.getElementById('view-code');
const editor = document.getElementById('editor');
const editorView = document.getElementById('editor-view');
const outputLog = document.getElementById('outputLog');
const codeTextarea = document.getElementById('code');
const runButton = document.getElementById('run');
const nextBtn = document.getElementById('next-btn');

let lastViewedIndex = null;
const clonedButtons = [];
const checkboxWrappers = [];

function createCheckboxWrapper(index) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('checkbox-wrapper');

    const timer = document.createElement('span');
    timer.classList.add('checkbox-timer');
    timer.textContent = '5';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.disabled = true;
    checkbox.classList.add('read-checkbox');

    const label = document.createElement('span');
    label.classList.add('checkbox-label');
    label.textContent = 'I have read the sentence and I want to view the code';

    wrapper.appendChild(timer);
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    let seconds = 5;
    const interval = setInterval(() => {
        seconds--;
        timer.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(interval);
            timer.style.display = 'none';
            checkbox.disabled = false;
        }
    }, 1000);

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            const btn = clonedButtons[index];
            btn.classList.remove('locked');
            btn.disabled = false;
            btn.textContent = 'View Code';
            btn.classList.add('unlock-animation');
            setTimeout(() => btn.classList.remove('unlock-animation'), 1000);
            wrapper.style.display = 'none';
        }
    });

    return wrapper;
}

function unlockNext() {
    if (lastViewedIndex !== null && lastViewedIndex + 1 < paragraphs.length) {
        const nextP = paragraphs[lastViewedIndex + 1];
        const nextBtn = clonedButtons[lastViewedIndex + 1];

        if (nextBtn.classList.contains('locked')) {
            nextP.classList.add('fly-up');
            setTimeout(() => {
                nextP.classList.remove('fly-up');
                nextP.textContent = nextP.dataset.realText;
                nextP.classList.add('drop-down');
                setTimeout(() => {
                    nextP.classList.remove('drop-down');
                    nextP.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 600);
            }, 400);

            if (!checkboxWrappers[lastViewedIndex + 1]) {
                const wrapper = createCheckboxWrapper(lastViewedIndex + 1);
                nextBtn.insertAdjacentElement('afterend', wrapper);
                checkboxWrappers[lastViewedIndex + 1] = wrapper;
            }
        }
    }
    if (lastViewedIndex !== null && lastViewedIndex >= paragraphs.length - 1) {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Next: C →';
        nextBtn.classList.add('next-unlock-animation');
        setTimeout(() => nextBtn.classList.remove('next-unlock-animation'), 1000);
    }
}

function editorFunction(onEditortf) {
    const allClonedButtons = document.querySelectorAll('.code-btn');
    const allWrappers = document.querySelectorAll('.checkbox-wrapper');

    if (onEditortf === true) {
        title.style.display = 'none';
        paragraphs.forEach(p => p.style.display = 'none');
        allClonedButtons.forEach(btn => btn.style.display = 'none');
        allWrappers.forEach(w => w.style.display = 'none');
        nextBtn.style.display = 'none';
        editor.textContent = 'Home';
        editorView.style.display = 'flex';
    } else {
        unlockNext();

        title.style.display = 'block';
        paragraphs.forEach(p => p.style.display = 'block');
        allClonedButtons.forEach(btn => btn.style.display = 'block');
        allWrappers.forEach(w => {
            if (w) w.style.display = 'flex';
        });
        nextBtn.style.display = 'block';
        editor.textContent = 'Editor';
        editorView.style.display = 'none';
    }
}

let onEditor = false;

paragraphs.forEach((p, index) => {
    if (templateButton) {
        const clonedButton = templateButton.cloneNode(true);
        clonedButton.removeAttribute('id');
        clonedButton.classList.add('code-btn');
        clonedButton.style.display = 'block';

        clonedButton.classList.add('locked');
        clonedButton.disabled = true;
        clonedButton.textContent = '\u{1F512} Locked';

        clonedButton.addEventListener('click', () => {
            if (clonedButton.classList.contains('locked')) return;
            lastViewedIndex = index;
            onEditor = true;
            editorFunction(onEditor);
            if (codeTextarea.value.trim() !== '') {
                const confirmed = confirm("You have code in the editor, do you want to replace it?");
                if (confirmed) {
                    codeTextarea.value = p.dataset.code;
                }
            } else {
                codeTextarea.value = p.dataset.code;
            }
        });

        p.insertAdjacentElement('afterend', clonedButton);
        clonedButtons.push(clonedButton);
    }
});

if (templateButton) {
    templateButton.remove();
}

const firstWrapper = createCheckboxWrapper(0);
clonedButtons[0].insertAdjacentElement('afterend', firstWrapper);
checkboxWrappers[0] = firstWrapper;

editor.addEventListener('click', () => {
    onEditor = !onEditor;
    editorFunction(onEditor);
    outputLog.textContent = "";
});

if (runButton && codeTextarea && outputLog) {
    runButton.addEventListener('click', async () => {
        outputLog.textContent = "";
        outputLog.textContent = "Java cannot run in the browser. This editor shows code examples for learning purposes.";
    });
}

nextBtn.addEventListener('click', () => {
    if (nextBtn.disabled) return;
    window.location.href = '../C/c.html';
});

const saveProgressBtn = document.getElementById('save-progress');
if (saveProgressBtn) {
    saveProgressBtn.addEventListener('click', () => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            localStorage.setItem(`progress_${currentUser}`, JSON.stringify({
                language: "Java",
                lesson: lastViewedIndex
            }));
            saveProgressBtn.textContent = 'Saved!';
            setTimeout(() => {
                saveProgressBtn.textContent = '💾 Save Progress';
            }, 2000);
        }
    });
}
