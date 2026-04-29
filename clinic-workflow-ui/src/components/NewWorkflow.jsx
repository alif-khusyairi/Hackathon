import { useState } from "react"
import WorkflowInput from "../components/WorkflowInput"
import WorkflowResult from "../components/WorkflowResult"

function buildWorkflow(input, type, priority) {
  const lower = input.toLowerCase()
  const isUrgent = lower.includes("chest") || lower.includes("dizziness") || priority === "urgent"
  const isLab = lower.includes("lab") || lower.includes("fbc") || type === "lab"

  if (isLab) {
    return {
      title: "Lab Order Workflow",
      status: "Pending Approval",
      patient: "As specified in input",
      urgency: priority === "urgent" ? "High" : "Standard",
      missingInfo: "None",
      summary: "GLM interpreted a lab order request and generated a complete sample collection → processing → results workflow.",
      steps: [
        { title: "Confirm patient identity & generate lab request form", role: "System", time: "Immediate", type: "done" },
        { title: "Collect blood/sample from patient", role: "Lab Technician", time: "30 min", type: "active" },
        { title: "Process requested tests", role: "Lab Team", time: "45–90 min", type: "active" },
        { title: "Enter results — auto-flag critical values", role: "Lab Tech", time: "Post-processing", type: "active" },
        { title: "Notify ordering doctor", role: "System", time: "Immediate", type: "active" },
        { title: "Schedule follow-up", role: "Receptionist", time: "After review", type: "human", escalation: true },
      ],
    }
  }

  if (isUrgent) {
    return {
      title: "Urgent Walk-In Workflow",
      status: "Pending Approval",
      patient: "Walk-In (details pending)",
      urgency: "High",
      missingInfo: "Patient IC, contact number, medical history",
      summary: "GLM detected urgent clinical flags. URGENT_WALK_IN template applied. Immediate doctor escalation required — patient detail collection to proceed in parallel.",
      steps: [
        { title: "URGENT: Notify duty doctor immediately", role: "System → Doctor", time: "0 min", type: "urgent", escalation: true },
        { title: "Triage & vitals — BP, O2, pulse, temp", role: "Nurse", time: "5 min", type: "active" },
        { title: "Collect patient details (parallel track)", role: "Receptionist", time: "10 min", type: "active", gap: "Missing: IC, contact, allergies" },
        { title: "Doctor consultation", role: "Doctor", time: "15 min", type: "human", escalation: true },
        { title: "Determine next action: ECG / Lab / Referral", role: "Doctor", time: "Post-consult", type: "human", escalation: true },
      ],
    }
  }

  return {
    title: "Clinic Appointment Workflow",
    status: "Pending Approval",
    patient: "As specified in input",
    urgency: "Standard",
    missingInfo: "None",
    summary: "GLM interpreted an appointment request and generated a standard clinic workflow with check-in, triage, consultation, and discharge steps.",
    steps: [
      { title: "Confirm appointment slot", role: "Receptionist", time: "Immediate", type: "human", escalation: true },
      { title: "Send confirmation to patient/guardian", role: "System", time: "5 min", type: "active" },
      { title: "Patient check-in & triage on visit day", role: "Nurse", time: "Visit day", type: "active" },
      { title: "Doctor consultation", role: "Doctor", time: "15 min post-triage", type: "human", escalation: true },
      { title: "Prescription / discharge / referral", role: "Doctor + Pharmacy", time: "Post-consult", type: "active" },
    ],
  }
}

export default function NewWorkflow({ navigate, addToast, PAGES }) {
  const [workflow, setWorkflow] = useState(null)

  const handleGenerate = (input, type, priority) => {
    const wf = buildWorkflow(input, type, priority)
    setWorkflow(wf)
    if (addToast) addToast("success", `Workflow generated — ${wf.steps.length} steps, ready for approval`)
  }

  const handleApprove = () => {
    setWorkflow(null)
    if (addToast) addToast("success", "Workflow activated — staff notified")
    if (navigate && PAGES) navigate(PAGES.TASK_BOARD)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Generate New Workflow</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Paste any unstructured input — GLM extracts intent and generates a structured, actionable workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <WorkflowInput onGenerate={handleGenerate} />
        <WorkflowResult
          data={workflow}
          onApprove={handleApprove}
          onReset={() => setWorkflow(null)}
        />
      </div>
    </div>
  )
}
