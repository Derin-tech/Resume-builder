const GEMINI_API_KEY = 'AIzaSyB5EJwUfkH6vv4ThAXfSDyPJea14MZp7dc'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

async function callGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
    })
  })
  const data = await response.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  return raw.replace(/```json|```/g, '').trim()
}

export async function improveText(text, context) {
  const raw = await callGemini(`You are an expert resume writer. Improve this resume bullet point to be more impactful, specific, and ATS-friendly. Use strong action verbs, quantify achievements where possible.

Context: ${context || 'Work experience'}
Original: "${text}"

Return ONLY valid JSON, no markdown, no explanation:
{"improved": "improved text here", "changes": ["change 1", "change 2", "change 3"]}`)
  try { return JSON.parse(raw) }
  catch { return { improved: text, changes: [] } }
}

export async function scoreResume(resumeData) {
  const raw = await callGemini(`You are an expert resume reviewer. Analyze this resume and provide scores.

Resume: ${JSON.stringify(resumeData)}

Return ONLY valid JSON:
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
  "missingKeywords": ["keyword1", "keyword2"]
}`)
  try { return JSON.parse(raw) }
  catch { return null }
}

export async function matchJobDescription(resumeData, jobDescription) {
  const raw = await callGemini(`Compare this resume against the job description. Give ATS match score and keyword analysis.

Resume: ${resumeData.contact?.fullName}, Skills: ${resumeData.skills?.map(s => s.name).join(', ')}, Experience: ${resumeData.experience?.map(e => e.jobTitle + ' at ' + e.company).join(', ')}

Job description: "${jobDescription}"

Return ONLY valid JSON:
{
  "matchScore": 72,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "verdict": "brief verdict here"
}`)
  try { return JSON.parse(raw) }
  catch { return null }
}

export async function generateSummary(resumeData) {
  const expText = resumeData.experience?.map(e =>
    `${e.jobTitle} at ${e.company}: ${e.description}`
  ).join('\n') || 'No experience yet'

  const raw = await callGemini(`Write a professional resume summary. 2-3 sentences, punchy and ATS-optimized.

Name: ${resumeData.contact?.fullName || 'Unknown'}
Experience: ${expText}
Skills: ${resumeData.skills?.map(s => s.name).join(', ') || 'None'}

Return ONLY valid JSON: {"summary": "the summary text"}`)
  try { return JSON.parse(raw) }
  catch { return { summary: raw } }
}

export async function suggestJobTitles(partialTitle) {
  const raw = await callGemini(`Suggest 5 professional job titles matching: "${partialTitle}"

Return ONLY valid JSON: {"titles": ["title1", "title2", "title3", "title4", "title5"]}`)
  try { return JSON.parse(raw) }
  catch { return { titles: [] } }
}

export async function parseLinkedInText(text) {
  const raw = await callGemini(`Extract resume information from this LinkedIn profile text.

Text: "${text}"

Return ONLY valid JSON:
{
  "contact": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
  "summary": "",
  "experience": [{ "jobTitle": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "" }],
  "education": [{ "institution": "", "degree": "", "fieldOfStudy": "", "graduationYear": "" }],
  "skills": [{ "name": "" }]
}`)
  try { return JSON.parse(raw) }
  catch { return null }
}

export async function generateCoverLetter(resumeData, jobDescription) {
  const raw = await callGemini(`Write a professional cover letter. 3 paragraphs. Warm but professional tone. No clichés.

Candidate: ${resumeData.contact?.fullName}
Experience: ${resumeData.experience?.map(e => `${e.jobTitle} at ${e.company}`).join(', ')}
Skills: ${resumeData.skills?.map(s => s.name).join(', ')}
Summary: ${resumeData.summary}
Job: ${jobDescription}

Return ONLY valid JSON: {"coverLetter": "full letter with \\n for line breaks", "subject": "email subject line"}`)
  try { return JSON.parse(raw) }
  catch { return null }
}

export async function chatWithResume(message, resumeData, history) {
  const context = `You are Resume Buddy, an expert resume coach. Resume data: ${JSON.stringify(resumeData)}. Be concise, specific and friendly. Use bullet points for lists.`
  
  const historyText = history.map(m => 
    `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
  ).join('\n')

  const raw = await callGemini(`${context}

${historyText ? 'Conversation so far:\n' + historyText + '\n' : ''}User: ${message}

Respond as Resume Buddy:`)
  
  return raw
}
