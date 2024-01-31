// Establish a connection to the server using Server-Sent Events (SSE)
new window.EventSource('/sse').onmessage = function (event) {
    // When a message is received through SSE, append it to the HTML element with id 'messages'
    window.messages.innerHTML += `<p>${event.data}</p>`;
}

// Add an event listener to the form for handling submission
window.form.addEventListener('submit', function (evt) {
    // Prevent the default form submission behavior
    evt.preventDefault();

    // Send a GET request to the server's '/chat' endpoint with the message from the input field
    window.fetch(`/chat?message=${window.input.value}`);

    // Reset the value of the input field to an empty string after submitting
    window.input.value = '';
});
