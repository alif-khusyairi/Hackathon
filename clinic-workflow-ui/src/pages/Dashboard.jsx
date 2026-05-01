import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToastStore } from "../store/useToastStore"

import DashboardCards from "../components/DashboardCards"
import WorkflowInput from "../components/WorkflowInput"
import WorkflowResult from "../components/WorkflowResult"

// Single source of truth for the mock GLM logic — imported from NewWorkflow
// so we don't maintain two copies of the same function.
import { buildWorkflow } from "./NewWorkflow"

export default function Dashboard() {
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)
  const [workflow, setWorkflow] = useState(null)

  const handleGenerate = (input) => {
    // Dashboard's quick-input doesn't expose type/priority controls — let GLM auto-detect.
    const wf = buildWorkflow(input, "auto", "normal")
    setWorkflow(wf)
    addToast("success", `GLM generated ${wf.steps.length}-step workflow — ready for approval`)
  }

  const handleApprove = () => {
    setWorkflow(null)
    addToast("success", "Workflow approved and activated — staff notified")
    navigate("/task-board")
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-8">
      
      {/* Page header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Good morning, Dr. Siti — <span className="font-medium text-slate-700">12 active workflows today</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/new-workflow")}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Workflow
        </button>
      </div>

      {/* Stats */}
      <DashboardCards />

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start">
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