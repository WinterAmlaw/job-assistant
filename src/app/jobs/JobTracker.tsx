import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { saveToFile, readFromFile, autosaveToLocalStorage } from "@/lib/storage";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export type JobStatus = "Applied" | "Interviewing" | "Rejected" | "Offer";

export interface JobTask {
  id: string;
  text: string;
  dueDate?: string;
  completed: boolean;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  dateApplied: string;
  notes: string;
  tasks: JobTask[];
}

export default function JobTracker() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [newTaskText, setNewTaskText] = useState<{ [jobId: string]: string }>({});
  const [newTaskDue, setNewTaskDue] = useState<{ [jobId: string]: string }>({});
  const [pendingImport, setPendingImport] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("job-tracker-jobs");
    if (stored) setJobs(JSON.parse(stored));
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    autosaveToLocalStorage("job-tracker-jobs", jobs);
  }, [jobs]);

  function handleSave() {
    saveToFile(jobs, "jobs.json");
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    readFromFile(file).then((data) => {
      setPendingImport(data);
      setShowDialog(true);
    });
  }

  function confirmImport() {
    setJobs(pendingImport);
    setPendingImport(null);
    setShowDialog(false);
  }

  function cancelImport() {
    setPendingImport(null);
    setShowDialog(false);
  }

  // Task management helpers
  function addTask(jobId: string, text: string, dueDate?: string) {
    setJobs(jobs => jobs.map(job => job.id === jobId ? {
      ...job,
      tasks: [
        ...job.tasks,
        { id: Date.now().toString(), text, dueDate, completed: false }
      ]
    } : job));
  }
  function toggleTask(jobId: string, taskId: string) {
    setJobs(jobs => jobs.map(job => job.id === jobId ? {
      ...job,
      tasks: job.tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task)
    } : job));
  }
  function setTaskText(jobId: string, value: string) {
    setNewTaskText({ ...newTaskText, [jobId]: value });
  }
  function setTaskDue(jobId: string, value: string) {
    setNewTaskDue({ ...newTaskDue, [jobId]: value });
  }

  // Filtering and sorting
  const filteredJobs = jobs.filter(job =>
    statusFilter === "all" ? true : job.status === statusFilter
  );
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOrder === "desc") {
      return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
    } else {
      return new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
    }
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Tracker</h1>
      <div className="flex gap-2 mb-4">
        <Button onClick={handleSave}>Save to JSON</Button>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Import from JSON
        </Button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImport}
        />
      </div>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-xs mb-1">Filter by Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-xs mb-1">Sort by Date</label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-8">
        {sortedJobs.map(job => (
          <div key={job.id} className="border rounded-lg p-4">
            <div className="font-semibold text-lg mb-1">{job.position} @ {job.company}</div>
            <div className="text-xs text-muted-foreground mb-2">
              Status: {job.status} · Applied: {job.dateApplied}
            </div>
            <div className="mb-2">Notes: {job.notes}</div>
            <div className="mb-2">
              <div className="font-medium mb-1">Tasks</div>
              <div className="space-y-2">
                {job.tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(job.id, task.id)} />
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.text}</span>
                    {task.dueDate && <span className="text-xs text-muted-foreground ml-2">Due: {task.dueDate}</span>}
                  </div>
                ))}
              </div>
              <form className="flex gap-2 mt-2" onSubmit={e => { e.preventDefault(); addTask(job.id, newTaskText[job.id] || "", newTaskDue[job.id]); setTaskText(job.id, ""); setTaskDue(job.id, ""); }}>
                <Input
                  value={newTaskText[job.id] || ""}
                  onChange={e => setTaskText(job.id, e.target.value)}
                  placeholder="Add task..."
                  className="w-40"
                />
                <Input
                  type="date"
                  value={newTaskDue[job.id] || ""}
                  onChange={e => setTaskDue(job.id, e.target.value)}
                  className="w-36"
                />
                <Button type="submit" size="sm">Add</Button>
              </form>
            </div>
          </div>
        ))}
        {sortedJobs.length === 0 && <div className="text-muted-foreground">No jobs found.</div>}
      </div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace all jobs with imported data?</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="mb-2 text-sm text-muted-foreground">This will overwrite your current job tracker data.</div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelImport}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
