import { useState } from "react"
import { Plus, Clock } from "lucide-react"

const INITIAL_COLUMNS = {
  todo: {
    label: "To Do", count: 4,
    countColor: "text-slate-500 bg-slate-100",
    tasks: [
      { id: 1, title: "Patient check-in & vitals — Lim Wei Hong", type: "Appointment", typeColor: "bg-blue-100 text-blue-700", role: "Nurse Ros", av: "NR", avBg: "bg-violet-500", due: "Due 2:30 PM", dueColor: "text-slate-500" },
      { id: 2, title: "Collect blood sample — FBC + Lipid panel", type: "Lab", typeColor: "bg-teal-100 text-teal-700", role: "Lab Tech", av: "LB", avBg: "bg-teal-600", due: "Due 3:00 PM", dueColor: "text-slate-500" },
      { id: 3, title: "Schedule follow-up — Priya Suresh", type: "Follow-Up", typeColor: "bg-amber-100 text-amber-700", role: "Receptionist", av: "RC", avBg: "bg-blue-500", due: "Due 4:00 PM", dueColor: "text-slate-500" },
      { id: 4, title: "Complete referral letter — Rajasegaran (Cardiology)", type: "Urgent", typeColor: "bg-red-100 text-red-700", role: "Dr. Rahman", av: "DR", avBg: "bg-violet-600", due: "Overdue", dueColor: "text-red-500 font-semibold" },
    ],
  },
  inprogress: {
    label: "In Progress", count: 3,
    countColor: "text-blue-700 bg-blue-100",
    tasks: [
      { id: 5, title: "Doctor consultation — Ahmad bin Ismail (chest pain)", type: "Urgent Walk-In", typeColor: "bg-red-100 text-red-700", role: "Dr. Rahman", av: "DR", avBg: "bg-blue-600", due: "Active now", dueColor: "text-emerald-600 font-semibold" },
      { id: 6, title: "Triage & vitals — Fatimah Zahra (8yo, fever)", type: "Appointment", typeColor: "bg-blue-100 text-blue-700", role: "Nurse Ros", av: "NR", avBg: "bg-violet-500", due: "Active now", dueColor: "text-emerald-600 font-semibold" },
      { id: 7, title: "Process FBC sample — Mr. Rajan", type: "Lab", typeColor: "bg-teal-100 text-teal-700", role: "Lab Team", av: "LB", avBg: "bg-teal-600", due: "ETA 30 min", dueColor: "text-slate-500" },
    ],
  },
  review: {
    label: "Waiting Review", count: 3,
    countColor: "text-violet-700 bg-violet-100",
    tasks: [
      { id: 8, title: "Review AI workflow — Lim Wei Hong (missing IC)", type: "Human Review", typeColor: "bg-violet-100 text-violet-700", role: "Dr. Siti", av: "SR", avBg: "bg-violet-600", due: "Awaiting", dueColor: "text-violet-600 font-semibold" },
      { id: 9, title: "Approve referral — Rajasegaran to Cardiology, IJN", type: "Approval", typeColor: "bg-amber-100 text-amber-700", role: "Dr. Siti", av: "SR", avBg: "bg-violet-600", due: "Pending", dueColor: "text-amber-600 font-semibold" },
      { id: 10, title: "Incomplete registration — elderly walk-in", type: "Missing Data", typeColor: "bg-red-100 text-red-700", role: "Receptionist", av: "RC", avBg: "bg-blue-500", due: "Blocked", dueColor: "text-red-500 font-semibold" },
    ],
  },
  done: {
    label: "Completed", count: 5,
    countColor: "text-emerald-700 bg-emerald-100",
    tasks: [
      { id: 11, title: "Discharge — Wong Mei Ling (wrist fracture treated)", type: "Done", typeColor: "bg-emerald-100 text-emerald-700", role: "Dr. Aisha", av: "DA", avBg: "bg-amber-500", due: "1:30 PM", dueColor: "text-slate-400" },
      { id: 12, title: "Prescription dispensed — Mrs. Azizah Harun", type: "Done", typeColor: "bg-emerald-100 text-emerald-700", role: "Pharmacy", av: "PH", avBg: "bg-orange-500", due: "12:45 PM", dueColor: "text-slate-400" },
      { id: 13, title: "Lab results entered — Tan Bee Leng (Thyroid)", type: "Done", typeColor: "bg-emerald-100 text-emerald-700", role: "Lab Team", av: "LB", avBg: "bg-teal-600", due: "11:20 AM", dueColor: "text-slate-400" },
    ],
  },
}

function TaskCard({ task, colId, onMove, isDone }) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group ${isDone ? "opacity-70" : ""}`}>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.typeColor} mb-2 inline-block`}>
        {task.type}
      </span>
      <p className="text-xs font-semibold text-slate-800 leading-snug mb-3">{task.title}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded-full ${task.avBg} flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0`}>
            {task.av}
          </div>
          <span className="text-[10px] text-slate-500">{task.role}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={9} className="text-slate-400" />
          <span className={`text-[10px] ${task.dueColor}`}>{task.due}</span>
        </div>
      </div>
    </div>
  )
}

export default function TaskBoard({ navigate, addToast, PAGES }) {
  const [columns] = useState(INITIAL_COLUMNS)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Task Board</h2>
          <p className="text-sm text-slate-500 mt-0.5">Live task assignments across all active workflows</p>
        </div>
        <button
          onClick={() => addToast("info", "Quick task creation — assign directly to staff")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Object.entries(columns).map(([colId, col]) => (
          <div key={colId} className="bg-slate-100 rounded-xl p-3 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{col.label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.countColor}`}>
                {col.count}
              </span>
            </div>
            <div className="space-y-2">
              {col.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  colId={colId}
                  isDone={colId === "done"}
                  onMove={() => addToast("success", `Task moved to next stage`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}