import {Link} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    const atsScore = feedback?.ATS?.score || 0;

    return (
        <Link to={`/resume/${id}`} className="resume-card group animate-in fade-in duration-700 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] border-white/10 hover:border-accent-violet/40 transition-all duration-300">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-2">
                        {companyName && <h2 className="text-slate-100! font-bold text-xl truncate">{companyName}</h2>}
                        {!companyName && <h2 className="text-slate-100! font-bold text-xl">Resume Analysis</h2>}
                    </div>
                    {jobTitle && <h3 className="text-sm truncate text-slate-400 font-medium">{jobTitle}</h3>}
                    <div className="flex items-center gap-2 mt-1">
                        <span className="stat-pill text-[11px] py-0.5 px-2 bg-surface-700/80 border border-white/10 text-accent-cyan">
                            ATS: {atsScore}/100
                        </span>
                        {feedback.overallScore >= 70 && (
                            <span className="stat-pill text-[11px] py-0.5 px-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                High Match
                            </span>
                        )}
                    </div>
                </div>
                <div className="shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-700 relative overflow-hidden rounded-2xl flex-1">
                    <div className="w-full h-full relative">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-72 max-sm:h-48 object-cover object-top rounded-[14px] transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-bg-950 via-bg-950/40 to-transparent rounded-[14px] opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end justify-between p-4">
                            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2 group-hover:text-accent-cyan transition-colors">
                                <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 12S6.5 5 12 5S21 12 21 12S17.5 19 12 19S3 12 3 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                                </svg>
                                View Detailed Analysis
                            </span>
                            <span className="size-7 rounded-full bg-accent-violet/20 border border-accent-violet/40 flex items-center justify-center text-accent-violet group-hover:translate-x-1 group-hover:bg-accent-violet group-hover:text-white transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard
