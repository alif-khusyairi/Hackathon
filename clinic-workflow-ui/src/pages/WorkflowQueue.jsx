import { useState } from "react"
import { Search, Filter, Clock, CheckCircle2, AlertCircle, PlayCircle, MoreHorizontal, ArrowRight } from "lucide-react"

// Mock Data for the Queue
const INITIAL_WORKFLOWS = [
  { id: "WF-1045", patient: "Ahmad bin Ismail", type: "Urgent Walk-In", status: "Active", time: "10 min ago", progress: "2/5 steps", priority: "High" },
  { id: "WF-1046", patient: "Tan Bee Leng", type: "Lab Order", status: "Pending Review", time: "15 min ago", progress: "0/6 steps", priority: "Normal" },
  { id: "WF-1047", patient: "Fatimah Zahra", type: "Clinic Appointment", status: "Active", time: "1 hr ago", progress: "4/5 steps", priority: "Normal" },
  { id: "WF-1042", patient: "Rajasegaran", type: "Specialist Referral", status: "Delayed", time: "2 hrs ago", progress: "3/4 steps", priority: "High" },
  { id: "WF-1041", patient: "Unknown Walk-in", type: "Urgent Walk-In", status: "Pending Review", time: "3 hrs ago", progress: "0/5 steps", priority: "High" },
  { id: "WF-1040", patient: "Wong Mei Ling", type: "Routine Checkup", status: "Completed", time: "4 hrs ago", progress: "5/5 steps", priority: "Normal" },
]

export default function WorkflowQueue({ navigate, addToast, PAGES }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All")

  // Helper function to color-code statuses
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return "bg-blue-50 text-blue-700 border-blue-200"
      case "Pending Review": return "bg-amber-50 text-amber-700 border-amber-200"
      case "Delayed": return "bg-red-50 text-red-700 border-red-200"
      case "Completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  // Helper function for status icons
  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <PlayCircle size={14} className="mr-1.5" />
      case "Pending Review": return <Clock size={14} className="mr-1.5" />
      case "Delayed": return <AlertCircle size={14} className="mr-1.5" />
      case "Completed": return <CheckCircle2 size={14} className="mr-1.5" />
      default: return null
    }
  }

  // Filter logic
  const filteredWorkflows = INITIAL_WORKFLOWS.filter(wf => {
    const matchesSearch = wf.patient.toLowerCase().includes(searchTerm.toLowerCase()) || wf.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "All" || wf.status === activeTab
    return matchesSearch && matchesTab
  })

  const handleApprove = (id) => {
    if (addToast) addToast("success", `Workflow ${id} approved and moved to Active.`)
  }

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workflow Queue</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, approve, and track all active patient workflows in the clinic.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ID or Patient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        {["All", "Pending Review", "Active", "Delayed", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Workflow Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-[100px_2fr_1.5fr_1.5fr_1fr_100px] gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div>ID</div>
          <div>Patient & Type</div>
          <div>Status</div>
          <div>Progress</div>
          <div>Created</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {filteredWorkflows.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No workflows found matching your criteria.</div>
          ) : (
            filteredWorkflows.map((wf) => (
              <div key={wf.id} className="grid grid-cols-[100px_2fr_1.5fr_1.5fr_1fr_100px] gap-4 p-4 items-center hover:bg-slate-50 transition-colors group">
                
                {/* ID */}
                <div className="text-sm font-mono font-medium text-slate-600">{wf.id}</div>
                
                {/* Patient & Type */}
                <div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {wf.patient}
                    {wf.priority === "High" && (
                      <span className="w-2 h-2 rounded-full bg-red-500" title="High Priority"></span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{wf.type}</div>
                </div>

                {/* Status Badge */}
                <div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(wf.status)}`}>
                    {getStatusIcon(wf.status)}
                    {wf.status}
                  </span>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-600 font-medium">{wf.progress}</div>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${wf.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                      style={{ width: `${(parseInt(wf.progress[0]) / parseInt(wf.progress[2])) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="text-sm text-slate-500">{wf.time}</div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  {wf.status === "Pending Review" ? (
                    <button 
                      onClick={() => handleApprove(wf.id)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-md transition-colors"
                    >
                      Approve
                    </button>
                  ) : (
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  )}
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}