const contentDiv = document.getElementById('root');

// Function to load content based on hash
function loadContent() {
    const hash = window.location.hash.slice(1); // Remove the '#' symbol
    let fileName = '';

    switch (hash) {
        case 'home':
            fileName = 'home.html';
            break;
        case 'about':
            fileName = 'about.html';
            break;
        case 'contact':
            fileName = 'contact.html';
            break;
        default:
            fileName = '404.html'; // Default to a 404 page if hash doesn't match
    }

    // Use AJAX to load the HTML content of the file
    const xhr = new XMLHttpRequest();
    xhr.open('GET', fileName, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            contentDiv.innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}

// Load content on initial page load and hash change
window.addEventListener('load', loadContent);
window.addEventListener('hashchange', loadContent);

  const menuClose = document.getElementById ('close')
  const popupMenu = document.getElementById ('popup')
  menuClose.addEventListener('click',() => {
    // popupMenu.style.display = 'none'

  })
  const userText = document.getElementById('usertext');

        userText.addEventListener('keydown', function (event) {
            // Allow vertical scrolling when holding down the Shift key and using the arrow keys
            if (event.key === 'ArrowUp' && event.shiftKey) {
                userText.scrollTop -= 10;
                event.preventDefault();
            } else if (event.key === 'ArrowDown' && event.shiftKey) {
                userText.scrollTop += 10;
                event.preventDefault();
            }
        });
