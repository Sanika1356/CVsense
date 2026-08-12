import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-4.5 shrink-0 mt-0.5 text-accent-blue" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
    <path d="M8.5 12.5L10.75 14.75L15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-4.5 shrink-0 mt-0.5 text-accent-violet" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 8V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="16" r="0.9" fill="currentColor" />
  </svg>
);

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const tone = score > 69 ? 'good' : score > 49 ? 'warn' : 'bad';

  const toneStyles = {
    good: { ring: 'from-accent-blue/25', badge: 'bg-accent-blue/10 border-accent-blue/25 text-blue-300', icon: 'text-accent-blue' },
    warn: { ring: 'from-accent-violet/25', badge: 'bg-accent-violet/10 border-accent-violet/25 text-violet-300', icon: 'text-accent-violet' },
    bad: { ring: 'from-slate-400/25', badge: 'bg-slate-500/10 border-slate-400/25 text-slate-300', icon: 'text-slate-400' },
  }[tone];

  const subtitle = score > 69 ? 'Great job!' : score > 49 ? 'Good start' : 'Needs improvement';

  return (
    <div className={`panel panel-hover scan-beam bg-linear-to-b ${toneStyles.ring} to-surface-800/0 w-full p-6`}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className={`flex size-12 items-center justify-center rounded-2xl border ${toneStyles.badge}`}>
            <svg viewBox="0 0 24 24" fill="none" className="size-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12.5L11 14.5L15.5 9.5M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="section-eyebrow">ATS Compatibility</p>
            <h2 className="text-2xl font-bold text-slate-100 font-mono">{score}<span className="text-slate-500 text-lg">/100</span></h2>
          </div>
        </div>
        <span className={`stat-pill ${toneStyles.badge} border`}>{subtitle}</span>
      </div>

      <p className="text-slate-400 mb-5 text-sm leading-relaxed">
        This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
      </p>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3">
            {suggestion.type === "good" ? <CheckIcon /> : <WarnIcon />}
            <p className={suggestion.type === "good" ? "text-blue-300/90 text-sm" : "text-violet-300/90 text-sm"}>
              {suggestion.tip}
            </p>
          </div>
        ))}
      </div>

      <p className="text-slate-500 italic text-sm mt-6 border-t border-border-softer pt-4">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  )
}

export default ATS
