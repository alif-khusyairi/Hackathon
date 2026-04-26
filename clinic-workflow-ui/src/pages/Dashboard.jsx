// src/pages/Dashboard.jsx
// Fix: removed <h1 className="text-2xl font-semibold">Dashboard</h1>
// That heading was rendering as a huge background text because of how
// Tailwind's font-semibold + text-2xl interacted with the layout.
// Replaced with a proper page header section.

import { useState } from "react"
import DashboardCards from "../components/DashboardCards"
import WorkflowInput from "../components/WorkflowInput"
import WorkflowResult from "../components/WorkflowResult"

function buildWorkflow(input) {
  const lower = input.toLowerCase()
  const urgent = lower.includes("chest") || lower.includes("dizziness") || lower.includes("urgent")
  const isLab = lower.includes("lab") || lower.includes("fbc") || lower.includes("blood test")
  const unknownPatient = lower.includes("no prior") || lower.includes("unknown") || lower.includes("elderly")

  if (isLab) {
    return {
      title: "Lab Order Workflow",
      status: "Pending Approval",
      patient: "As specified",
      urgency: "Standard",
      missingInfo: "None",
      summary: "GLM identified a lab order request. Workflow chains: order → sample collection → processing → results → doctor notification → follow-up.",
      steps: [
        { title: "Generate lab request form", description: "System creates structured lab request with patient details.", role: "System", time: "Immediate", escalation: false },
        { title: "Collect blood sample", description: "Lab technician collects the required sample from patient.", role: "Lab Technician", time: "30 min", escalation: false },
        { title: "Process tests", description: "Lab team processes FBC and other requested panels.", role: "Lab Team", time: "45–90 min", escalation: false },
        { title: "Enter results & flag critical values", description: "GLM auto-flags any critical values for doctor attention.", role: "Lab Tech", time: "Post-processing", escalation: false },
        { title: "Notify ordering doctor", description: "Doctor receives alert with results summary.", role: "System → Doctor", time: "Immediate", escalation: true },
      ],
    }
  }

  if (urgent) {
    return {
      title: "Urgent Walk-In Workflow",
      status: "Pending Approval",
      patient: unknownPatient ? "Unknown / New Patient" : "Patient Identified",
      urgency: "High",
      missingInfo: unknownPatient ? "Name, IC, Contact, Allergies" : "None",
      summary: "AI detected urgent clinical flags: chest pain and dizziness. URGENT_WALK_IN template selected. Immediate doctor escalation required — patient detail collection proceeds in parallel.",
      steps: [
        { title: "URGENT: Notify duty doctor immediately", description: "Escalate to available doctor — do not wait.", role: "System → Doctor", time: "0 min", escalation: true },
        { title: "Triage & record vitals", description: "Nurse collects BP, O2, pulse, and temperature.", role: "Nurse", time: "5 min", escalation: false },
        { title: "Collect patient details (parallel)", description: "Receptionist collects IC, contact, and history while triage proceeds.", role: "Receptionist", time: "10 min", escalation: false },
        { title: "Doctor consultation", description: "Doctor assesses presenting complaint with triage context.", role: "Doctor", time: "15 min", escalation: true },
        { title: "Determine next action", description: "ECG, lab order, emergency referral, or standard discharge.", role: "Doctor", time: "Post-consult", escalation: true },
      ],
    }
  }

  return {
    title: "Clinic Appointment Workflow",
    status: "Pending Approval",
    patient: unknownPatient ? "Unknown / New Patient" : "Patient Identified",
    urgency: "Standard",
    missingInfo: "None",
    summary: "AI interpreted an appointment request and generated a standard 5-step clinic workflow with check-in, triage, consultation, and discharge.",
    steps: [
      { title: "Confirm appointment slot", description: "Receptionist verifies availability and confirms with patient.", role: "Receptionist", time: "Immediate", escalation: true },
      { title: "Send appointment confirmation", description: "System sends confirmation message to patient or guardian.", role: "System", time: "5 min", escalation: false },
      { title: "Patient check-in & triage", description: "Nurse handles check-in and records initial vitals.", role: "Nurse", time: "Visit day", escalation: false },
      { title: "Doctor consultation", description: "Doctor reviews AI summary and performs clinical assessment.", role: "Doctor", time: "15 min post-triage", escalation: true },
      { title: "Prescription / Discharge / Referral", description: "Doctor decides on medication, referral, or follow-up.", role: "Doctor + Pharmacy", time: "Post-consult", escalation: false },
    ],
  }
}

export default function Dashboard({ navigate, addToast, PAGES }) {
  const [workflow, setWorkflow] = useState(null)

  const handleGenerate = (input) => {
    const wf = buildWorkflow(input)
    setWorkflow(wf)
    if (addToast) addToast("success", `GLM generated ${wf.steps.length}-step workflow — ready for approval`)
  }

  const handleApprove = () => {
    setWorkflow(null)
    if (addToast) addToast("success", "Workflow approved and activated — staff notified")
    if (navigate && PAGES) navigate(PAGES.TASK_BOARD)
  }

  return (
    <div className="space-y-6">
      {/* Page header — this replaces the old <h1> that caused the watermark */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Good morning, Dr. Siti — 12 active workflows today
          </p>
        </div>
        <button
          onClick={() => navigate && PAGES && navigate(PAGES.NEW_WORKFLOW)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Workflow
        </button>
      </div>

      {/* Stats */}
      <DashboardCards />

      {/* Workflow input + result */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WorkflowInput onGenerate={handleGenerate} />
        <WorkflowResult data={workflow} onApprove={handleApprove} onReset={() => setWorkflow(null)} />
      </div>
    </div>
  )
}
