import { useState } from "react"
import { AlertTriangle, CheckCircle2, ArrowUpRight, UserCheck, Info } from "lucide-react"
import { useToastStore } from "../store/useToastStore" // 1. Import our new store

const INITIAL_CASES = [
  {
    id: "WF-2024-089",
    patient: "Ahmad bin Ismail",
    issue: "Walk-in, 54M — chest pain + dizziness — urgent escalation required",
    urgency: "urgent",
    missing: "Patient IC/NRIC not provided. Contact number unavailable. Allergy history unknown.",
    aiRec: "Proceed with URGENT_WALK_IN template. Collect missing details in parallel during triage. Escalate to duty doctor immediately — workflow should not wait for registration.",
  },
  {
    id: "WF-2024-087",
    patient: "Lim Wei Hong",
    issue: "Routine check-up — AI workflow generated, awaiting manager approval",
    urgency: "pending",
    missing: "Patient IC not on file. Last consultation date unknown — possible returning patient unmatched.",
    aiRec: "Cross-check patient name against records using phone number. If no match, register as new patient. Workflow can proceed with standard appointment template.",
  },
  {
    id: "WF-2024-083",
    patient: "Elderly patient (unidentified)",
    issue: "Walk-in, elderly female ~70s, wrist pain after fall — incomplete registration blocked",
    urgency: "blocked",
    missing: "Full name unknown. IC unavailable. Medical history absent. Emergency contact not collected. Language barrier — Malay only.",
    aiRec: "Create placeholder record with son as emergency contact. Use WALK_IN_PARTIAL template. Clinical triage must not wait for registration. Flag for admin follow-up post-treatment.",
  },
]

const urgencyConfig = {
  urgent: { label: "Urgent", badge: "bg-red-100 text-red-700 border-red-200", border: "border-red-200" },
  pending: { label: "Pending", badge: "bg-amber-100 text-amber-700 border-amber-200", border: "border-amber-200" },
  blocked: { label: "Blocked", badge: "bg-red-100 text-red-700 border-red-200", border: "" },
}

// 2. Remove addToast from props here
function ReviewCard({ c, onResolve }) {
  const [resolved, setResolved] = useState(false)
  
  // 3. Hook into the global store directly from the child component!
  const addToast = useToastStore((state) => state.addToast) 
  
  const uc = urgencyConfig[c.urgency]

  const resolve = (msg) => {
    setResolved(true)
    onResolve(msg)
  }

  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${resolved ? "opacity-40 pointer-events-none grayscale" : "border-slate-200 hover:shadow-md hover:border-blue-300"}`}>
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div>
          <p className="text-sm font-bold text-slate-800">{c.patient} — <span className="font-mono text-[11px] text-slate-400">{c.id}</span></p>
          <p className="text-xs text-slate-500 mt-0.5">{c.issue}</p>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${uc.badge} flex-shrink-0`}>
          {uc.label}
        </span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Missing info */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Missing Information</p>
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700 leading-relaxed">{c.missing}</p>
          </div>
        </div>

        {/* AI Recommendation */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
            <span className="inline-flex items-center gap-1"><Info size={10} /> AI Recommendation</span>
          </p>
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-800 leading-relaxed">{c.aiRec}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50 mt-4">
          <button
            onClick={() => resolve(`Workflow approved — ${c.patient} proceeding`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <CheckCircle2 size={12} /> Approve AI Rec
          </button>
          <button
            onClick={() => addToast("info", `Request sent to front desk to collect missing info for ${c.patient}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            <UserCheck size={12} /> Request Info
          </button>
          <button
            onClick={() => addToast("warn", `Case reassigned to duty doctor for ${c.patient}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-200 text-amber-700 bg-amber-50 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
          >
            <ArrowUpRight size={12} /> Reassign
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. Remove addToast from props here as well!
export default function HumanReview() {
  const [cases, setCases] = useState(INITIAL_CASES)
  
  // 5. Hook into the global store for the parent component
  const addToast = useToastStore((state) => state.addToast)

  const handleResolve = (id, msg) => {
    addToast("success", msg)
    // Auto-remove the case after a short delay
    setTimeout(() => {
      setCases(prev => prev.filter(c => c.id !== id))
    }, 800)
  }

  const activeCount = cases.length

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Human Intervention</h1>
            {activeCount > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                {activeCount} Actionable
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Workflows flagged by the AI due to missing critical data or ambiguous logic.
          </p>
        </div>
      </div>

      {activeCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <CheckCircle2 size={48} className="text-emerald-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">All Clear!</h3>
          <p className="text-sm text-slate-500 mt-1">No pending workflows require human review right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
          {cases.map(c => (
            <ReviewCard
              key={c.id}
              c={c}
              onResolve={(msg) => handleResolve(c.id, msg)}
              // 6. We no longer need to pass addToast={addToast} down here!
            />
          ))}
        </div>
      )}
    </div>
  )
}