import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToastStore } from "../store/useToastStore"

import WorkflowInput from "../components/WorkflowInput"
import WorkflowResult from "../components/WorkflowResult"

// Mock GLM logic — emits the SAME shape that the real Supabase API will return.
// Tasks now use `status` (todo/in_progress/done) and `task_type` (lab/urgent/etc.)
// instead of the old `type` field which conflated execution state and category.
export function buildWorkflow(input, type, priority) {
  const lower = input.toLowerCase()
  const isUrgent = lower.includes("chest") || lower.includes("dizziness") || priority === "urgent"
  const isLab = lower.includes("lab") || lower.includes("fbc") || type === "lab"

  if (isLab) {
    return {
      title: "Lab Order Workflow",
      type: "lab_order",
      status: "pending_review",
      priority: priority === "urgent" ? "urgent" : "normal",
      patient: "As specified in input",
      missingInfo: "None",
      summary: "GLM interpreted a lab order request and generated a complete sample collection → processing → results workflow.",
      steps: [
        { title: "Confirm patient identity & generate lab request form", assignee_role: "system",      time: "Immediate",      status: "done",        task_type: "lab", requires_human_action: false, is_escalation: false },
        { title: "Collect blood/sample from patient",                    assignee_role: "lab_tech",    time: "30 min",         status: "in_progress", task_type: "lab", requires_human_action: true,  is_escalation: false },
        { title: "Process requested tests",                              assignee_role: "lab_tech",    time: "45–90 min",      status: "in_progress", task_type: "lab", requires_human_action: false, is_escalation: false },
        { title: "Enter results — auto-flag critical values",            assignee_role: "lab_tech",    time: "Post-processing", status: "in_progress",task_type: "lab", requires_human_action: false, is_escalation: false },
        { title: "Notify ordering doctor",                               assignee_role: "system",      time: "Immediate",      status: "in_progress", task_type: "lab", requires_human_action: false, is_escalation: false },
        { title: "Schedule follow-up",                                   assignee_role: "receptionist",time: "After review",   status: "todo",        task_type: "follow_up", requires_human_action: true, is_escalation: true },
      ],
    }
  }

  if (isUrgent) {
    return {
      title: "Urgent Walk-In Workflow",
      type: "urgent_walk_in",
      status: "pending_review",
      priority: "urgent",
      patient: "Walk-In (details pending)",
      missingInfo: "Patient IC, contact number, medical history",
      summary: "GLM detected urgent clinical flags. URGENT_WALK_IN template applied. Immediate doctor escalation required — patient detail collection to proceed in parallel.",
      steps: [
        { title: "URGENT: Notify duty doctor immediately",            assignee_role: "system",      time: "0 min",       status: "todo",        task_type: "urgent", requires_human_action: false, is_escalation: true },
        { title: "Triage & vitals — BP, O2, pulse, temp",             assignee_role: "nurse",       time: "5 min",       status: "in_progress", task_type: "urgent", requires_human_action: true,  is_escalation: false },
        { title: "Collect patient details (parallel track)",          assignee_role: "receptionist",time: "10 min",      status: "in_progress", task_type: "missing_data", requires_human_action: true, is_escalation: false, gap: "Missing: IC, contact, allergies" },
        { title: "Doctor consultation",                               assignee_role: "doctor",      time: "15 min",      status: "todo",        task_type: "urgent", requires_human_action: true,  is_escalation: true },
        { title: "Determine next action: ECG / Lab / Referral",       assignee_role: "doctor",      time: "Post-consult",status: "todo",        task_type: "urgent", requires_human_action: true,  is_escalation: true },
      ],
    }
  }

  return {
    title: "Clinic Appointment Workflow",
    type: "appointment",
    status: "pending_review",
    priority: priority === "urgent" ? "urgent" : "normal",
    patient: "As specified in input",
    missingInfo: "None",
    summary: "GLM interpreted an appointment request and generated a standard clinic workflow with check-in, triage, consultation, and discharge steps.",
    steps: [
      { title: "Confirm appointment slot",               assignee_role: "receptionist",time: "Immediate",         status: "todo",        task_type: "appointment", requires_human_action: true,  is_escalation: true },
      { title: "Send confirmation to patient/guardian",  assignee_role: "system",      time: "5 min",             status: "in_progress", task_type: "appointment", requires_human_action: false, is_escalation: false },
      { title: "Patient check-in & triage on visit day", assignee_role: "nurse",       time: "Visit day",         status: "in_progress", task_type: "appointment", requires_human_action: true,  is_escalation: false },
      { title: "Doctor consultation",                    assignee_role: "doctor",      time: "15 min post-triage",status: "todo",        task_type: "appointment", requires_human_action: true,  is_escalation: true },
      { title: "Prescription / discharge / referral",    assignee_role: "doctor",      time: "Post-consult",      status: "in_progress", task_type: "appointment", requires_human_action: false, is_escalation: false },
    ],
  }
}

export default function NewWorkflow() {
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)
  const [workflow, setWorkflow] = useState(null)

  const handleGenerate = (input, type, priority) => {
    const wf = buildWorkflow(input, type, priority)
    setWorkflow(wf)
    addToast("success", `Workflow generated — ${wf.steps.length} steps, ready for approval`)
  }

  const handleApprove = () => {
    setWorkflow(null)
    addToast("success", "Workflow activated — staff notified")
    navigate("/task-board")
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
            onReset={() => setWorkflow(null)}
          />
        </div>
      </div>
    </div>
  )
}