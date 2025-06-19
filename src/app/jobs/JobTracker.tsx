import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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

  // TODO: Add UI for add/edit/delete jobs, and display job list
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Tracker</h1>
      <div className="text-muted-foreground">Job tracker UI coming soon.</div>
    </div>
  );
}
