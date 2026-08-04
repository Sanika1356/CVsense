import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'CVsense | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="dashboard-bg min-h-screen flex items-center justify-center px-4">
            <div className="gradient-border shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                <section className="flex flex-col gap-8 bg-surface-800/90 backdrop-blur-md rounded-2xl p-10 max-w-md w-full">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="flex size-14 items-center justify-center rounded-2xl primary-gradient shadow-lg shadow-violet-500/25 float-slow">
                            <svg viewBox="0 0 24 24" fill="none" className="size-7 text-white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12.5L11 14.5L15.5 9.5M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <h1 className="text-4xl!">Welcome</h1>
                        <h2 className="text-lg!">Log In to Continue Your Job Journey</h2>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse text-xl!">
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button text-xl!" onClick={auth.signOut}>
                                        <p>Log Out</p>
                                    </button>
                                ) : (
                                    <button className="auth-button text-xl!" onClick={auth.signIn}>
                                        <p>Log In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth
