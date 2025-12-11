


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
    const response = await axios.post(`https://ai-resume-analyzer-psi-lyart.vercel.app/api/Signup`, {
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
    const response = await axios.post(`https://ai-resume-analyzer-psi-lyart.vercel.app/api/Login`, {
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
  alert("Logged out successfully.");
  window.location.href = "login.html";
}


async function uploadCV() {
  const analyzeBtn = document.getElementById('analyzeBtn'); 

  // 1. Check Token
  const token = localStorage.getItem("token");
  if (!token) {
      alert("Authentication failed. Please log in again.");
      window.location.href = "login.html";
      return;
  }
  
  // 2. UI Loading State
  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
  }

  try {

    const fileInput = document.getElementById("fileinput");
    const file = fileInput.files[0];
    const jobdes = "GENERAL_CV_QUALITY_CHECK"; // Or get value from an input field if you have one

    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("jobDescription", jobdes); 

    // 3. API Call
    // Note: ensure this URL matches your actual backend URL (localhost vs vercel)
    const response = await axios.post("http://localhost:3000/api/upload",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      }
    );
    
    console.log("Server Response:", response.data); // Debugging

    // 4. Handle Data
    // Backend now sends { success: true, analysis: {Object} }
    const parsed = response.data.analysis; 
    
    if (!parsed) {
        throw new Error("No analysis data received.");
    }

    // 5. Update UI
    document.getElementById("ats").innerText = parsed["ATS Score"] || 0;
    document.getElementById("resumescore").innerText = parsed["Resume Score"] || 0;
    document.getElementById("matchPercentage").innerText = parsed["Match Percentage"] || 0; 
    
    // Update Corrected Resume Text
    const correctedSection = document.getElementById("correctedResumeText");
    if(correctedSection) {
        correctedSection.innerText = parsed["Corrected Resume"] || "No suggestions provided.";
    }

    // Update Missing Skills
    const missing = document.getElementById("missing");
    missing.innerHTML = "";

    if (Array.isArray(parsed["Missing Skills"]) && parsed["Missing Skills"].length > 0) {
      parsed["Missing Skills"].forEach((skill) => {
        const cleanSkill = skill.replace(/\*/g, "").trim();
        const li = document.createElement("li");
        li.textContent = cleanSkill;
        missing.appendChild(li);
      });
    } else {
      missing.innerHTML = "<li>No Critical Missing Skills Found</li>";
    }

    alert("✅ Resume Successfully Analyzed!");

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    const errorMessage = error.response?.data?.error || error.message || "Upload failed.";
    alert(`❌ ${errorMessage}`);
  } finally {
    // 6. Reset UI
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Selected Job';
    }
  }
}