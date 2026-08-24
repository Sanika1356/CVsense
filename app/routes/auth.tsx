import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: "CVsense | Auth" },
    { name: "description", content: "Log into your account" },
]);

const LogoMark = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M9 12.5L11 14.5L15.5 9.5M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const features = [
    { index: "01", title: "See your signal", desc: "Understand the strengths and gaps shaping your next opportunity." },
    { index: "02", title: "Find your direction", desc: "Turn a resume score into practical, role-aware next steps." },
    { index: "03", title: "Move with confidence", desc: "Keep your work private while you build a stronger application." },
];

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = new URLSearchParams(location.search).get("next") || "/";
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next, navigate]);

    const renderAction = () => {
        if (isLoading) return <button className="auth-button animate-pulse" aria-label="Signing you in" disabled>Checking your session…</button>;
        if (auth.isAuthenticated) return <button className="auth-button" onClick={auth.signOut}>Sign out</button>;
        return <button className="auth-button" onClick={auth.signIn}>Continue with Puter <span aria-hidden="true">↗</span></button>;
    };

    return (
        <main className="auth-shell dashboard-bg">
            <div className="auth-editorial-grid">
                <div className="auth-copy">
                    <Link to="/" className="auth-brand"><span className="brand-mark"><span aria-hidden="true">✓</span></span><span className="brand-wordmark">CVsense</span></Link>
                    <span className="section-eyebrow">A clearer direction starts here</span>
                    <h1 className="editorial-title"><span>Meet the</span><span>stronger</span><span className="display-serif">you.</span></h1>
                    <p className="editorial-copy">A thoughtful workspace for understanding your resume, finding your signal, and moving toward the work you want next.</p>
                    <p className="auth-side-note"><span className="auth-side-line" /> Your resume stays in your own Puter storage.</p>
                </div>
                <section className="auth-panel auth-card">
                    <div className="auth-panel-inner">
                        <div className="flex items-start justify-between gap-4"><div><p className="section-eyebrow">Your workspace</p><h2 className="auth-heading">Start with curiosity.</h2></div><span className="auth-icon"><LogoMark className="size-6" /></span></div>
                        <ul className="auth-features">{features.map((feature) => <li key={feature.index}><span className="auth-feature-index">{feature.index}</span><span><strong>{feature.title}</strong><small>{feature.desc}</small></span></li>)}</ul>
                        <div className="pt-2">{renderAction()}</div>
                        <p className="auth-footer">Sign in securely with your Puter account. CVsense does not need a separate password.</p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;
