import type { Route } from "./+types/home";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
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
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const records = await kv.list("resume:*", true) as KVItem[] | undefined;
        const parsedResumes = records?.flatMap((record) => {
          try { return [JSON.parse(record.value) as Resume]; } catch { return []; }
        });
        setResumes(parsedResumes || []);
      } finally {
        setLoadingResumes(false);
      }
    };

    if (auth.isAuthenticated) loadResumes();
  }, [auth.isAuthenticated, kv]);

  const handleResumeDeleted = (deletedId: string) => {
    setResumes((previous) => previous.filter((resume) => resume.id !== deletedId));
  };

  const filteredResumes = useMemo(() => {
    if (!query.trim()) return resumes;
    const normalizedQuery = query.toLowerCase();
    return resumes.filter((resume) => [resume.companyName, resume.jobTitle].some((value) => value?.toLowerCase().includes(normalizedQuery)));
  }, [resumes, query]);

  const completedCount = resumes.filter((resume) => resume.feedback).length;

  return (
    <main className="dashboard-bg">
      <Navbar />
      <section className="main-section">
        <div className="editorial-hero">
          <div className="editorial-hero-copy">
            <span className="section-eyebrow flex items-center gap-2"><span className="size-2 rounded-full bg-accent-blue pulse-glow" /> Resume intelligence, made useful</span>
            <h1 className="editorial-title"><span>Make your CV</span><span className="display-serif">work harder.</span></h1>
            <p className="editorial-copy">Understand where your strengths can take you. CVsense combines thoughtful resume analysis with practical, role-aware next steps so you can move forward with confidence.</p>
            <div className="editorial-actions">
              <Link to="/upload" className="primary-button w-fit px-6">Start your analysis <span aria-hidden="true">↗</span></Link>
              {resumes.length > 0 && <a href="#history" className="editorial-link">Review your history <span aria-hidden="true">↓</span></a>}
            </div>
          </div>
          <div className="editorial-visual editorial-image-frame">
            <img src="/images/career-editorial.jpg" alt="A light-blue folder, resume pages, pen, and glass sphere arranged on an editorial desk." />
            <div className="hero-image-overlay" aria-hidden="true" />
            <p className="hero-caption">01 / Begin with intention</p>
          </div>
        </div>

        <div id="history" className="history-header">
          <div>
            <span className="section-eyebrow">Your workspace</span>
            <h2 className="text-4xl! text-stone-950! font-semibold!">Resume history</h2>
            <p className="mt-2 text-sm text-stone-600">{loadingResumes ? "Loading your saved analyses…" : resumes.length ? `${completedCount} completed ${completedCount === 1 ? "review" : "reviews"} ready to revisit.` : "Your saved analyses will appear here."}</p>
          </div>
          {resumes.length > 0 && <Link to="/upload" className="secondary-button w-fit">Upload another resume <span aria-hidden="true">↗</span></Link>}
        </div>

        {!loadingResumes && resumes.length > 0 && (
          <div className="w-full max-w-2xl relative">
            <label htmlFor="history-search" className="sr-only">Search resume history</label>
            <svg viewBox="0 0 24 24" fill="none" className="size-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <input id="history-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by company, role, or filename…" className="pl-11" />
          </div>
        )}

        {loadingResumes && <div className="flex flex-col items-center justify-center gap-4 py-8"><div className="loader-orb" aria-hidden="true" /><p className="text-sm text-stone-500 font-mono animate-pulse">Loading your resume history…</p></div>}

        {!loadingResumes && filteredResumes.length > 0 && <div className="resumes-section">{filteredResumes.map((resume) => <ResumeCard key={resume.id} resume={resume} onDelete={() => handleResumeDeleted(resume.id)} />)}</div>}

        {!loadingResumes && resumes.length > 0 && filteredResumes.length === 0 && <div className="empty-editorial"><p>No resumes match “{query}”.</p><button type="button" className="editorial-link" onClick={() => setQuery("")}>Clear search</button></div>}

        {!loadingResumes && resumes.length === 0 && <div className="empty-editorial"><div className="empty-mark" aria-hidden="true">+</div><p>No saved analyses yet.</p><Link to="/upload" className="editorial-link">Upload your first resume <span aria-hidden="true">↗</span></Link></div>}
      </section>
    </main>
  );
}
