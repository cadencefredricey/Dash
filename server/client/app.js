// client/app.js

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent page reload

  const formData = new FormData(registerForm);
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password')
  };

  try {
    const res = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      messageDiv.textContent = `✅ Registered: ${result.user.username}`;
    } else {
      messageDiv.textContent = `❌ ${result.error}`;
    }
  } catch (err) {
    messageDiv.textContent = `❌ Network error: ${err.message}`;
  }
});
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent page reload

  const formData = new FormData(loginForm);
  const data = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    const res = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      messageDiv.textContent = `✅ Login successful: ${result.user.username}`;
    } else {
      messageDiv.textContent = `❌ ${result.error}`;
    }
  } catch (err) {
    messageDiv.textContent = `❌ Network error: ${err.message}`;
  }
});
