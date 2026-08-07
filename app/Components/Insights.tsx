interface InsightsProps {
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
}

const Insights = ({
  strengths = [],
  weaknesses = [],
  suggestions = [],
}: InsightsProps) => {
  if (!strengths.length && !weaknesses.length && !suggestions.length) {
    return null;
  }

  return (
    <div className="panel flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-slate-100">Key Insights & Takeaways</h3>
        <p className="text-xs font-mono text-slate-400">High-level qualitative feedback on your resume</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
                <path d="M8.5 12.5L10.75 14.75L15.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Key Strengths
            </div>
            <ul className="flex flex-col gap-2 text-sm text-slate-300">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
                <path d="M12 8V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
              Areas to Improve
            </div>
            <ul className="flex flex-col gap-2 text-sm text-slate-300">
              {weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-accent-violet/5 border border-accent-violet/20">
            <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm">
              <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              Actionable Recommendations
            </div>
            <ul className="flex flex-col gap-2 text-sm text-slate-300">
              {suggestions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
