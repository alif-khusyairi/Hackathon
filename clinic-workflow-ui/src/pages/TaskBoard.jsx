import { useState } from "react"
import { Plus, Clock } from "lucide-react"
import { useToastStore } from "../store/useToastStore"
import { TASK_STATUS_LABELS, TASK_TYPE_LABELS } from "../lib/labels"

// Type → color mapping (kept here because it's UI-only)
const TASK_TYPE_COLORS = {
  appointment:    "bg-blue-100 text-blue-700",
  lab:            "bg-teal-100 text-teal-700",
  urgent:         "bg-red-100 text-red-700",
  urgent_walk_in: "bg-red-100 text-red-700",
  follow_up:      "bg-amber-100 text-amber-700",
  human_review:   "bg-violet-100 text-violet-700",
  approval:       "bg-amber-100 text-amber-700",
  missing_data:   "bg-red-100 text-red-700",
  done:           "bg-emerald-100 text-emerald-700",
}

// Column metadata (the keys here are now the DB enum values)
const COLUMN_META = {
  todo:        { countColor: "text-slate-500 bg-slate-100" },
  in_progress: { countColor: "text-blue-700 bg-blue-100" },
  review:      { countColor: "text-violet-700 bg-violet-100" },
  done:        { countColor: "text-emerald-700 bg-emerald-100" },
}

const INITIAL_COLUMNS = {
  todo: {
    tasks: [
      { id: 1, title: "Patient check-in & vitals — Lim Wei Hong",         task_type: "appointment", assignee_role: "Nurse Ros",   av: "NR", avBg: "bg-violet-500", due: "Due 2:30 PM", dueColor: "text-slate-500" },
      { id: 2, title: "Collect blood sample — FBC + Lipid panel",         task_type: "lab",         assignee_role: "Lab Tech",    av: "LB", avBg: "bg-teal-600",   due: "Due 3:00 PM", dueColor: "text-slate-500" },
      { id: 3, title: "Schedule follow-up — Priya Suresh",                task_type: "follow_up",   assignee_role: "Receptionist",av: "RC", avBg: "bg-blue-500",   due: "Due 4:00 PM", dueColor: "text-slate-500" },
      { id: 4, title: "Complete referral letter — Rajasegaran",           task_type: "urgent",      assignee_role: "Dr. Rahman",  av: "DR", avBg: "bg-violet-600", due: "Overdue",     dueColor: "text-red-500 font-semibold" },
    ],
  },
  in_progress: {
    tasks: [
      { id: 5, title: "Doctor consultation — Ahmad bin Ismail",           task_type: "urgent_walk_in", assignee_role: "Dr. Rahman", av: "DR", avBg: "bg-blue-600",   due: "Active now",  dueColor: "text-emerald-600 font-semibold" },
      { id: 6, title: "Triage & vitals — Fatimah Zahra (8yo, fever)",     task_type: "appointment",    assignee_role: "Nurse Ros",  av: "NR", avBg: "bg-violet-500", due: "Active now",  dueColor: "text-emerald-600 font-semibold" },
      { id: 7, title: "Process FBC sample — Mr. Rajan",                   task_type: "lab",            assignee_role: "Lab Team",   av: "LB", avBg: "bg-teal-600",   due: "ETA 30 min",  dueColor: "text-slate-500" },
    ],
  },
  review: {
    tasks: [
      { id: 8, title: "Review AI workflow — Lim Wei Hong (missing IC)",   task_type: "human_review", assignee_role: "Dr. Siti",     av: "SR", avBg: "bg-violet-600", due: "Awaiting", dueColor: "text-violet-600 font-semibold" },
      { id: 9, title: "Approve referral — Rajasegaran to IJN",            task_type: "approval",     assignee_role: "Dr. Siti",     av: "SR", avBg: "bg-violet-600", due: "Pending",  dueColor: "text-amber-600 font-semibold" },
      { id: 10, title: "Incomplete registration — elderly walk-in",       task_type: "missing_data", assignee_role: "Receptionist", av: "RC", avBg: "bg-blue-500",   due: "Blocked",  dueColor: "text-red-500 font-semibold" },
    ],
  },
  done: {
    tasks: [
      { id: 11, title: "Discharge — Wong Mei Ling (wrist fracture)",      task_type: "done", assignee_role: "Dr. Aisha", av: "DA", avBg: "bg-amber-500",  due: "1:30 PM",  dueColor: "text-slate-400" },
      { id: 12, title: "Prescription dispensed — Mrs. Azizah Harun",      task_type: "done", assignee_role: "Pharmacy",  av: "PH", avBg: "bg-orange-500", due: "12:45 PM", dueColor: "text-slate-400" },
      { id: 13, title: "Lab results entered — Tan Bee Leng (Thyroid)",    task_type: "done", assignee_role: "Lab Team",  av: "LB", avBg: "bg-teal-600",   due: "11:20 AM", dueColor: "text-slate-400" },
    ],
  },
}

function TaskCard({ task, isDone }) {
  const addToast = useToastStore((state) => state.addToast)
  const typeColor = TASK_TYPE_COLORS[task.task_type] || "bg-slate-100 text-slate-700"
  const typeLabel = TASK_TYPE_LABELS[task.task_type] || task.task_type

  return (
    <div 
      onClick={() => addToast("success", `Task moved to next stage`)}
      className={`bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group ${isDone ? "opacity-70 grayscale" : ""}`}
    >
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor} mb-2 inline-block`}>
        {typeLabel}
      </span>
      <p className="text-xs font-semibold text-slate-800 leading-snug mb-3">{task.title}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded-full ${task.avBg} flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0`}>
            {task.av}
          </div>
          <span className="text-[10px] text-slate-500">{task.assignee_role}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={9} className="text-slate-400" />
          <span className={`text-[10px] ${task.dueColor}`}>{task.due}</span>
        </div>
      </div>
    </div>
  )
}

export default function TaskBoard() {
  const [columns] = useState(INITIAL_COLUMNS)
  const addToast = useToastStore((state) => state.addToast)

  return (
    <div className="max-w-7xl mx-auto w-full space-y-5 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Task Board</h1>
          <p className="text-sm text-slate-500 mt-0.5">Live task assignments across all active workflows</p>
        </div>
        <button
          onClick={() => addToast("info", "Quick task creation — assign directly to staff")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={15} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {Object.entries(columns).map(([colId, col]) => {
          const meta = COLUMN_META[colId]
          const label = TASK_STATUS_LABELS[colId]
          return (
            <div key={colId} className="bg-slate-100 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.countColor}`}>
                  {col.tasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {col.tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDone={colId === "done"}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}