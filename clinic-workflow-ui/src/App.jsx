import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"

// Simple page router - add more pages here later
const PAGES = {
  DASHBOARD: "dashboard",
  NEW_WORKFLOW: "new-workflow",
  WORKFLOW_QUEUE: "workflow-queue",
  TASK_BOARD: "task-board",
  HUMAN_REVIEW: "human-review",
}

function App() {
  const [activePage, setActivePage] = useState(PAGES.DASHBOARD)
  const [toasts, setToasts] = useState([])

  const addToast = (type, message) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const navigate = (page) => setActivePage(page)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar activePage={activePage} navigate={navigate} PAGES={PAGES} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar addToast={addToast} />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <Dashboard navigate={navigate} addToast={addToast} PAGES={PAGES} />
        </main>
      </div>

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>
    </div>
  )
}

// Inline Toast so you don't need a separate file yet
function Toast({ type, message }) {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warn: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }
  const icons = { success: "✓", warn: "⚠", info: "ℹ" }
  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium pointer-events-auto ${
        styles[type] || styles.info
      }`}
    >
      <span className="font-bold">{icons[type] || icons.info}</span>
      {message}
    </div>
  )
}

export default App