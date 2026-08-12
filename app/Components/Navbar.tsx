import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Navbar = () => {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleLogout = async () => {
        if (isSigningOut) return;
        setIsSigningOut(true);
        try {
            await auth.signOut();
        } catch {
            // sign-out failed; fall through to redirect anyway so the UI resets
        } finally {
            setIsSigningOut(false);
            navigate("/auth?next=/");
        }
    };

    const renderActions = () => {
        // Only signed-in users see the full action row (navbar renders on all pages,
        // including the auth page, so guard on auth state).
        if (!auth.isAuthenticated) return null;

        return (
            <div className="flex flex-row items-center gap-3">
                <Link to="/upload" className="primary-button w-fit text-sm px-5">
                    <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Upload Resume
                </Link>
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="secondary-button text-sm px-5 disabled:opacity-50 disabled:cursor-wait"
                    aria-label="Log out"
                >
                    <LogoutIcon />
                    {isSigningOut ? "Logging out..." : "Logout"}
                </button>
            </div>
        );
    };

    return (
        <nav className="navbar animate-in fade-in slide-in-from-top-4 duration-700">
            <Link to="/" className="flex items-center gap-2.5 group">
                <span className="relative flex size-8 items-center justify-center rounded-xl primary-gradient shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-105">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-4.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9 12.5L11 14.5L15.5 9.5M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <p className="text-2xl font-bold text-gradient">CVsense</p>
            </Link>
            {isLoading ? (
                <button className="secondary-button text-sm px-5 animate-pulse" aria-label="Checking sign-in status" disabled>
                    <LogoutIcon />
                    ...
                </button>
            ) : (
                renderActions()
            )}
        </nav>
    );
};

export default Navbar;
