document.getElementById('copy-link').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        const btn = document.getElementById('copy-link');
        const orig = btn.textContent;
        btn.textContent = '✅ Link copied!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
    } catch {
        const btn = document.getElementById('copy-link');
        const orig = btn.textContent;
        btn.textContent = '❌ Failed to copy';
        setTimeout(() => { btn.textContent = orig; }, 2000);
    }
});

document.getElementById('share-email').addEventListener('click', () => {
    window.location.href = 'mailto:?subject=Check out this Coding Guide&body=I found this awesome coding tutorial and wanted to share it with you! Check it out here: ' + encodeURIComponent(window.location.href);
});

document.getElementById('share-twitter').addEventListener('click', () => {
    const text = encodeURIComponent('Check out this Coding Guide! I just finished the quiz and it was awesome. Start learning here: ');
    window.open(`https://twitter.com/intent/tweet?text=${text}${encodeURIComponent(window.location.href)}`, '_blank');
});

document.getElementById('send-feedback').addEventListener('click', () => {
    document.getElementById('feedback-name').value = '';
    document.getElementById('feedback-email').value = '';
    document.getElementById('feedback-message').value = '';
    const status = document.getElementById('feedback-status');
    status.textContent = "Thanks for your feedback! We'll get back to you soon.";
    setTimeout(() => { status.textContent = ''; }, 4000);
});

document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = '../Dashboard/dashboard.html';
});
