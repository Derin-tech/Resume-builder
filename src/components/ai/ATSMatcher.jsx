import React, { useState } from 'react'
import { matchJobDescription } from '../../lib/claudeApi'
import { useResumeStore } from '../../store/useResumeStore'
import { Target as TargetIcon, Loader2 as Loader2Icon, Sparkles as SparklesIcon } from 'lucide-react'

export default function ATSMatcher() {
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const resumeData = useResumeStore(state => state.resumeData)

  async function handleMatch() {
    if (!jobDesc.trim()) return
    setLoading(true)
    const data = await matchJobDescription(resumeData, jobDesc)
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <TargetIcon className="w-5 h-5 text-surface-900" />
        <h2 className="text-base font-semibold text-surface-900">ATS Job Matcher</h2>
      </div>

      <p className="text-xs text-surface-400">Paste a job description to see how well your resume matches</p>

      <textarea
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
        placeholder="Paste the full job description here..."
        rows={5}
        className="w-full text-xs border border-surface-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-800 placeholder:text-surface-300"
      />

      <button 
        onClick={handleMatch} 
        disabled={loading || !jobDesc.trim()} 
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-xs font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <Loader2Icon size={13} className="animate-spin" /> : <SparklesIcon size={13} />}
        {loading ? 'Analyzing...' : 'Match Against Job'}
      </button>

      {result && (
        <div className="space-y-4 mt-6">
          <div className={`rounded-xl p-4 text-center ${result.matchScore >= 80 ? 'bg-green-50 border border-green-200' : result.matchScore >= 60 ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-3xl font-bold mb-1" style={{color: result.matchScore >= 80 ? '#16a34a' : result.matchScore >= 60 ? '#d97706' : '#dc2626'}}>
              {result.matchScore}%
            </div>
            <p className="text-xs font-medium text-surface-600">ATS Match Score</p>
            <p className="text-xs text-surface-500 mt-1">{result.verdict}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-surface-600 mb-2">Keywords found in your resume</p>
            <div className="flex flex-wrap gap-1.5">
              {result.matchedKeywords?.map((kw, i) => (
                <span key={i} className="text-xs bg-green-100 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5 font-medium">{kw}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-surface-600 mb-2">Missing keywords to add</p>
            <div className="flex flex-wrap gap-1.5">
              {result.missingKeywords?.map((kw, i) => (
                <span key={i} className="text-xs bg-red-50 text-red-500 border border-red-200 rounded-full px-2.5 py-0.5 font-medium">{kw}</span>
              ))}
            </div>
          </div>

          {result.suggestions?.length > 0 && (
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 space-y-1">
              <p className="text-xs font-semibold text-brand-700 mb-2">Suggestions</p>
              {result.suggestions.map((s, i) => (
                <p key={i} className="text-xs text-brand-700">→ {s}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
