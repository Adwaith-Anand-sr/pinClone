function scrollToBottom() {
   const chatList = document.querySelector('.chatSection');
   const chat = document.querySelector('.chatSection .chats');
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






function goBack() {
   window.history.back() 
}
function clearNotify(){
   let bubbleNotify = document.querySelector(".bubbleContainer")
   bubbleNotify.innerHTML = ""
   let profileNotify = document.querySelector("nav .notify");
   profileNotify.classList.remove("bg-red-500");
}
function openChat(userId) { 
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "/message/chat/" + userId);
   xhr.responseType = "json";
   xhr.onload = function() {
      window.location.href = `/message/chat/${userId}`;
   }

   document.getElementById("chatLoader").style.display = "flex"
   // xhr.onreadystatechange = ()=>{
   //    if (xhr.readyState == 4) {
   //       setTimeout(()=>{
   //          document.getElementById("chatLoader").style.display = "none"
   //       }, 5000)
   //    }
   // }
   xhr.send();
}
function bubbleNotify(value) {
   (value<=10) ? document.getElementById("bubbleNotify").textContent = value : document.getElementById("bubbleNotify").textContent = "10+"
   notify.classList.add("bg-green-400")
}

