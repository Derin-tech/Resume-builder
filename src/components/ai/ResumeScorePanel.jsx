import React, { useState } from 'react'
import { scoreResume } from '../../lib/claudeApi'
import { useResumeStore } from '../../store/useResumeStore'
import { Loader2 as Loader2Icon, Sparkles as SparklesIcon, TrendingUp as TrendingUpIcon, ShieldCheck as ShieldCheckIcon, RefreshCw as RefreshCwIcon } from 'lucide-react'
import { motion } from 'framer-motion'

function ScoreBar({ label, score, color }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-surface-600">{label}</span> 
        <span className="text-xs font-semibold text-surface-800">{score}</span>
      </div>
      <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function ResumeScorePanel() {
  const resumeData = useResumeStore(state => state.resumeData)
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  async function handleAnalyze() {
    setLoading(true)
    const result = await scoreResume(resumeData)
    setScore(result)
    setLoading(false)
    setAnalyzed(true)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <SparklesIcon className="w-5 h-5 text-surface-900" />
        <h2 className="text-base font-semibold text-surface-900">Resume Score</h2>
      </div>

      {!analyzed && !loading && (
        <div className="text-center py-8">
          <div className="relative border-2 border-dashed border-surface-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-surface-200">?</span>
          </div>
          <p className="text-sm text-surface-500 mb-4">Get an AI-powered analysis of your resume's strength</p>
          <button 
            onClick={handleAnalyze} 
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <SparklesIcon size={15} /> Analyze Resume
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-10 gap-3">
          <Loader2Icon size={28} className="animate-spin text-brand-500" />
          <p className="text-sm text-surface-500">Claude is reading your resume...</p>
          <p className="text-xs text-surface-400">This takes about 5 seconds</p>
        </div>
      )}

      {analyzed && score && (
        <React.Fragment>
          <div className="flex justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg width="112" height="112" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" fill="none" stroke="#e4e4e7" strokeWidth="6" />
                <motion.circle
                  cx="56" cy="56" r="48"
                  fill="none"
                  stroke={score.overallScore >= 80 ? '#22c55e' : score.overallScore >= 60 ? '#eab308' : '#f97316'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - score.overallScore / 100) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-surface-900">{score.overallScore}</span>
                <span className="text-xs text-surface-400">/ 100</span>
              </div>
            </div>
          </div>

          <div>
            <ScoreBar label="Completeness" score={score.categories?.completeness?.score || 0} color="#4f6ef7" />
            <ScoreBar label="Impact" score={score.categories?.impact?.score || 0} color="#a855f7" />
            <ScoreBar label="ATS Compatibility" score={score.categories?.atsCompatibility?.score || 0} color="#22c55e" />
            <ScoreBar label="Clarity" score={score.categories?.clarity?.score || 0} color="#f59e0b" />
          </div>

          {score.strengths?.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1"><ShieldCheckIcon size={12} /> Strengths</p>
              {score.strengths.map((s, i) => <p key={i} className="text-xs text-green-700 flex items-start gap-1.5 mb-0.5"><span>✓</span>{s}</p>)}
            </div>
          )}

          {score.improvements?.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1"><TrendingUpIcon size={12} /> Improvements</p>
              {score.improvements.map((s, i) => <p key={i} className="text-xs text-amber-700 flex items-start gap-1.5 mb-0.5"><span>→</span>{s}</p>)}
            </div>
          )}

          <button 
            onClick={handleAnalyze} 
            className="w-full flex items-center justify-center gap-1.5 text-xs text-surface-400 hover:text-surface-600 py-2 transition-colors"
          >
            <RefreshCwIcon size={11} /> Re-analyze
          </button>
        </React.Fragment>
      )}
    </div>
  )
}
