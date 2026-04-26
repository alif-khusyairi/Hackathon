// src/components/DashboardCards.jsx
// Upgraded: color-coded top borders, trend indicators, progress bars, icons

const STATS = [
  {
    label: "Active Workflows",
    value: 12,
    delta: "+4 from yesterday",
    positive: true,
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    topBorder: "bg-blue-500",
    barColor: "bg-blue-500",
    barWidth: "75%",
  },
  {
    label: "Pending Reviews",
    value: 3,
    delta: "2 need urgent action",
    positive: false,
    iconPath: "M12 2v10l4 4",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    topBorder: "bg-amber-500",
    barColor: "bg-amber-500",
    barWidth: "40%",
  },
  {
    label: "Completed Today",
    value: 27,
    delta: "↑ 12% vs last week",
    positive: true,
    iconPath: "M20 6L9 17l-5-5",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    topBorder: "bg-emerald-500",
    barColor: "bg-emerald-500",
    barWidth: "90%",
  },
  {
    label: "Delayed Tasks",
    value: 5,
    delta: "+2 in last 30 min",
    positive: false,
    iconPath: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    topBorder: "bg-red-500",
    barColor: "bg-red-500",
    barWidth: "30%",
  },
]

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {/* Colored top border */}
          <div className={`h-1 ${s.topBorder}`} />

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide leading-tight">
                {s.label}
              </p>
              <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.iconColor}>
                  <path d={s.iconPath} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="text-3xl font-black text-slate-800 mb-1 tabular-nums">
              {s.value}
            </div>

            <div className={`text-xs font-medium mb-3 ${s.positive ? "text-emerald-600" : "text-red-500"}`}>
              {s.delta}
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${s.barColor} rounded-full`}
                style={{ width: s.barWidth }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
