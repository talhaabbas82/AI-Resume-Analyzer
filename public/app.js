

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

    
//     const API = "http://localhost:3000/job";
// const token = localStorage.getItem("token");

// // Redirect if no token
// if (!token) window.location.href = "login.html";

// let updateId = "";

// // DOM Elements
// const company = document.getElementById("company");
// const position = document.getElementById("position");
// const jobDescription = document.getElementById("jobDescription");
// const status = document.getElementById("status");
// const notes = document.getElementById("notes");

// const u_company = document.getElementById("u_company");
// const u_position = document.getElementById("u_position");
// const u_jobDescription = document.getElementById("u_jobDescription");
// const u_status = document.getElementById("u_status");
// const u_notes = document.getElementById("u_notes");

// function openAddModal() {
//   document.getElementById("addModal").style.display = "flex";
// }
// function closeAddModal() {
//   document.getElementById("addModal").style.display = "none";
// }

// function openUpdateModal() {
//   document.getElementById("updateModal").style.display = "flex";
// }
// function closeUpdateModal() {
//   document.getElementById("updateModal").style.display = "none";
// }

// /* ADD JOB */
// async function addJob() {
//   try {
//     const data = {
//       company: company.value,
//       position: position.value,
//       jobDescription: jobDescription.value,
//       status: status.value,
//       notes: notes.value,
//     };

//     await axios.post(API + "/add", data, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     closeAddModal();
//     loadJobs();
//   } catch (err) {
//     alert("Failed to add job.");
//   }
// }

// /* LOAD JOBS */
// async function loadJobs() {
//   try {
//     const res = await axios.get(API + "/all", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const jobs = res.data.jobs;
//     let rows = "";

//     jobs.forEach(job => {
//       rows += `
//       <tr>
//         <td>${job.company}</td>
//         <td>${job.position}</td>
//         <td>${job.status}</td>
//         <td>
//           <button onclick="openUpdate('${job._id}','${job.company}','${job.position}','${job.jobDescription}','${job.status}','${job.notes}')">Edit</button>
//           <button onclick="deleteJob('${job._id}')">Delete</button>
//         </td>
//       </tr>`;
//     });

//     document.getElementById("jobTable").innerHTML = rows;
//   } catch (err) {
//     alert("Failed to load jobs.");
//   }
// }

// /* DELETE */
// async function deleteJob(id) {
//   if (!confirm("Delete this job?")) return;

//   await axios.delete(API + "/delete/" + id, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   loadJobs();
// }

// /* OPEN UPDATE */
// function openUpdate(id, c, p, d, s, n) {
//   updateId = id;

//   u_company.value = c;
//   u_position.value = p;
//   u_jobDescription.value = d;
//   u_status.value = s;
//   u_notes.value = n;

//   openUpdateModal();
// }

// /* SAVE UPDATE */
// async function saveUpdate() {
//   try {
//     const data = {
//       company: u_company.value,
//       position: u_position.value,
//       jobDescription: u_jobDescription.value,
//       status: u_status.value,
//       notes: u_notes.value,
//     };

//     await axios.put(API + "/update/" + updateId, data, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     closeUpdateModal();
//     loadJobs();
//   } catch (err) {
//     alert("Update failed!");
//   }
// }

// loadJobs();

// async function loadUser() {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Login Required!");
//     window.location.href = "login.html";
//     return;
//   }

//   try {
//     const response = await axios.get("http://localhost:3000/home", {
//       headers: { Authorization: "Bearer " + token }
//     });

//     document.getElementById("welcomeMsg").innerText = response.data.message;

//   } catch (error) {
//     alert("Session expired, please login again!");
//     localStorage.removeItem("token");
//     window.location.href = "login.html";
//   }
// }

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

loadUser();

// frontend/app.js

// const uploadCV = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const fileInput = document.getElementById("pdfInput");
//     const file = fileInput.files[0];

//     if (!file) {
//       alert("Please upload a PDF file first!");
//       return;
//     }

//     const formdata = new FormData();
//     formdata.append("file", file); // ✅ multer key must be "file"

//     const response = await axios.post(
//       "http://localhost:3000/api/upload", // ✅ tumhara backend route
//       formdata,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     const aiResponseData = response.data.analysis;
//     console.log("RAW AI:", aiResponseData);

//     // ✅ Clean ```json ``` wrapper
//     let clean = aiResponseData.replace(/```json|```/g, "").trim();

//     let parsed;
//     try {
//       parsed = JSON.parse(clean);
//     } catch (err) {
//       console.error("JSON Parse Error:", err);
//       alert("AI response valid JSON format mein nahi hai");
//       return;
//     }

//     // ✅ Resume Score & ATS Score
//     document.querySelectorAll(".score span")[0].innerText =
//       parsed["Resume Score"] || "N/A";

//     document.querySelectorAll(".score span")[1].innerText =
//       parsed["ATS Score"] || "N/A";

//     // ✅ Suggestions
//     const suggestionList = document.querySelector(".result-box ul");
//     suggestionList.innerHTML = "";

//     if (Array.isArray(parsed["Suggestions"])) {
//       parsed["Suggestions"].forEach((item) => {
//         const li = document.createElement("li");
//         li.textContent = item.replace(/\*/g, "");
//         suggestionList.appendChild(li);
//       });
//     } else {
//       suggestionList.innerHTML = "<li>No suggestions found</li>";
//     }

//     // ✅ Corrected Resume Text
//     document.querySelector(".corrected-resume").innerText =
//       parsed["Corrected Resume"] || "No corrected resume received";

//     alert("✅ Resume Successfully Analyzed!");

//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);
//     alert("❌ Resume upload failed");
//   }
// };


// const uploadCV = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const fileInput = document.getElementById("fileinput");
//     const file = fileInput.files[0];
//     if (!file) {
//       alert("Please select a file!");
//       return;
//     }
//     const formdata = new FormData();
//     formdata.append("file", file);
//     const jobdes = window.jobDescription;
//     console.log("JObWala", jobdes);
//     const response = await axios.post(
//       "http://localhost:3000/api/upload",
//       formdata,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     const aiResponseData = response.data.analysis;
//     let clean = aiResponseData.replace(/```json|```/g, "").trim();
//     let parsed = JSON.parse(clean);
//     console.log(parsed);
//     document.getElementById("ats").innerText = parsed["ATS Score"];
//     document.getElementById("resumescore").innerText = parsed["Resume Score"];
//     // missing Skills
//     const missing = document.getElementById("missing");
//     missing.innerHTML = "";
//     parsed["Missing Skills"].forEach((skills) => {
//       skills = skills.replace(/\*/g, "");
//       const heading = document.createElement("h1");
//       const li = document.createElement("li");
//       li.textContent = skills;
//       heading.textContent = "Missing Skills:";
//       missing.appendChild(heading);
//       missing.appendChild(li);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };


// const uploadCV = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const fileInput = document.getElementById("fileinput");
//     const file = fileInput.files[0];
//     if (!file) {
//       alert("Please select a file!");
//       return;
//     }
//     const formdata = new FormData();
//     formdata.append("file", file);
//     const jobdes = window.jobDescription;
//     console.log("JObWala", jobdes);
//     const response = await axios.post(
//       "http://localhost:3000/api/upload",
//       formdata,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     const aiResponseData = response.data.analysis;
//     let clean = aiResponseData.replace(/```json|```/g, "").trim();
//     let parsed = JSON.parse(clean);
//     console.log(parsed);
//     document.getElementById("ats").innerText = parsed["ATS Score"];
//     document.getElementById("resumescore").innerText = parsed["Resume Score"];
//     // missing Skills
//     const missing = document.getElementById("missing");
//     missing.innerHTML = "";
//     parsed["Missing Skills"].forEach((skills) => {
//       skills = skills.replace(/\*/g, "");
//       const heading = document.createElement("h1");
//       const li = document.createElement("li");
//       li.textContent = skills;
//       heading.textContent = "Missing Skills:";
//       missing.appendChild(heading);
//       missing.appendChild(li);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

window.jobDescription = "Frontend Developer"; // Test ke liye
document.getElementById("selectedJob").innerText = window.jobDescription;


const uploadCV = async () => {
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
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const aiResponseData = response.data.analysis;
    let clean = aiResponseData.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("JSON Parse Error:", err, clean);
      alert("AI ka response valid JSON nahi hai");
      return;
    }

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
