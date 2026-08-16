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

function handleAuthResponse(res) {
  if (!res) return false;
  if (res.status === 401 || res.status === 403) {
    clearToken();
    window.location.href = '/yencodetechnologies/login';
    return true;
  }
  return false;
}

// make available globally for static pages
window.getToken = getToken;
window.setToken = setToken;
window.clearToken = clearToken;
window.getAccount = getAccount;
window.setAccount = setAccount;
window.logout = logout;
window.requireAuthOrRedirect = requireAuthOrRedirect;
window.handleAuthResponse = handleAuthResponse;
