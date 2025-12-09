

async function Signup(e) {
  e.preventDefault();

  const Name = document.getElementById("Name").value.trim();
  const userName = document.getElementById("userName").value.trim();
  const Email = document.getElementById("Email").value.trim();
  const Password = document.getElementById("Password").value.trim();

  if (!Name || !userName || !Email || !Password) {
    return alert("Please fill all fields");
  }

  try {
    const response = await axios.post("http://localhost:3000/api/Signup", {
      Name,
      userName,
      Email,
      Password,
    });

    if (response.status === 200) {
      alert("Signup successful!");
      window.location.href = "login.html";
    } else {
      alert(response.data.message);
    }
  } catch (err) {
    console.log(err);
    alert(err.response?.data?.message || "Signup failed!");
  }
}

 // login.js

async function Login(e) {
  e.preventDefault();

  const Email = document.getElementById("Email").value.trim();
  const Password = document.getElementById("Password").value.trim();

  if (!Email || !Password) {
    return alert("Please fill all fields");
  }

  try {
    const response = await axios.post("http://localhost:3000/api/Login", {
      Email,
      Password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert(response.data.message);
    }
  } catch (err) {
    console.log(err);
    alert(err.response?.data?.message || "Login failed!");
  }
}

    


function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}



window.jobDescription = "Frontend Developer"; // Test ke liye
document.getElementById("selectedJob").innerText = window.jobDescription;


   async function uploadCV() {
    
   
  try {
    const token = localStorage.getItem("token");
    const fileInput = document.getElementById("fileinput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file!");
      return;
    }

    const jobdes = window.jobDescription;

    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("jobDescription", jobdes); // ✅ MOST IMPORTANT FIX

    const response = await axios.post(
      "http://localhost:3000/api/upload",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const aiResponseData = response.data.analysis;
    let clean = aiResponseData.replace(/```json|```/g, "").trim();

    const parsed = response.data.analysis;


    document.getElementById("ats").innerText =
      parsed["ATS Score"] || "N/A";

    document.getElementById("resumescore").innerText =
      parsed["Resume Score"] || "N/A";

    const missing = document.getElementById("missing");
    missing.innerHTML = "";

    if (Array.isArray(parsed["Missing Skills"])) {
      parsed["Missing Skills"].forEach((skills) => {
        skills = skills.replace(/\*/g, "");
        const li = document.createElement("li");
        li.textContent = skills;
        missing.appendChild(li);
      });
    } else {
      missing.innerHTML = "<li>No Missing Skills Found</li>";
    }

    alert("✅ Resume Successfully Analyzed!");

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    alert("❌ Resume upload failed");
  }
};
