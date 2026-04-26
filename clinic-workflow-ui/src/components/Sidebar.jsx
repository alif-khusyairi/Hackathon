// src/components/Sidebar.jsx
// Fix: dark background, active state highlight, icons, GLM status pill

function NavIcon({ name }) {
  const icons = {
    dashboard: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    "new-workflow": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    "workflow-queue": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" /><circle cx="3" cy="6" r="1" /><circle cx="3" cy="12" r="1" /><circle cx="3" cy="18" r="1" />
      </svg>
    ),
    "task-board": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
    "human-review": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  }
  return icons[name] || null
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "new-workflow", label: "New Workflow" },
  { id: "workflow-queue", label: "Workflow Queue", badge: 8 },
  { id: "task-board", label: "Task Board" },
  { id: "human-review", label: "Human Review", badge: 3, badgeRed: true },
]

export default function Sidebar({ activePage, navigate, PAGES }) {
  return (
    <aside className="w-60 min-w-[240px] h-full flex flex-col bg-[#0F2942] text-white flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">ClinicFlow AI</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest">Workflow Manager</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="px-5 py-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          Main
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-150 relative text-left
                ${isActive
                  ? "bg-blue-600/30 text-white font-semibold"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-sky-400 rounded-r" />
              )}

              {/* Icon */}
              <span className={isActive ? "text-sky-300" : "text-white/50"}>
                <NavIcon name={item.id} />
              </span>

              {/* Label */}
              <span className="flex-1">{item.label}</span>

              {/* Badge */}
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white min-w-[18px] text-center
                    ${item.badgeRed ? "bg-red-500" : "bg-amber-500"}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* GLM status + user */}
      <div className="px-4 py-3 border-t border-white/10 space-y-3">
        {/* GLM pill */}
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="text-[11px] text-emerald-300 font-semibold">GLM Engine · Online</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
            SR
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">Dr. Siti Rahimah</div>
            <div className="text-[11px] text-white/40">Clinic Manager</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
