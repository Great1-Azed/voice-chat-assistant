if ('speechSynthesis' in window) {
    const textToRead = document.querySelector('main').textContent;

    // Create a function to start reading
    function startReading() {
        const speech = new SpeechSynthesisUtterance(textToRead);
        speech.lang = 'en-US';
        window.speechSynthesis.speak(speech);
    }

    // Start reading when the page finishes loading
    window.addEventListener('load', startReading);
} else {
    // Speech synthesis not supported
    console.log("Speech synthesis not supported.");
}