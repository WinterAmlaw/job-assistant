import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  company: string;
  url: string;
  location?: string;
  date?: string;
}

export default function ScrapeJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      // Try GitHub Jobs API (deprecated, fallback to RemoteOK)
      const res = await fetch("https://remoteok.com/api");
      const data = await res.json();
      const jobs = (data || []).filter((j: any) => j.position || j.title).map((j: any) => ({
        id: j.id?.toString() || j.url,
        title: j.position || j.title,
        company: j.company,
        url: j.url,
        location: j.location,
        date: j.date,
      }));
      setJobs(jobs);
    } catch (e) {
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scrape Jobs</h1>
      <Button onClick={fetchJobs} disabled={loading} className="mb-4">
        {loading ? "Loading..." : "Fetch Jobs"}
      </Button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4 flex flex-col gap-1">
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:underline">
              {job.title}
            </a>
            <div className="text-muted-foreground">{job.company} {job.location && `· ${job.location}`}</div>
            {job.date && <div className="text-xs text-muted-foreground">{job.date}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}
