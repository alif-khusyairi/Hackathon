import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusSquare, 
  ListTodo, 
  KanbanSquare, 
  Users, 
  Activity 
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/new-workflow", label: "New Workflow", icon: PlusSquare },
    { path: "/queue", label: "Workflow Queue", icon: ListTodo, badge: 8 },
    { path: "/task-board", label: "Task Board", icon: KanbanSquare },
    { path: "/human-review", label: "Human Review", icon: Users, badge: 3, badgeColor: "bg-red-500" },
  ];

  return (
    <aside className="w-[260px] bg-[#111827] text-slate-300 flex flex-col flex-shrink-0 h-full">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
          <Activity size={20} />
        </div>
        <div>
          <h1 className="text-white font-bold leading-tight">ClinicFlow AI</h1>
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">Workflow Manager</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Main</p>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                  {item.label}
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor || "bg-amber-500"}`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom User Area */}
      <div className="p-4 border-t border-slate-800 space-y-4 flex-shrink-0">
        <div className="px-3 py-2 bg-slate-800/50 rounded-lg flex items-center gap-2 border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-slate-300">GLM Engine - Online</span>
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            SR
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white leading-tight">Dr. Siti Rahimah</p>
            <p className="text-xs text-slate-500">Clinic Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}