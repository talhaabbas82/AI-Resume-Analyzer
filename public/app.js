async function Signup(e) {
  try {
    e.preventDefault();

    const name = document.getElementById("Name").value.trim();
    const userName = document.getElementById("userName").value.trim();
    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value.trim();

    // Validation
    if (!name || !userName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address!");
      return;
    }

    const response = await axios.post("http://localhost:3000/Signup", {
      Name: name,
      userName: userName,
      Email: email,
      Password: password
    });

    const data = response.data;
    console.log(data);

    if (data.status === 505) {
      alert(data.message);
      return;
    }

    if (data.status === 200) {
      alert(data.message);
      window.location.href = "login.html";
    }

  } catch (error) {
    console.log(error);
    alert("Not working");
  }
}


async function Login(e) {
  try {
    e.preventDefault();

    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const response = await axios.post("http://localhost:3000/Login", {
      Email: email,
      Password: password
    });

    const data = response.data;

    if (data.status === 404 || data.status === 401) {
      alert(data.message);
      return;
    }

    if (data.status === 200) {

      // ⭐⭐ SAVE JWT TOKEN ⭐⭐
      localStorage.setItem("token", data.token);

      alert(data.message);
      window.location.href = "dashboard.html";
    }

  } catch (error) {
    alert("Login Failed");
  }
}
