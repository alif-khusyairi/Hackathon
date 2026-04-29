import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";

// Pages
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewWorkflow from "./pages/NewWorkflow";
import WorkflowQueue from "./pages/WorkflowQueue";
import TaskBoard from "./pages/TaskBoard";
import HumanReview from "./pages/HumanReview";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-slate-50 min-w-[1024px]">
        
        {/* Notice how Sidebar and Navbar no longer need props! */}
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <main className="flex-1 overflow-y-auto p-6 bg-slate-100">
            {/* React Router handles the page switching based on the URL */}
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-workflow" element={<NewWorkflow />} />
              <Route path="/queue" element={<WorkflowQueue />} />
              <Route path="/task-board" element={<TaskBoard />} />
              <Route path="/human-review" element={<HumanReview />} />
            </Routes>
          </main>
        </div>

        {/* Global Toast Listener */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;