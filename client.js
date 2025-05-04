document.addEventListener('DOMContentLoaded', () => {
  const socket = io({ path: '/socket.io/' });
  
  const messages = document.getElementById('messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message-input');
  
  const appendMessage = (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  };
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
      input.focus();
    }
  });
  
  socket.on('connect', () => {
    console.log('Connected to server');
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
    appendMessage('--- You have been disconnected ---');
  });
  
  socket.on('connect_error', (err) => {
    console.error('Connection Error:', err);
    appendMessage(`--- Connection failed: ${err.message} ---`);
  });
  
  
  socket.on('chat message', (msg) => {
    appendMessage(msg);
  });
});