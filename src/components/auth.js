// Simple localStorage-based auth helpers shared across pages.

function getToken() {
  return localStorage.getItem('yencode_token');
}

function setToken(token) {
  localStorage.setItem('yencode_token', token);
}

function clearToken() {
  localStorage.removeItem('yencode_token');
  localStorage.removeItem('yencode_account');
}

function getAccount() {
  const raw = localStorage.getItem('yencode_account');
  return raw ? JSON.parse(raw) : null;
}

function setAccount(account) {
  localStorage.setItem('yencode_account', JSON.stringify(account));
}

function logout() {
  clearToken();
  window.location.href = '/yencodetechnologies/login';
}

// Redirect to login if there's no token. Call this at the top of protected pages.
function requireAuthOrRedirect() {
  if (!getToken()) {
    window.location.href = '/yencodetechnologies/login';
    return false;
  }
  return true;
}
