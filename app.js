let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    const installBtn = document.getElementById('installBtn');

    // Detect if device is iOS
    if (!isIos()) {
        installBtn.style.display = 'block';
    }

    installBtn.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            // Clear the deferredPrompt so it can be garbage collected
            deferredPrompt = null;
        });
    });
});

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
        console.log('Service Worker registration failed:', error);
    });
}

// Detect iOS
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

// Detect if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

if (isIos() && !isInStandaloneMode()) {
    const iosPopup = document.getElementById('iosPopup');
    const overlay = document.getElementById('overlay');
    iosPopup.style.display = 'block';
    overlay.style.display = 'block';

    document.getElementById('closePopup').addEventListener('click', () => {
        iosPopup.style.display = 'none';
        overlay.style.display = 'none';
    });
} else if (!isIos()) {
    const installBtn = document.getElementById('installBtn');
    installBtn.style.display = 'block';
}
