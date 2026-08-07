import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/Components/Summary";
import ATS from "~/Components/ATS";
import Details from "~/Components/Details";
import SkillMatch from "~/Components/SkillMatch";
import Insights from "~/Components/Insights";
import { exportElementToPdf } from "~/lib/pdfExport";


export const meta = () => ([
    { title: 'CVsense | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [companyName, setCompanyName] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setCompanyName(data.companyName || '');
            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

    const [exportSuccess, setExportSuccess] = useState(false);

    const handleExportPdf = async () => {
        if (!reportRef.current || isExporting) return;
        setIsExporting(true);
        setExportSuccess(false);
        try {
            const fileSafeName = (companyName || 'resume').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
            await exportElementToPdf(reportRef.current, `cvsense-report-${fileSafeName || id}.pdf`);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 4000);
        } catch (err) {
            console.error('Failed to export PDF:', err);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <main className="pt-0! dashboard-bg min-h-screen">
            <nav className="resume-nav no-print">
                <Link to="/" className="back-button">
                    <svg viewBox="0 0 24 24" fill="none" className="size-3.5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-semibold">Back to Homepage</span>
                </Link>

                {feedback && (
                    <div className="flex items-center gap-3">
                        {exportSuccess && (
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full animate-in fade-in">
                                ✓ PDF Downloaded Successfully!
                            </span>
                        )}
                        <button
                            onClick={handleExportPdf}
                            disabled={isExporting}
                            className="primary-button text-sm px-5 py-2.5 disabled:opacity-60 disabled:cursor-wait"
                        >
                            {isExporting ? (
                                <>
                                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
                                        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                    Generating PDF…
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 4V15M12 15L8.5 11.5M12 15L15.5 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5 17V18.5C5 19.3284 5.67157 20 6.5 20H17.5C18.3284 20 19 19.3284 19 18.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                    Export Results (PDF)
                                </>
                            )}
                        </button>
                    </div>
                )}
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section h-screen sticky top-0 items-center justify-center no-print max-lg:h-fit max-lg:static">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl text-slate-100! font-bold">Resume Review</h2>
                    {feedback ? (
                        <div ref={reportRef} className="flex flex-col gap-6 animate-in fade-in duration-1000 bg-bg-950 p-1 rounded-2xl">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            {feedback.skillMatch && (
                                <SkillMatch
                                    matchPercentage={feedback.skillMatch.matchPercentage}
                                    matchedSkills={feedback.skillMatch.matchedSkills}
                                    missingSkills={feedback.skillMatch.missingSkills}
                                />
                            )}
                            {(feedback.strengths || feedback.weaknesses || feedback.suggestions) && (
                                <Insights
                                    strengths={feedback.strengths || []}
                                    weaknesses={feedback.weaknesses || []}
                                    suggestions={feedback.suggestions || []}
                                />
                            )}
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full rounded-2xl" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
