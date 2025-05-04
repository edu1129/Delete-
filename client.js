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
    if (input.value && input.value.trim() !== '') {
      socket.emit('chat message', input.value.trim());
      input.value = '';
      input.focus();
    }
  });
  
  socket.on('connect', () => {
    console.log('Connected to chat server');
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from chat server');
    appendMessage('--- Server connection lost ---');
  });
  
  socket.on('connect_error', (err) => {
    console.error('Connection Error:', err);
    appendMessage(`--- Connection failed: ${err.message} ---`);
  });
  
  socket.on('chat message', (msg) => {
    appendMessage(msg);
  });
});