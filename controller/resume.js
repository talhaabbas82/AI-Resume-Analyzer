
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