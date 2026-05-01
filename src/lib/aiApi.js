const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

async function callGemini(prompt, isJson = true, systemPrompt = null, history = []) {
  if (!API_KEY) {
    console.error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env.local file.");
    return isJson ? "{}" : "API key is missing. Please add your Gemini API key to .env.local.";
  }

  const contents = [];

  // Add history
  for (const msg of history) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  // Add current prompt
  if (prompt) {
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });
  }

  const body = {
    contents,
    generationConfig: {
      temperature: 0.7,
    }
  };

  if (isJson) {
    body.generationConfig.responseMimeType = "application/json";
  }

  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("Gemini API Error:", data);
    return isJson ? "{}" : "Error communicating with AI.";
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || (isJson ? "{}" : "");
  return text;
}

export async function improveText(text, context) {
  const prompt = `You are an expert resume writer. Improve the following resume bullet point or description to be more impactful, specific, and ATS-friendly. Use strong action verbs, quantify achievements where possible, and keep it concise.

Context: ${context || 'Work experience description'}
Original text: "${text}"

Return ONLY a JSON object with this exact shape and nothing else:
{"improved": "the improved text here", "changes": ["change 1", "change 2", "change 3"]}`;

  const raw = await callGemini(prompt, true);
  try { return JSON.parse(raw); } catch { return { improved: raw, changes: [] }; }
}

export async function scoreResume(resumeData) {
  const resumeText = JSON.stringify(resumeData, null, 2);
  const prompt = `You are an expert resume reviewer and ATS specialist. Analyze this resume data and provide a detailed score.

Resume data: ${resumeText}

Return ONLY a JSON object with this exact shape and nothing else:
{
  "overallScore": 85,
  "categories": {
    "completeness": { "score": 90, "feedback": "brief feedback" },
    "impact": { "score": 75, "feedback": "brief feedback" },
    "atsCompatibility": { "score": 85, "feedback": "brief feedback" },
    "clarity": { "score": 80, "feedback": "brief feedback" }
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"]
}`;

  const raw = await callGemini(prompt, true);
  try { return JSON.parse(raw); } catch { return null; }
}

export async function matchJobDescription(resumeData, jobDescription) {
  const prompt = `You are an ATS (Applicant Tracking System) expert. Compare this resume against the job description and identify the match percentage and keyword gaps.

Resume summary: ${resumeData.contact?.fullName || 'Candidate'}, Skills: ${resumeData.skills?.map(s => s.name).join(', ')}, Experience: ${resumeData.experience?.map(e => e.jobTitle + ' at ' + e.company).join(', ')}

Job description: "${jobDescription}"

Return ONLY a JSON object with this exact shape and nothing else:
{
  "matchScore": 72,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["Add X to your skills", "Mention Y in your experience"],
  "verdict": "Good match — add 3 more keywords to maximize ATS score"
}`;

  const raw = await callGemini(prompt, true);
  try { return JSON.parse(raw); } catch { return null; }
}

export async function generateSummary(resumeData) {
  const expText = resumeData.experience?.map(e =>
    `${e.jobTitle} at ${e.company}: ${e.description}`
  ).join('\n') || 'No experience added yet';

  const prompt = `Write a professional resume summary for this person. Make it punchy, specific, and ATS-optimized. 2-3 sentences max.

Name: ${resumeData.contact?.fullName || 'Unknown'}
Experience: ${expText}
Skills: ${resumeData.skills?.map(s => s.name).join(', ') || 'None listed'}

Return ONLY a JSON object: {"summary": "the summary text here"}`;

  const raw = await callGemini(prompt, true);
  try { return JSON.parse(raw); } catch { return { summary: raw }; }
}

export async function suggestJobTitles(partialTitle) {
  const prompt = `Suggest 5 professional job titles that start with or closely match: "${partialTitle}". Return ONLY a JSON object: {"titles": ["title1", "title2", "title3", "title4", "title5"]}`;
  const raw = await callGemini(prompt, true);
  try { return JSON.parse(raw); } catch { return { titles: [] }; }
}

export async function parseLinkedInText(text) {
  const prompt = `Extract resume information from this LinkedIn profile text and return structured data.

LinkedIn text: "${text}"

Return ONLY a JSON object with this shape and nothing else:
{
  "contact": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
  "summary": "",
  "experience": [{ "jobTitle": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "" }],
  "education": [{ "institution": "", "degree": "", "fieldOfStudy": "", "graduationYear": "" }],
  "skills": [{ "name": "" }]
}`;
  const raw = await callGemini(prompt, true);
  try { return JSON.parse(raw); } catch { return null; }
}

export async function generateCoverLetter(resumeData, jobDescription) {
  const prompt = `Write a professional, personalized cover letter based on this resume and job description.

Candidate: ${resumeData.contact?.fullName}
Experience: ${resumeData.experience?.map(e => `${e.jobTitle} at ${e.company}`).join(', ')}
Skills: ${resumeData.skills?.map(s => s.name).join(', ')}
Summary: ${resumeData.summary}

Job Description: ${jobDescription}

Write 3 paragraphs. Professional but warm tone. Do not use clichés like "I am writing to express my interest". Return ONLY a JSON object: {"coverLetter": "full cover letter text with \\n for line breaks", "subject": "email subject line"}`;

  const raw = await callGemini(prompt, true);
  try { return JSON.parse(raw); } catch { return null; }
}

export async function chatWithResume(message, resumeData, history) {
  const systemPrompt = `You are Resume Buddy, an expert resume coach. You have access to the user's resume data: ${JSON.stringify(resumeData)}. Give specific, actionable advice. Be concise and friendly. Use bullet points when listing multiple things.`;
  
  // Clean history formatting for Gemini
  const formattedHistory = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    content: h.content
  }));

  const text = await callGemini(message, false, systemPrompt, formattedHistory);
  return text;
}
