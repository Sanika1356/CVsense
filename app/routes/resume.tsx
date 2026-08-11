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
    const [loadError, setLoadError] = useState<string | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            try {
                const resume = await kv.get(`resume:${id}`);

                if (!resume) {
                    setLoadError('Resume not found. It may have been deleted or the link is invalid.');
                    return;
                }

                let data: any;
                try {
                    data = JSON.parse(resume);
                } catch {
                    setLoadError('Resume data is corrupted. Please try uploading again.');
                    return;
                }

                // Load PDF blob
                try {
                    const resumeBlob = await fs.read(data.resumePath);
                    if (resumeBlob) {
                        const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                        setResumeUrl(URL.createObjectURL(pdfBlob));
                    }
                } catch (e) {
                    console.warn('Could not load resume PDF:', e);
                }

                // Load image blob
                try {
                    const imageBlob = await fs.read(data.imagePath);
                    if (imageBlob) {
                        setImageUrl(URL.createObjectURL(imageBlob));
                    }
                } catch (e) {
                    console.warn('Could not load resume image:', e);
                }

                setCompanyName(data.companyName || '');

                // Validate feedback before setting it
                if (data.feedback && typeof data.feedback === 'object' && typeof data.feedback.overallScore === 'number') {
                    setFeedback(data.feedback);
                } else if (data.feedback) {
                    console.warn('Feedback data has unexpected format:', data.feedback);
                    setLoadError('The analysis result is in an unexpected format. Please try analyzing again.');
                }

                console.log({ resumeUrl, imageUrl, feedback: data.feedback });
            } catch (err) {
                console.error('Failed to load resume data:', err);
                setLoadError(err instanceof Error ? err.message : 'Failed to load resume data.');
            }
        }

        if (!isLoading) loadResume();
    }, [id, isLoading]);

    const handleExportPdf = async () => {
        if (!reportRef.current || isExporting) return;
        setIsExporting(true);
        try {
            const fileSafeName = (companyName || 'resume').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
            await exportElementToPdf(reportRef.current, `cvsense-report-${fileSafeName || id}.pdf`);
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
                    <button
                        onClick={handleExportPdf}
                        disabled={isExporting}
                        className="secondary-button text-sm disabled:opacity-60 disabled:cursor-wait"
                    >
                        {isExporting ? (
                            <>
                                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
                                    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                                Generating…
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 4V15M12 15L8.5 11.5M12 15L15.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 17V18.5C5 19.3284 5.67157 20 6.5 20H17.5C18.3284 20 19 19.3284 19 18.5V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                                Download PDF Report
                            </>
                        )}
                    </button>
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
                    {loadError ? (
                        <div className="panel p-8 flex flex-col gap-4 items-start animate-in fade-in duration-500">
                            <div className="flex flex-row gap-3 items-center">
                                <svg viewBox="0 0 24 24" fill="none" className="size-8 text-rose-400 shrink-0" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
                                    <path d="M12 8V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="0.9" fill="currentColor" />
                                </svg>
                                <div>
                                    <p className="text-rose-400 font-semibold text-lg">Failed to load analysis</p>
                                    <p className="text-slate-400 text-sm mt-1">{loadError}</p>
                                </div>
                            </div>
                            <Link to="/upload" className="primary-button mt-2">Try Again</Link>
                        </div>
                    ) : feedback ? (
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
