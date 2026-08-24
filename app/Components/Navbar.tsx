import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { usePuterStore } from "~/lib/puter";

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21086 20.0391 3 19.5304 3 19V5C3 4.46957 3.21086 3.96086 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Navbar = () => {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleLogout = async () => {
        if (isSigningOut) return;
        setIsSigningOut(true);
        try { await auth.signOut(); } catch { /* redirect still resets the UI */ }
        finally { setIsSigningOut(false); navigate("/auth?next=/"); }
    };

    return (
        <nav className="navbar animate-in fade-in slide-in-from-top-4 duration-700">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                <span className="brand-mark"><span aria-hidden="true">✓</span></span>
                <span className="brand-wordmark">CVsense</span>
            </Link>
            {auth.isAuthenticated && <div className="hidden lg:flex items-center gap-7 text-[10px] font-mono uppercase tracking-[0.12em] text-stone-500">
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/upload" className="nav-link">New analysis</Link>
                <a href="/#history" className="nav-link">History</a>
                <Link to="/privacy" className="nav-link">Privacy</Link>
            </div>}
            {isLoading ? <button className="secondary-button text-xs px-4 animate-pulse" aria-label="Checking sign-in status" disabled>Checking session…</button> : auth.isAuthenticated ? (
                <div className="flex flex-row items-center gap-2">
                    <Link to="/upload" className="primary-button w-fit text-xs px-4">Upload resume <span aria-hidden="true">↗</span></Link>
                    <button type="button" onClick={handleLogout} disabled={isSigningOut} className="secondary-button text-xs px-4 disabled:opacity-50 disabled:cursor-wait" aria-label="Log out"><LogoutIcon />{isSigningOut ? "Logging out…" : "Sign out"}</button>
                </div>
            ) : null}
        </nav>
    );
};

export default Navbar;
