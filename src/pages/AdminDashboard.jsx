import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { UsersIcon, FileTextIcon, ClockIcon, TrendingUpIcon, ArrowLeftIcon } from 'lucide-react'

// 🔒 YOUR EMAIL HERE — only this email can access the dashboard
const ADMIN_EMAIL = 'derinjosesanjith@gmail.com'

export default function AdminDashboard() {
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, withResume: 0, today: 0 })

  // Block non-admins
  useEffect(() => {
    if (!user) { navigate('/'); return }
    if (user.email !== ADMIN_EMAIL) { navigate('/builder'); return }
    fetchUsers()
  }, [user])

  async function fetchUsers() {
    try {
      const q = query(collection(db, 'resumes'), orderBy('updatedAt', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }))

      setUsers(data)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      setStats({
        total: data.length,
        withResume: data.filter(u => u.resumeData?.contact?.fullName).length,
        today: data.filter(u => u.createdAt >= today).length,
      })
    } catch (e) {
      console.error('Admin fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }

  function getCompletionScore(resumeData) {
    if (!resumeData) return 0
    let score = 0
    if (resumeData.contact?.fullName) score += 20
    if (resumeData.contact?.email) score += 10
    if (resumeData.summary) score += 20
    if (resumeData.experience?.length > 0) score += 25
    if (resumeData.education?.length > 0) score += 15
    if (resumeData.skills?.length > 0) score += 10
    return score
  }

  function timeAgo(date) {
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full bg-brand-500"
            animate={{ y: [0,-8,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i*0.15 }} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 md:p-10">

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <button onClick={() => navigate('/builder')}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-4 transition-colors">
              <ArrowLeftIcon size={14} /> Back to Builder
            </button>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Resume Buddy · User Analytics</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/30">Signed in as</p>
            <p className="text-sm text-white/60">{user?.email}</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: UsersIcon, label: 'Total Users', value: stats.total, color: '#4f6ef7' },
            { icon: FileTextIcon, label: 'Active Resumes', value: stats.withResume, color: '#a78bfa' },
            { icon: ClockIcon, label: 'Joined Today', value: stats.today, color: '#22c55e' },
            { icon: TrendingUpIcon, label: 'Completion Rate', value: `${stats.total > 0 ? Math.round(stats.withResume/stats.total*100) : 0}%`, color: '#f59e0b' },
          ].map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <stat.icon size={18} style={{ color: stat.color }} className="mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Users table */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>

          <div className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white">All Users ({stats.total})</h2>
            <button onClick={fetchUsers}
              className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['User', 'Email', 'Resume Name', 'Completion', 'Joined', 'Last Active'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-white/30 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-white/30 text-sm">
                      No users yet. Share your app!
                    </td>
                  </tr>
                ) : users.map((u, i) => {
                  const score = getCompletionScore(u.resumeData)
                  const name = u.resumeData?.contact?.fullName || '—'
                  return (
                    <motion.tr key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Avatar + uid */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)' }}>
                            {(u.ownerEmail || u.id)[0].toUpperCase()}
                          </div>
                          <span className="text-xs text-white/30 font-mono">
                            {u.id.slice(0, 8)}...
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-white/70">
                        {u.ownerEmail || '—'}
                      </td>

                      {/* Resume name */}
                      <td className="px-6 py-4 text-sm text-white/80 font-medium">
                        {name}
                      </td>

                      {/* Completion */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden bg-white/10">
                            <div className="h-full rounded-full transition-all"
                              style={{
                                width: `${score}%`,
                                background: score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#4f6ef7'
                              }} />
                          </div>
                          <span className="text-xs text-white/40">{score}%</span>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-xs text-white/40">
                        {u.createdAt.toLocaleDateString()}
                      </td>

                      {/* Last active */}
                      <td className="px-6 py-4 text-xs text-white/40">
                        {timeAgo(u.updatedAt)}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/20 mt-6">
          🔒 This dashboard is only visible to {ADMIN_EMAIL}
        </p>
      </div>
    </div>
  )
}
