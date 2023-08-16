// collect DOMs
const display = document.querySelector('.display')
const controllerWrapper = document.querySelector('.controllers')

const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = ''

// mediaRecorder setup for audio
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    console.log('mediaDevices supported..')

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/flac' });
     chunks = []
            sendAudioToServer(blob);
            audioURL = window.URL.createObjectURL(blob)
            document.querySelector('audio').src = audioURL
            console.log (audioURL)
        }
    }).catch(error => {
        console.log('Following error has occured : ',error)
    })
}else{
    stateIndex = ''
    application(stateIndex)
}

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const record = () => {
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const stopRecording = () => {
    stateIndex = 2
    mediaRecorder.stop()
    application(stateIndex)
}

const downloadAudio = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    downloadLink.setAttribute('download', 'audio')
    downloadLink.click()
}

const addButton = (id, funString, text) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.classList.add("screenButton");
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    controllerWrapper.append(btn)
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    display.append(audio)
}

const application = (index) => {
    switch (State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()

            addButton('record', 'record()', 'Start Recording')
            break;

        case 'Record':
            clearDisplay()
            clearControls()
            addMessage('Recording...')
            addButton('stop', 'stopRecording()', 'Stop Recording')
            break

        case 'Download':
            clearControls()
            clearDisplay()

            addAudio()
            addButton('record', 'record()', 'Record Again')
            break

        default:
            clearControls()
            clearDisplay()

            addMessage('Your browser does not support mediaDevices')
            break;
    }

}

application(stateIndex)

const sendAudioToServer = async (blob) => {
  try {
    // Convert the Blob to an ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // Initialize lamejs MP3 encoder
    const mp3Encoder = new lamejs.Mp3Encoder(2, 44100, 128);

    // Encode the WAV data to MP3
    const samples = new Int16Array(arrayBuffer);
    const mp3Data = mp3Encoder.encodeBuffer(samples);

    // Create a Blob from the MP3 data
    const mp3Blob = new Blob([mp3Data], { type: 'audio/mp3' });

    // Create a new FormData to send the MP3 Blob
    const formData = new FormData();
    formData.append('audio', mp3Blob, 'recording.mp3');
    formData.append('csrfmiddlewaretoken', csrfToken);

    // Replace with the actual server endpoint for audio upload
    const response = await fetch('/upload-audio', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // Voiceover the success message
      voiceOver("Please wait");
      
      // Assuming you want to reload the page after successful upload
      location.reload();
    } else {
      // Handle non-OK response (e.g., 4xx, 5xx)
      throw new Error('Request failed with status: ' + response.status);
    }
  } catch (error) {
    console.log('Error sending audio:', error);
    // Voiceover the error message
    voiceOver("Sorry, there was an error processing your request. " + 
              (error.message || "The server did not accept your request"));
  }
};

// const sendAudioToServer = (blob) => {
//     const formData = new FormData();
//     formData.append('audio', blob, 'recording.flac');
//     formData.append('csrfmiddlewaretoken', csrfToken);
  
//     // Replace with the actual server endpoint for audio upload
//     fetch('/upload-audio', {
//       method: 'POST',
//       body: formData,
//     })
//     .then(response => {
//       if (response.ok) {
//         // Voiceover the success message
//         voiceOver("Please wait");
//       } else {
//         // Handle non-OK response (e.g., 4xx, 5xx)
//         throw new Error('Request failed with status: ' + response.status);
//       }
//       return response.text();
//     })
//     .then(data => {
//       // Reload the entire screen with the server's response
//       document.open();
//       document.write(data);
//       document.close();
//     })
//     .catch(error => {
//       console.log('Error sending audio:', error);
//       // Voiceover the error message
//       voiceOver("Sorry, there was an error processing your request. " + 
//                 (error.message || "The server did not accept your request"));
//     });
//   };
  
  
  
  // Function to trigger voiceover
  const voiceOver = (message) => {
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
  

function readParagraph() {
    // Get the paragraph element you want to read
    const paragraph = document.getElementById('welcome');
    
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
      voiceOver('Your browser does not support the Web Speech API.')
    }
  }


  
  // Call the readParagraph function when the page loads
  window.addEventListener('load', readParagraph);
  
  

  