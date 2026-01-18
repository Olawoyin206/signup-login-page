// ===============================
// UTILITIES
// ===============================
function hashPassword(password) {
  return btoa(password); // simple learning hash
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(username, remember) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("currentUser", username);
}

function getCurrentUser() {
  return (
    localStorage.getItem("currentUser") ||
    sessionStorage.getItem("currentUser")
  );
}

// ===============================
// FAKE BACKEND FUNCTIONS
// ===============================
function fakeSignup(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!username || !password) {
        reject("All fields are required");
        return;
      }

      const users = getUsers();
      if (users.some(u => u.username === username)) {
        reject("Username already exists");
        return;
      }

      users.push({
        username,
        password: hashPassword(password)
      });

      saveUsers(users);
      resolve("Signup successful! You can login now.");
    }, 2000);
  });
}

function fakeLogin(username, password, remember) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const hashed = hashPassword(password);

      const user = users.find(
        u => u.username === username && u.password === hashed
      );

      if (!user) {
        reject("Invalid username or password");
      } else {
        setCurrentUser(username, remember);
        resolve("Login successful");
      }
    }, 2000);
  });
}

// ===============================
// UI ELEMENTS
// ===============================
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const spinner = document.getElementById("spinner");
const message = document.getElementById("message");

// ===============================
// UI HELPERS
// ===============================
function setLoading(state) {
  spinner?.classList.toggle("hidden", !state);
  signupBtn && (signupBtn.disabled = state);
  loginBtn && (loginBtn.disabled = state);
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

// ===============================
// SIGNUP HANDLER
// ===============================
signupBtn?.addEventListener("click", async () => {
  const username = signupUser.value.trim();
  const password = signupPass.value.trim();

  if (!username || !password) {
    showMessage("All fields required", "error");
    return;
  }

  setLoading(true);
  showMessage("", "");

  try {
    const res = await fakeSignup(username, password);
    window.location.href = "login.html";
    showMessage(res, "success");
  } catch (err) {
    showMessage(err, "error");
  } finally {
    setLoading(false);
  }
});

// ===============================
// LOGIN HANDLER
// ===============================
loginBtn?.addEventListener("click", async () => {
  const username = loginUser.value.trim();
  const password = loginPass.value.trim();
  const remember = rememberMe?.checked;

  if (!username || !password) {
    showMessage("All fields required", "error");
    return;
  }

  setLoading(true);
  showMessage("", "");

  try {
    await fakeLogin(username, password, remember);
    window.location.href = "dashboard.html";
  } catch (err) {
    showMessage(err, "error");
  } finally {
    setLoading(false);
  }
});
