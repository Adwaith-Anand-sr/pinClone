function scrollToBottom() {
   
   const chatList = document.querySelector('.chatSection');
   chatList.scrollTop = chatList.scrollHeight;
}

window.onload = scrollToBottom;

// dynamic files uploading
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
   event.preventDefault();
   const formData = new FormData(event.target);
   try {
      const response = await fetch('/upload', {
         method: 'POST',
         body: formData
      });
      if (response.ok) {
         console.log('Post uploaded successfully');
         window.location.href = '/profile'; 
      } else {
         console.error('Error uploading image:', response.statusText);
      }
   } catch (error) {
      console.error('Error uploading image:', error);
   }
});

// controll over arrow back buttons
function goBack() {
   window.history.back();
}

function openChat(userId) {
   var xhr = new XMLHttpRequest();
   // Configure the request
   xhr.open("GET", "/message/chat/" + userId);
   
   // Set the response type
   xhr.responseType = "json";
   
   // Define what happens on successful response
   xhr.onload = function() {
      if (xhr.status === 200) {
         // Redirect to the chat page
         window.location.href = `/message/chat/${userId}`;
      }
   };
   
   // Send the request
   xhr.send();
}


function bubbleNotify(value) {
   (value<=10) ? document.getElementById("bubbleNotify").textContent = value : document.getElementById("bubbleNotify").textContent = "10+"
   notify.classList.add("bg-green-400")
}