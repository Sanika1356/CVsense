import { Link } from "react-router";

const Navbar = () => {
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
            <Link to="/upload" className="primary-button w-fit text-sm px-5">
                <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar
