import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { saveToFile, readFromFile, autosaveToLocalStorage } from "@/lib/storage";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
      setJobs(data);
    });
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
      <div className="text-muted-foreground">Job tracker UI coming soon.</div>
    </div>
  );
}
