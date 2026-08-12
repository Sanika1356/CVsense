import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: "CVsense | Auth" },
    { name: "description", content: "Log into your account" },
]);

const LogoMark = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9 12.5L11 14.5L15.5 9.5M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const features = [
    {
        icon: (
            <path
                d="M9 12L11 14L15 9M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        title: "ATS Compatibility Check",
        desc: "See how well your resume passes applicant tracking systems.",
    },
    {
        icon: (
            <path
                d="M12 2L14.5 7.5L20.5 8.3L16 12.5L17.2 18.5L12 15.6L6.8 18.5L8 12.5L3.5 8.3L9.5 7.5L12 2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        title: "AI-Powered Scoring",
        desc: "Get an objective rating of your resume against the job description.",
    },
    {
        icon: (
            <path
                d="M12 20V14M12 10V4M4 14L7.5 17.5L12 13M20 10L16.5 6.5L12 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        title: "Actionable Feedback",
        desc: "Receive concrete tips to strengthen every section of your CV.",
    },
];

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split("next=")[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);

    const renderAction = () => {
        if (isLoading) {
            return (
                <button className="auth-button animate-pulse" aria-label="Signing you in" disabled>
                    Signing you in...
                </button>
            );
        }
        if (auth.isAuthenticated) {
            return (
                <button className="auth-button" onClick={auth.signOut}>
                    Log Out
                </button>
            );
        }
        return (
            <button className="auth-button" onClick={auth.signIn}>
                Log In with Puter
            </button>
        );
    };

    return (
        <main className="dashboard-bg min-h-screen flex items-center justify-center px-4 py-10">
            <div className="auth-card w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                <section className="flex flex-col items-center gap-6 rounded-2xl bg-surface-800/90 backdrop-blur-md px-8 py-10 w-full">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="flex size-14 items-center justify-center rounded-2xl primary-gradient shadow-lg shadow-violet-500/25 float-slow">
                            <LogoMark className="size-7 text-white" />
                        </span>
                        <h1 className="text-gradient text-3xl font-bold leading-tight">
                            Welcome to CVsense
                        </h1>
                        <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                            Log in to analyze your resume, track your applications,
                            and get AI-powered feedback.
                        </p>
                    </div>

                    {/* Feature highlights */}
                    <ul className="w-full flex flex-col gap-3">
                        {features.map((feature) => (
                            <li
                                key={feature.title}
                                className="flex items-start gap-3 rounded-xl border border-border-soft bg-surface-700/50 px-4 py-3 transition-colors duration-300 hover:border-white/15"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        {feature.icon}
                                    </svg>
                                </span>
                                <span className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-100">
                                        {feature.title}
                                    </span>
                                    <span className="text-sm text-slate-400 leading-snug">
                                        {feature.desc}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Action */}
                    <div className="w-full pt-1">{renderAction()}</div>

                    {/* Footer */}
                    <p className="text-xs text-slate-500 text-center">
                        Sign in with your Puter account — your resume data is
                        stored securely in your own cloud storage.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default Auth;
