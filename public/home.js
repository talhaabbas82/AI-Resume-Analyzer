async function loadUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Login Required!");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await axios.get("http://localhost:3000/home", {
      headers: { Authorization: "Bearer " + token }
    });

    document.getElementById("welcomeMsg").innerText = response.data.message;

  } catch (error) {
    alert("Session expired, please login again!");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

loadUser();
