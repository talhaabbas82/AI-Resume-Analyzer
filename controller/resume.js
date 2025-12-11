
// const { GoogleGenAI } = require("@google/genai");
// const multer = require("multer");
// const path = require("path");
// const pdf = require("pdf-parse");
// const fs = require("fs");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve(__dirname, "../public/upload/"));
//   },
//   filename: (req, file, cb) => {
//     const newFileName = Date.now() + path.extname(file.originalname);
//     cb(null, newFileName);
//   },
// });
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 1024 * 1024 * 7,
//   },
// });
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_URL });
// const uploadFile = async (req, res) => {
//   try {
//     // console.log(req.file);
//     const filePath = req.file.path;
//       const jobDescription = req.body.jobDescription;
//       console.log("JOB FROM FRONTEND:", req.body.jobDescription);


//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdf(dataBuffer);


// const prompt = `
// You are an API. 
// Return ONLY valid pure JSON. 
// No explanation. 
// No markdown. 
// No extra text.

// Return strictly in this format:

// {
//   "Resume Score": 0,
//   "ATS Score": 0,
//   "Match Percentage": 0,
//   "Missing Skills": [],
//   "Corrected Resume": ""
// }

// Resume Text:
// ${data.text}

// Job Description:
// ${jobDescription}
// `;


//     console.log(prompt);
//     // Step 3: Call Gemini
//    // Step 3: Call Gemini
// const response = await ai.models.generateContent({
//   model: "gemini-2.5-flash",
//   contents: [{ text: prompt }],
// });

// // ✅ SIRF YE USE HOGA (NEW SDK)
// const aiResponse = response.text();


// console.log("✅ AI FINAL TEXT:", aiResponse);
// let finalJSON;

// try {
//   finalJSON = JSON.parse(aiResponse);
// } catch (err) {
//   console.log("❌ AI NE VALID JSON NAHI DIYA");

//   finalJSON = {
//     "Resume Score": 0,
//     "ATS Score": 0,
//     "Match Percentage": 0,
//     "Missing Skills": ["AI failed to return valid JSON"],
//     "Corrected Resume": ""
//   };
// }





//     console.log("Response Ai", response);
//    const AiResponse =
//   response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
//     return res.json({
//   success: true,
//   filename: req.file.filename,
//   analysis: finalJSON,
// });
    
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };
// module.exports = { upload, uploadFile };

// const { GoogleGenAI } = require("@google/genai");
// const multer = require("multer");
// const path = require("path");
// const pdf = require("pdf-parse");
// const fs = require("fs");
// const dotenv = require("dotenv");

// dotenv.config();

// // Import your Mongoose Model
// // CHECK THIS PATH: Make sure it points to where you saved resumeSchema.js
// const { resumemodel } = require("../schema/resumeSchema"); 

// // Configure Multer Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.resolve(__dirname, "../public/upload/");
//     // Ensure directory exists
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const newFileName = Date.now() + path.extname(file.originalname);
//     cb(null, newFileName);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 1024 * 1024 * 7 }, // 7MB Limit
// });

// // Initialize Gemini
// const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// const uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const filePath = req.file.path;
//     const jobDescription = req.body.jobDescription || "General Professional Resume Review";

//     // 1. Read and Parse PDF
//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdf(dataBuffer);

//     // 2. Prepare Prompt
//     const prompt = `
//     You are an expert Resume Analyzer.
//     Analyze the following resume against the Job Description.
    
//     RETURN ONLY RAW JSON. DO NOT use Markdown formatting. DO NOT include \`\`\`json or \`\`\`.
    
//     Required JSON Structure:
//     {
//       "Resume Score": (number 0-100),
//       "ATS Score": (number 0-100),
//       "Match Percentage": (number 0-100),
//       "Missing Skills": ["skill1", "skill2"],
//       "Corrected Resume": "A short professional summary or fixed version of the resume introduction."
//     }

//     Resume Text:
//     ${data.text}

//     Job Description:
//     ${jobDescription}
//     `;

//     // 3. Generate Content using Gemini 1.5 Flash
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [{ text: prompt }],
//     });
//     const result = await model.generateContent(prompt);

//     const response1 =  result.response;
    
//     let text = response1.text();

//     // 4. CLEANUP: Remove Markdown (Backticks) if present
//     text = text.replace(/```json/g, "").replace(/```/g, "").trim();

//     let aiData;
//     try {
//         aiData = JSON.parse(text);
//     } catch (parseError) {
//         console.error("JSON Parse failed on string:", text);
//         // Fallback to prevent crash
//         aiData = {
//             "Resume Score": 0,
//             "ATS Score": 0,
//             "Match Percentage": 0,
//             "Missing Skills": ["Error parsing AI response"],
//             "Corrected Resume": "Could not generate correction."
//         };
//     }

//     // 5. Map AI Data (Title Case) to DB Schema (camelCase)
//     const resumeData = {
//         filename: req.file.filename,
//         originalName: req.file.originalname,
//         jobDescription: req.body.jobDescription,
//         // userId: req.user?._id, // Uncomment if you have auth middleware and want to link to user
        
//         analysis: {
//             resumeScore: aiData["Resume Score"] || 0,
//             atsScore: aiData["ATS Score"] || 0,
//             matchPercentage: aiData["Match Percentage"] || 0,
//             missingSkills: aiData["Missing Skills"] || [],
//             improvedResumeText: aiData["Corrected Resume"] || "No correction provided",
//             suggestions: "Generated by AI" 
//         }
//     };

//     // 6. Save to MongoDB
//     try {
//         const newResume = await resumemodel.create(resumeData);
//         console.log("✅ Saved to DB:", newResume._id);
//     } catch (dbError) {
//         console.error("❌ Database Save Error:", dbError.message);
//         // We continue executing so the user still sees the result even if DB save fails
//     }

//     // 7. Send Response to Frontend
//     // We send 'aiData' (Title Case keys) because your app.js expects that format
//     return res.json({
//       success: true,
//       filename: req.file.filename,
//       analysis: aiData 
//     });

//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { upload, uploadFile };

const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const path = require("path");
const pdf = require("pdf-parse");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, "../public/uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 7, // 7MB Limit
  },
});

// --- Gemini Initialization ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// Define the exact JSON structure for the model to follow (Schema)
const jsonResponseSchema = {
    type: "object",
    properties: {
        "Resume Score": { type: "number", description: "Score out of 100 based on general professional standards." },
        "ATS Score": { type: "number", description: "Score out of 100 on how well the resume is structured for an Applicant Tracking System." },
        "Match Percentage": { type: "number", description: "Score out of 100 for matching the Job Description." },
        "Missing Skills": { type: "array", items: { type: "string" }, description: "List of critical skills from the Job Description missing from the resume." },
        "Suggestions": { type: "string", description: "Actionable advice to improve the resume." },
        "Improved Resume Text": { type: "string", description: "A concise, 3-4 sentence professional summary of the candidate based on the resume content." }
    },
    required: ["Resume Score", "ATS Score", "Match Percentage", "Missing Skills", "Suggestions", "Improved Resume Text"]
};


// --- Controller Function ---
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const jobDescription = req.body.jobDescription || "N/A";

    // 1. Read and Parse PDF
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    // 2. Prepare System Instruction and User Prompt
    const systemInstruction = `
        You are an expert Resume Analyzer and API.
        Your task is to analyze the provided resume text against the given Job Description.
        You MUST return ONLY a valid, pure JSON object that conforms to the specified schema.
        DO NOT include any conversational text, markdown formatting (like \`\`\`json), or explanations.
    `;

    const userPrompt = `
        Analyze the following resume and return the required JSON.

        Job Description:
        ${jobDescription}

        Resume Text:
        ${data.text}
    `;

    // 3. Call Gemini with JSON Mode
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: userPrompt }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: jsonResponseSchema,
      }
    });

    // 4. Extract, Clean, and Parse the JSON (THE DEFINITIVE FIX)
    // Access the text directly via the response object structure
    let aiResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    let analysis;

    // Robust Cleanup: Remove leading/trailing markdown (e.g., ```json or ```)
    aiResponseText = aiResponseText.replace(/^```json\s*|```\s*$/g, '').trim();

    // Parsing with robust Error Handling
    try {
        analysis = JSON.parse(aiResponseText);
    } catch (parseError) {
        console.error("❌ Failed to parse AI JSON response after cleanup:", parseError.message);
        console.error("Raw AI Text (After Cleanup):", aiResponseText);
        
        // Fallback object to prevent server crash
        analysis = {
            "Resume Score": 0,
            "ATS Score": 0,
            "Match Percentage": 0,
            "Missing Skills": ["AI returned invalid JSON. Check server logs."],
            "Suggestions": "Could not generate suggestions due to parsing error.",
            "Improved Resume Text": "Could not generate improved text."
        };
    }
    
    // 5. Send Parsed JSON to Frontend
    return res.json({
      success: true,
      filename: req.file.filename,
      analysis: analysis, 
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { upload, uploadFile };