import {Link} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import ScoreCircle from "../../CVsense-main/app/Components/ScoreCircle";

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

    return (
        <Link to={`/resume/${id}`} className="resume-card group animate-in fade-in duration-700">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2 min-w-0">
                    {companyName && <h2 className="text-slate-100! font-bold wrap-break-word">{companyName}</h2>}
                    {jobTitle && <h3 className="text-base wrap-break-word text-slate-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="text-slate-100! font-bold">Resume</h2>}
                </div>
                <div className="shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-700 relative overflow-hidden rounded-2xl">
                    <div className="w-full h-full relative">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-87.5 max-sm:h-50 object-cover object-top rounded-[14px] transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-bg-950/70 via-transparent to-transparent rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                                <svg viewBox="0 0 24 24" fill="none" className="size-3.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 12S6.5 5 12 5S21 12 21 12S17.5 19 12 19S3 12 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                View full analysis
                            </span>
                        </div>
                    </div>
                </div>
                )}
        </Link>
    )
}
export default ResumeCard
