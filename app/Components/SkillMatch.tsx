interface SkillMatchProps {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
}

const SkillMatch = ({ matchPercentage, matchedSkills, missingSkills }: SkillMatchProps) => {
    const tone =
        matchPercentage > 69 ? "violet" : matchPercentage > 49 ? "blue" : "slate";

    const barColor =
        tone === "violet" ? "from-accent-blue to-accent-violet" : tone === "blue" ? "from-accent-blue to-blue-400" : "from-slate-500 to-slate-400";

    return (
        <div className="panel panel-hover w-full p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-accent-violet/10 border border-accent-violet/25 text-accent-violet">
                        <svg viewBox="0 0 24 24" fill="none" className="size-5.5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="section-eyebrow">Skill Match</p>
                        <h2 className="text-2xl font-bold text-slate-100 font-mono">{matchPercentage}<span className="text-slate-500 text-lg">%</span></h2>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden mb-6">
                <div
                    className={`h-full rounded-full bg-linear-to-r ${barColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(100, Math.max(0, matchPercentage))}%` }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300 mb-2.5 flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" fill="none" className="size-3.5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Matched skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills.length > 0 ? matchedSkills.map((skill, i) => (
                            <span key={i} className="skill-chip-matched">{skill}</span>
                        )) : (
                            <span className="text-sm text-slate-500">No strong matches found.</span>
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2.5 flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" fill="none" className="size-3.5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Skills to add
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
                            <span key={i} className="skill-chip-missing">{skill}</span>
                        )) : (
                            <span className="text-sm text-slate-500">Nothing major missing 🎉</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillMatch;
