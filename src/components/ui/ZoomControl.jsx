import { useUIStore } from '../../store/useUIStore'
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'

export default function ZoomControl() {
  const { zoomLevel, setZoomLevel } = useUIStore()

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
        className="w-6 h-6 rounded-md flex items-center justify-center text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
      >
        <ZoomOutIcon size={13} />
      </button>
      <span className="text-xs font-medium text-surface-500 w-10 text-center tabular-nums">
        {zoomLevel}%
      </span>
      <button
        onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
        className="w-6 h-6 rounded-md flex items-center justify-center text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
      >
        <ZoomInIcon size={13} />
      </button>
      <button
        onClick={() => setZoomLevel(100)}
        className="text-[10px] text-surface-400 hover:text-surface-600 px-1"
      >
        Reset
      </button>
    </div>
  )
}
