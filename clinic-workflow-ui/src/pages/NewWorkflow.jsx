import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToastStore } from "../store/useToastStore"
import { createWorkflow } from "../api/workflows"

import WorkflowInput from "../components/WorkflowInput"
import WorkflowResult from "../components/WorkflowResult"

// Mock GLM logic — emits the SAME shape that the real API will return.
// Tasks use `status` (todo/in_progress/done) and `task_type` (lab/urgent/etc.)
export function buildWorkflow(input, type, priority) {
  const lower = input.toLowerCase()
  const isUrgent = lower.includes("chest") || lower.includes("dizziness") || priority === "urgent"
  const isLab = lower.includes("lab") || lower.includes("fbc") || type === "lab"

  // Naive "patient name" extraction from the input.
  // The real GLM will do this much better; this is just so the demo is convincing.
  const patient = extractPatientName(input)

  if (isLab) {
    return {
      title: "Lab Order Workflow",
      type: "lab_order",
      status: "pending_review",
      priority: priority === "urgent" ? "urgent" : "normal",
      patient: patient || "Patient (name pending)",
      missingInfo: "None",
      summary: "GLM interpreted a lab order request and generated a complete sample collection → processing → results workflow.",
      steps: [
        { title: "Confirm patient identity & generate lab request form", assignee_role: "system",      status: "done",        task_type: "lab",       requires_human_action: false, is_escalation: false, time: "Immediate" },
        { title: "Collect blood/sample from patient",                    assignee_role: "lab_tech",    status: "in_progress", task_type: "lab",       requires_human_action: true,  is_escalation: false, time: "30 min" },
        { title: "Process requested tests",                              assignee_role: "lab_tech",    status: "in_progress", task_type: "lab",       requires_human_action: false, is_escalation: false, time: "45–90 min" },
        { title: "Enter results — auto-flag critical values",            assignee_role: "lab_tech",    status: "in_progress", task_type: "lab",       requires_human_action: false, is_escalation: false, time: "Post-processing" },
        { title: "Notify ordering doctor",                               assignee_role: "system",      status: "in_progress", task_type: "lab",       requires_human_action: false, is_escalation: false, time: "Immediate" },
        { title: "Schedule follow-up",                                   assignee_role: "receptionist",status: "todo",        task_type: "follow_up", requires_human_action: true,  is_escalation: true,  time: "After review" },
      ],
    }
  }

  if (isUrgent) {
    return {
      title: "Urgent Walk-In Workflow",
      type: "urgent_walk_in",
      status: "pending_review",
      priority: "urgent",
      patient: patient || "Unknown walk-in",
      missingInfo: patient ? "Contact number, medical history" : "Patient IC, contact number, medical history",
      summary: "GLM detected urgent clinical flags. URGENT_WALK_IN template applied. Immediate doctor escalation required — patient detail collection to proceed in parallel.",
      steps: [
        { title: "URGENT: Notify duty doctor immediately",            assignee_role: "system",      status: "todo",        task_type: "urgent",       requires_human_action: false, is_escalation: true,  time: "0 min" },
        { title: "Triage & vitals — BP, O2, pulse, temp",             assignee_role: "nurse",       status: "in_progress", task_type: "urgent",       requires_human_action: true,  is_escalation: false, time: "5 min" },
        { title: "Collect patient details (parallel track)",          assignee_role: "receptionist",status: "in_progress", task_type: "missing_data", requires_human_action: true,  is_escalation: false, time: "10 min" },
        { title: "Doctor consultation",                               assignee_role: "doctor",      status: "todo",        task_type: "urgent",       requires_human_action: true,  is_escalation: true,  time: "15 min" },
        { title: "Determine next action: ECG / Lab / Referral",       assignee_role: "doctor",      status: "todo",        task_type: "urgent",       requires_human_action: true,  is_escalation: true,  time: "Post-consult" },
      ],
    }
  }

  return {
    title: "Clinic Appointment Workflow",
    type: "appointment",
    status: "pending_review",
    priority: priority === "urgent" ? "urgent" : "normal",
    patient: patient || "Patient (name pending)",
    missingInfo: "None",
    summary: "GLM interpreted an appointment request and generated a standard clinic workflow with check-in, triage, consultation, and discharge steps.",
    steps: [
      { title: "Confirm appointment slot",               assignee_role: "receptionist",status: "todo",        task_type: "appointment", requires_human_action: true,  is_escalation: true,  time: "Immediate" },
      { title: "Send confirmation to patient/guardian",  assignee_role: "system",      status: "in_progress", task_type: "appointment", requires_human_action: false, is_escalation: false, time: "5 min" },
      { title: "Patient check-in & triage on visit day", assignee_role: "nurse",       status: "in_progress", task_type: "appointment", requires_human_action: true,  is_escalation: false, time: "Visit day" },
      { title: "Doctor consultation",                    assignee_role: "doctor",      status: "todo",        task_type: "appointment", requires_human_action: true,  is_escalation: true,  time: "15 min post-triage" },
      { title: "Prescription / discharge / referral",    assignee_role: "doctor",      status: "in_progress", task_type: "appointment", requires_human_action: false, is_escalation: false, time: "Post-consult" },
    ],
  }
}

// Pull a likely patient name from free text.
// Returns null if nothing reasonable found — caller will substitute a fallback.
function extractPatientName(text) {
  if (!text) return null

  // "patient Ahmad bin Ismail" or "for Ahmad bin Ismail" or "name: Ahmad bin Ismail"
  const labelMatch = text.match(/(?:patient|for|name:?)\s+([A-Z][a-zA-Z]+(?:\s+(?:bin|binti|a\/l|a\/p|[A-Z][a-zA-Z]+)){1,4})/i)
  if (labelMatch) return cleanName(labelMatch[1])

  // "Mr/Mrs/Ms/Dr X Y" or Malay equivalents
  const titleMatch = text.match(/\b(Mr|Mrs|Ms|Dr|Encik|Puan|Cik)\.?\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,3})/)
  if (titleMatch) return cleanName(`${titleMatch[1]} ${titleMatch[2]}`)

  // Bare capitalized 2-3 word sequence
  const bareMatch = text.match(/\b([A-Z][a-z]+(?:\s+(?:bin|binti|a\/l|a\/p))?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/)
  if (bareMatch) return cleanName(bareMatch[1])

  return null
}

function cleanName(name) {
  return name.replace(/\s+/g, " ").trim()
}

export default function NewWorkflow() {
  const navigate = useNavigate()
  const addToast = useToastStore((s) => s.addToast)
  const [workflow, setWorkflow] = useState(null)
  const [rawInput, setRawInput] = useState("")  // remember the input for the raw_input column
  const [saving, setSaving] = useState(false)

  const handleGenerate = (input, type, priority) => {
    const wf = buildWorkflow(input, type, priority)
    setWorkflow(wf)
    setRawInput(input)
    addToast("success", `Workflow generated — ${wf.steps.length} steps, ready for approval`)
  }

  const handleApprove = async () => {
    if (!workflow) return
    setSaving(true)
    try {
      await createWorkflow(workflow, rawInput)
      addToast("success", "Workflow saved and activated — staff notified")
      setWorkflow(null)
      setRawInput("")
      navigate("/queue")  // redirect so user sees their new workflow in context
    } catch (err) {
      console.error("createWorkflow failed:", err)
      addToast("warn", err.message || "Failed to save workflow")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Generate New Workflow</h1>
          <p className="text-sm text-slate-500 mt-1">
            Paste any unstructured input — GLM extracts intent and generates a structured, actionable workflow.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6 items-start">
        <div className="sticky top-6">
          <WorkflowInput onGenerate={handleGenerate} />
        </div>
        <div className="min-w-0">
          <WorkflowResult
            data={workflow}
            onApprove={handleApprove}
            onReset={() => { setWorkflow(null); setRawInput("") }}
            saving={saving}
          />
        </div>
      </div>
    </div>
  )
}