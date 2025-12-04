const express = require("express");
const axios = require("axios");
const resume = require("../schema/resumeSchema");
require("dotenv").config();



const router = express.Router();

async function Analyzer(req, res) {
  try {
    const { userId, resumeText } = req.body;

    const prompt = `
Analyze this resume and return JSON with:
- resume score
- ats score
- suggestions
- corrected resume

Resume:
${resumeText}
`;

    const response = await axios.post(
     
      process.env.GEMINI_URL,
    
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    // Extract text
    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Convert AI text to JSON
    const parsed = JSON.parse(aiText);

    const saved = await resume.create({
      userId,
      originalText: resumeText,
      improvedText: parsed.correctedResume || "",
      score: parsed.resumeScore || 0,
      atsScore: parsed.atsScore || 0,
      suggestions: parsed.suggestions || [],
    });

    res.json(saved);
    console.log("URL =>", process.env.GEMINI_URL);

  } catch (error) {
    res.send({
      status: 404,
      message: "not seen anything",
      error: error.toString(),
    });
  }
}

module.exports = { Analyzer };
