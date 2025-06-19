import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { format, isThisWeek, parseISO } from "date-fns";
import { JobApplication } from "@/app/jobs/JobTracker";

function getStats(jobs: JobApplication[]) {
  const total = jobs.length;
  const byStatus: Record<string, number> = {};
  let lastApplied: JobApplication | null = null;
  let tasksDue: { job: JobApplication; task: any }[] = [];
  for (const job of jobs) {
    byStatus[job.status] = (byStatus[job.status] || 0) + 1;
    if (!lastApplied || new Date(job.dateApplied) > new Date(lastApplied.dateApplied)) {
      lastApplied = job;
    }
    for (const task of job.tasks) {
      if (task.dueDate && isThisWeek(parseISO(task.dueDate))) {
        tasksDue.push({ job, task });
      }
    }
  }
  return { total, byStatus, lastApplied, tasksDue };
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("job-tracker-jobs");
    if (stored) setJobs(JSON.parse(stored));
  }, []);
  const stats = getStats(jobs);
  return (
    <div className="max-w-4xl mx-auto p-4 grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card className="p-6">
        <div className="font-semibold text-lg mb-2">Total Applications</div>
        <div className="text-3xl font-bold">{stats.total}</div>
      </Card>
      <Card className="p-6">
        <div className="font-semibold text-lg mb-2">Jobs per Status</div>
        <ul className="space-y-1">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <li key={status} className="flex justify-between">
              <span>{status}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-6 md:col-span-2">
        <div className="font-semibold text-lg mb-2">Last Applied Job</div>
        {stats.lastApplied ? (
          <div>
            <div className="font-bold">{stats.lastApplied.position} @ {stats.lastApplied.company}</div>
            <div className="text-xs text-muted-foreground">Applied: {format(new Date(stats.lastApplied.dateApplied), "PPP")}</div>
          </div>
        ) : <div className="text-muted-foreground">No jobs found.</div>}
      </Card>
      <Card className="p-6 md:col-span-2">
        <div className="font-semibold text-lg mb-2">Tasks Due This Week</div>
        {stats.tasksDue.length > 0 ? (
          <ul className="space-y-1">
            {stats.tasksDue.map(({ job, task }) => (
              <li key={task.id}>
                <span className="font-semibold">{task.text}</span> (Job: {job.position} @ {job.company}, Due: {format(parseISO(task.dueDate), "PPP")})
              </li>
            ))}
          </ul>
        ) : <div className="text-muted-foreground">No tasks due this week.</div>}
      </Card>
    </div>
  );
}
