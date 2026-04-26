import { useState } from "react"
import { AlertTriangle, CheckCircle2, ArrowUpRight, UserCheck, Info } from "lucide-react"

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

function ReviewCard({ c, onResolve, addToast }) {
  const [resolved, setResolved] = useState(false)
  const uc = urgencyConfig[c.urgency]

  const resolve = (msg) => {
    setResolved(true)
    onResolve(msg)
  }

  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${resolved ? "opacity-40 pointer-events-none" : "border-slate-200 hover:shadow-md"}`}>
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
            <p className="text-xs text-red-700">{c.missing}</p>
          </div>
        </div>

        {/* AI Recommendation */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
            <span className="inline-flex items-center gap-1"><Info size={10} /> AI Recommendation</span>
          </p>
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-800">{c.aiRec}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => resolve(`Workflow approved — ${c.patient} proceeding`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            <CheckCircle2 size={12} /> Approve
          </button>
          <button
            onClick={() => addToast("info", `Request sent to collect missing information for ${c.patient}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            <UserCheck size={12} /> Request Info
          </button>
          <button
            onClick={() => addToast("warn", `Case reassigned for ${c.patient}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-300 text-amber-700 bg-amber-50 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
          >
            <ArrowUpRight size={12} /> Reassign
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HumanReview({ addToast }) {
  const [cases, setCases] = useState(INITIAL_CASES)

  const handleResolve = (id, msg) => {
    addToast("success", msg)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Human Intervention Required</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {cases.length} workflow{cases.length !== 1 ? "s" : ""} need your decision before they can proceed
        </p>
      </div>

      <div className="space-y-4">
        {cases.map(c => (
          <ReviewCard
            key={c.id}
            c={c}
            onResolve={(msg) => handleResolve(c.id, msg)}
            addToast={addToast}
          />
        ))}
      </div>
    </div>
  )
}
