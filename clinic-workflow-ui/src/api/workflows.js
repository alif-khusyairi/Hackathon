// src/api/workflows.js
// Query wrappers for workflows. Pages call these instead of using `supabase` directly.
//
// Why a wrapper: the API shape stays stable even if the underlying Supabase
// query changes (e.g. switching to an RPC, adding caching, etc.).

import { supabase } from "../lib/supabase"

// Fetch all workflows with their patient and task progress.
// Returns workflows ordered newest-first, each enriched with:
//   - patient: { full_name } | null
//   - total_tasks: number
//   - completed_tasks: number
export async function getWorkflows() {
  // Single query that joins patients and counts tasks via Supabase's relational syntax.
  // The `tasks(count)` aggregates the related rows server-side.
  const { data, error } = await supabase
    .from("workflows")
    .select(`
      id,
      title,
      type,
      status,
      priority,
      summary,
      created_at,
      patient:patients ( full_name ),
      tasks ( id, status )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  // Compute task progress on the client (tasks come back as an array)
  return data.map((wf) => ({
    ...wf,
    total_tasks: wf.tasks?.length || 0,
    completed_tasks: wf.tasks?.filter((t) => t.status === "done").length || 0,
  }))
}

// Fetch a single workflow with all its tasks (ordered).
export async function getWorkflowById(id) {
  const { data, error } = await supabase
    .from("workflows")
    .select(`
      *,
      patient:patients ( id, full_name, ic_number, phone, allergies ),
      tasks ( * )
    `)
    .eq("id", id)
    .single()

  if (error) throw error

  // Sort tasks by order_index (Supabase doesn't sort embedded relations by default)
  if (data?.tasks) {
    data.tasks.sort((a, b) => a.order_index - b.order_index)
  }
  return data
}

// Approve a workflow: flip status from pending_review → active,
// stamp approved_by + approved_at.
export async function approveWorkflow(id) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("workflows")
    .update({
      status: "active",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Stats for Sidebar badges and Dashboard cards.
// Returns { active, pending_review, delayed, completed }
export async function getWorkflowCounts() {
  const { data, error } = await supabase
    .from("workflows")
    .select("status")

  if (error) throw error

  const counts = { active: 0, pending_review: 0, delayed: 0, completed: 0, cancelled: 0 }
  data.forEach((w) => {
    if (counts[w.status] !== undefined) counts[w.status]++
  })
  return counts
}