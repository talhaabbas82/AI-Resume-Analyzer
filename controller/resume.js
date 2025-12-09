
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const path = require("path");
const pdf = require("pdf-parse");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../public/upload/"));
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 7,
  },
});
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_URL });
const uploadFile = async (req, res) => {
  try {
    // console.log(req.file);
    const filePath = req.file.path;
      const jobDescription = req.body.jobDescription;
      console.log("JOB FROM FRONTEND:", req.body.jobDescription);


    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);


const prompt = `
You are an API. 
Return ONLY valid pure JSON. 
No explanation. 
No markdown. 
No extra text.

Return strictly in this format:

{
  "Resume Score": 0,
  "ATS Score": 0,
  "Match Percentage": 0,
  "Missing Skills": [],
  "Corrected Resume": ""
}

Resume Text:
${data.text}

Job Description:
${jobDescription}
`;


    console.log(prompt);
    // Step 3: Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });
    console.log("Response Ai", response);
   const aiResponse =
  response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return res.json({
      success: true,
      filename: req.file.filename,
      analysis: aiResponse,
    });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { upload, uploadFile };