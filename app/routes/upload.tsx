import {type SubmitEvent, useState} from 'react'
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {extractJsonFromText, generateUUID, getAIResponseText} from "~/lib/utils";
import { prepareInstructions } from '../Constants';
import Navbar from '~/Components/Navbar';
import FileUploader from '~/Components/FileUploader';

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        try {
            console.log('Starting analysis process...');
            
            setStatusText('Uploading the file...');
            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) throw new Error('Failed to upload file');
            console.log('File uploaded successfully:', uploadedFile.path);

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) {
                throw new Error(imageFile.error || 'Failed to convert PDF to image');
            }
            console.log('PDF converted to image successfully');

            setStatusText('Uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) throw new Error('Failed to upload image');
            console.log('Image uploaded successfully:', uploadedImage.path);

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: '' as Feedback | '',
            };
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            console.log('Data prepared and saved with ID:', uuid);

            setStatusText('Analyzing with AI (this may take 2-3 minutes)...');
            console.log('Sending to AI for analysis...');

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            );
            
            if (!feedback) {
                throw new Error('AI analysis returned no response. The service might be busy. Please try again.');
            }
            console.log('AI feedback received successfully');
            console.log('Raw AI feedback structure:', JSON.stringify(feedback, null, 2).slice(0, 500));

            setStatusText('Processing AI response...');
            
            // Handle different possible response shapes
            let feedbackText: string;
            try {
                if (!feedback.message) {
                    // Some models return the response directly as a string or object
                    const raw = feedback as unknown;
                    if (typeof raw === 'string') {
                        feedbackText = raw;
                    } else if (typeof raw === 'object' && raw !== null && 'content' in (raw as any)) {
                        feedbackText = getAIResponseText((raw as any).content);
                    } else {
                        throw new Error('AI response missing expected message structure');
                    }
                } else {
                    feedbackText = getAIResponseText(feedback.message.content);
                }
            } catch (parseErr) {
                console.error('Failed to extract text from AI response:', parseErr, feedback);
                throw new Error('Could not read the AI response. Please try again.');
            }
            console.log('Extracted feedback text, parsing JSON...');
            
            const parsedFeedback = extractJsonFromText(feedbackText) as Feedback;
            
            if (!parsedFeedback || typeof parsedFeedback.overallScore !== 'number') {
                console.error('Invalid feedback format:', parsedFeedback);
                throw new Error('Invalid AI response format. Please try again.');
            }
            
            data.feedback = parsedFeedback;
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            console.log('Analysis complete! Overall score:', parsedFeedback.overallScore);
            
            setStatusText('Analysis complete! Redirecting...');
            setTimeout(() => {
                navigate(`/resume/${uuid}`);
            }, 500);
        } catch (err) {
            console.error('Analysis error:', err);
            const message = err instanceof Error ? err.message : 'Something went wrong during analysis';
            setStatusText(`Error: ${message}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="dashboard-bg">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <span className="section-eyebrow flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-accent-violet pulse-glow" />
                        New Analysis
                    </span>
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2 className={statusText.startsWith('Error:') ? 'text-rose-400 font-semibold' : ''}>{statusText}</h2>
                            {!statusText.startsWith('Error:') && (
                                <div className="w-full max-w-md flex flex-col items-center gap-4">
                                    <img src="/images/resume-scan.gif" className="w-full rounded-2xl border border-border-soft" alt="Analyzing..." />
                                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full w-1/2 rounded-full primary-gradient animate-pulse" />
                                    </div>
                                </div>
                            )}
                            {statusText.startsWith('Error:') && (
                                <div className="mt-4">
                                    <button 
                                        onClick={() => {
                                            setIsProcessing(false);
                                            setStatusText('');
                                        }} 
                                        className="primary-button"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score, skill match, and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 panel p-8 max-w-xl w-full">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="e.g. Google" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="e.g. Frontend Developer" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Paste the job description for a more tailored skill match" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                <svg viewBox="0 0 24 24" fill="none" className="size-4.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
                                </svg>
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
