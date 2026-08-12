import type { Route } from "./+types/home";

import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useMemo, useState} from "react";
import Navbar from "~/Components/Navbar";
import ResumeCard from "~/Components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CVsense" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  const handleResumeDeleted = (deletedId: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== deletedId));
  };

  const filteredResumes = useMemo(() => {
    if (!query.trim()) return resumes;
    const q = query.toLowerCase();
    return resumes.filter((r) =>
        r.companyName?.toLowerCase().includes(q) ||
        r.jobTitle?.toLowerCase().includes(q)
    );
  }, [resumes, query]);

  return <main className="dashboard-bg">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <span className="section-eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent-cyan pulse-glow" />
          Resume History
        </span>
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ): (
          <h2>Review your past submissions and revisit your AI-powered feedback anytime.</h2>
        )}
      </div>

      {!loadingResumes && resumes.length > 0 && (
          <div className="w-full max-w-md relative">
            <svg viewBox="0 0 24 24" fill="none" className="size-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by company or job title..."
                className="pl-11"
            />
          </div>
      )}

      {loadingResumes && (
          <div className="flex flex-col items-center justify-center gap-4">
            <img src="/images/resume-scan-2.gif" className="w-50 rounded-2xl" />
            <p className="text-sm text-slate-500 font-mono animate-pulse">Loading your resume history…</p>
          </div>
      )}

      {!loadingResumes && filteredResumes.length > 0 && (
        <div className="resumes-section">
          {filteredResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={() => handleResumeDeleted(resume.id)} />
          ))}
        </div>
      )}

      {!loadingResumes && resumes.length > 0 && filteredResumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-6 gap-2 text-slate-500">
            <p>No resumes match "{query}".</p>
          </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-6">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-surface-800/70 border border-border-soft text-slate-500 float-slow">
              <svg viewBox="0 0 24 24" fill="none" className="size-8" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3.5H14L19 8.5V20.5C19 21.0523 18.5523 21.5 18 21.5H7C6.44772 21.5 6 21.0523 6 20.5V4.5C6 3.94772 6.44772 3.5 7 3.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M14 3.5V8.5H19" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <Link to="/upload" className="primary-button w-fit text-lg font-semibold px-6">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>
}
