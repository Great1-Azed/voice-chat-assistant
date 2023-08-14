function voicePage(id) {
    // Get the paragraph element you want to read
    const paragraph = document.getElementById(id);
    
    // Check if the browser supports the Web Speech API
    if ('speechSynthesis' in window && paragraph) {
      // Create a SpeechSynthesisUtterance object
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = paragraph.innerText;
  
      // Attempt to speak the paragraph after a short delay
      setTimeout(function() {
        window.speechSynthesis.speak(utterance);
      }, 1000); // 1-second delay
  
      // Handle speech start and end events
      utterance.onstart = function(event) {
        console.log('Speech started.');
      };
      utterance.onend = function(event) {
        console.log('Speech ended.');
      };
    } else {
      console.log('Your browser does not support the Web Speech API.');
      voiceOver0('Your browser does not support the Web Speech API.')
    }
  }

  // Function to trigger voiceover
  const voiceOver0 = (message) => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = message;
  
    // Speak the message
    window.speechSynthesis.speak(utterance);
  
    // Listen for the end of the speech
    utterance.onend = () => {
      console.log('Voiceover completed.');
      // You can perform additional actions here after the voiceover completes.
    };
  };