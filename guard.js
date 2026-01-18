function getCurrentUser() {
  return (
    localStorage.getItem("currentUser") ||
    sessionStorage.getItem("currentUser")
  );
}

// Block access if not logged in
if (!getCurrentUser()) {
  window.location.href = "login.html";
}

// how logged-in user
document.getElementById("user").textContent = getCurrentUser();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
  window.location.href = "login.html";
});
