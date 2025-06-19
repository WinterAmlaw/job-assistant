"use client";
import { useState } from "react";
import { compareKeywords } from "@/lib/keywordMatcher";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ResumeKeywordAnalyzer() {
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState<null | ReturnType<typeof compareKeywords>>(null);

  function handleAnalyze() {
    setResult(compareKeywords(jobDesc, resume));
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Keyword Analyzer</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Job Description</label>
        <Textarea
          value={jobDesc}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDesc(e.target.value)}
          rows={6}
          placeholder="Paste job description here..."
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Resume Text</label>
        <Textarea
          value={resume}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResume(e.target.value)}
          rows={6}
          placeholder="Paste or upload resume text here..."
        />
      </div>
      <Button onClick={handleAnalyze} className="mb-4">Analyze</Button>
      {result && (
        <div className="space-y-2">
          <div className="font-semibold">Match: {result.matchPercent}%</div>
          <div>
            <span className="font-semibold">Missing Keywords:</span>
            <span className="ml-2 text-red-500">{result.missing.join(", ") || "None"}</span>
          </div>
          <div>
            <span className="font-semibold">Unique Resume Keywords:</span>
            <span className="ml-2 text-blue-500">{result.unique.join(", ") || "None"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
