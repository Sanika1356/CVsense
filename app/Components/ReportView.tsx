import React from 'react';

interface ReportViewProps {
  feedback: Feedback;
  companyName?: string;
  jobTitle?: string;
}

const CircularScoreGauge: React.FC<{
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  startColor: string;
  endColor: string;
}> = ({ score, label, size = 110, strokeWidth = 9, gradientId, startColor, endColor }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const statusText = score > 70 ? 'Strong' : score > 49 ? 'Good Start' : 'Needs Work';
  const badgeStyle =
    score > 70
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-200'
      : score > 49
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 print:bg-amber-50 print:text-amber-700 print:border-amber-200'
      : 'bg-rose-500/10 text-rose-400 border-rose-500/20 print:bg-rose-50 print:text-rose-700 print:border-rose-200';

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-surface-700/40 border border-border-softer rounded-2xl print:bg-slate-50 print:border-slate-200">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-surface-600/60 print:text-slate-200"
            fill="transparent"
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-mono text-slate-100 print:text-slate-900 leading-none">
            {score}
          </span>
          <span className="text-[10px] font-mono text-slate-500 print:text-slate-500 mt-0.5">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 print:text-slate-700">{label}</p>
        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeStyle}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
};

const CategoryScoreBar: React.FC<{ title: string; score: number }> = ({ title, score }) => {
  const statusText = score > 70 ? 'Strong' : score > 49 ? 'Good Start' : 'Needs Work';
  const barColor =
    score > 70
      ? 'from-emerald-500 to-teal-400'
      : score > 49
      ? 'from-amber-500 to-orange-400'
      : 'from-rose-500 to-pink-500';

  const badgeColor =
    score > 70
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-200'
      : score > 49
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 print:bg-amber-50 print:text-amber-700 print:border-amber-200'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/20 print:bg-rose-50 print:text-rose-700 print:border-rose-200';

  return (
    <div className="flex flex-col gap-2 p-3.5 bg-surface-700/30 border border-border-softer rounded-xl print:bg-white print:border-slate-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200 print:text-slate-800">{title}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badgeColor}`}>
            {statusText}
          </span>
          <span className="font-mono text-sm font-bold text-slate-100 print:text-slate-900">
            {score}<span className="text-xs text-slate-500 font-normal">/100</span>
          </span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-surface-600/50 print:bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full bg-linear-to-r ${barColor} print:bg-blue-600`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
};

const ReportView: React.FC<ReportViewProps> = ({ feedback, companyName, jobTitle }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const suggestionsList =
    feedback.suggestions && feedback.suggestions.length > 0
      ? feedback.suggestions
      : [
          ...feedback.toneAndStyle.tips.filter((t) => t.type === 'improve').map((t) => t.tip),
          ...feedback.content.tips.filter((t) => t.type === 'improve').map((t) => t.tip),
          ...feedback.structure.tips.filter((t) => t.type === 'improve').map((t) => t.tip),
        ].slice(0, 5);

  return (
    <div className="cvsense-report flex flex-col gap-6 text-slate-200 print:text-slate-900 w-full max-w-4xl mx-auto">
      {/* ================= FIRST PAGE HEADER ================= */}
      <header className="report-header panel bg-linear-to-r from-surface-800 via-surface-700 to-surface-800 print:bg-slate-900 print:text-white border border-border-soft p-6 rounded-2xl shadow-xl print:shadow-none">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-softer print:border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-tr from-violet-600 to-cyan-400 text-white font-bold text-xl shadow-lg print:shadow-none">
              CV
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 print:text-white tracking-tight flex items-center gap-2">
                CVSense
              </h1>
              <p className="text-xs text-cyan-400 print:text-cyan-300 font-mono tracking-wider uppercase font-semibold">
                AI Resume Intelligence Platform
              </p>
            </div>
          </div>
          <div className="text-right max-sm:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 border border-violet-500/30 text-violet-300 print:bg-cyan-900/60 print:text-cyan-200 print:border-cyan-700">
              Resume Analysis Report
            </span>
            <p className="text-xs text-slate-400 print:text-slate-300 mt-1 font-mono">{currentDate}</p>
          </div>
        </div>

        {(companyName || jobTitle) && (
          <div className="mt-4 pt-2 flex flex-wrap gap-4 text-xs text-slate-300 print:text-slate-200">
            {jobTitle && (
              <div>
                <span className="text-slate-500 print:text-slate-400">Target Role: </span>
                <span className="font-semibold text-slate-100 print:text-white">{jobTitle}</span>
              </div>
            )}
            {companyName && (
              <div>
                <span className="text-slate-500 print:text-slate-400">Target Company: </span>
                <span className="font-semibold text-slate-100 print:text-white">{companyName}</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ================= EXECUTIVE SUMMARY & SCORE GAUGES ================= */}
      <section className="panel p-6 bg-surface-800/80 border border-border-soft rounded-2xl print:bg-white print:border-slate-200 print:shadow-none pdf-break-inside-avoid">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-softer print:border-slate-200">
          <div>
            <span className="section-eyebrow print:text-blue-700">Executive Overview</span>
            <h2 className="text-xl font-bold text-slate-100 print:text-slate-900">Analysis Summary</h2>
          </div>
          <span className="text-xs font-mono text-slate-400 print:text-slate-500">Report ID: #849201</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <CircularScoreGauge
            score={feedback.overallScore}
            label="Overall Resume Score"
            gradientId="overallScoreGrad"
            startColor="#8b5cf6"
            endColor="#2563eb"
          />
          <CircularScoreGauge
            score={feedback.ATS.score || 0}
            label="ATS Compatibility Score"
            gradientId="atsScoreGrad"
            startColor="#2563eb"
            endColor="#06b6d4"
          />
        </div>

        {/* Score Breakdown */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-1">
            Score Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CategoryScoreBar title="Tone & Style" score={feedback.toneAndStyle.score} />
            <CategoryScoreBar title="Content" score={feedback.content.score} />
            <CategoryScoreBar title="Structure" score={feedback.structure.score} />
            <CategoryScoreBar title="Skills" score={feedback.skills.score} />
          </div>
        </div>
      </section>

      {/* ================= ATS COMPATIBILITY SECTION ================= */}
      <section className="panel p-6 bg-surface-800/80 border border-border-soft rounded-2xl print:bg-white print:border-slate-200 pdf-break-inside-avoid">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-softer print:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 print:bg-cyan-50 print:text-cyan-700 print:border-cyan-200">
              <svg viewBox="0 0 24 24" fill="none" className="size-5" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 12.5L11 14.5L15.5 9.5M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span className="section-eyebrow print:text-blue-700">ATS Evaluation</span>
              <h2 className="text-xl font-bold text-slate-100 print:text-slate-900">ATS Compatibility Analysis</h2>
            </div>
          </div>
          <span className="font-mono text-lg font-bold text-cyan-400 print:text-blue-700">
            {feedback.ATS.score}<span className="text-xs text-slate-500 font-normal">/100</span>
          </span>
        </div>

        <p className="text-sm text-slate-400 print:text-slate-600 mb-4 leading-relaxed">
          Applicant Tracking System (ATS) screening evaluates file formatting, structural clarity, keyword density, and parseability.
        </p>

        {feedback.ATS.tips && feedback.ATS.tips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {feedback.ATS.tips.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-sm ${
                  item.type === 'good'
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300 print:bg-emerald-50 print:border-emerald-200 print:text-emerald-900'
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-300 print:bg-amber-50 print:border-amber-200 print:text-amber-900'
                }`}
              >
                {item.type === 'good' ? (
                  <svg viewBox="0 0 24 24" fill="none" className="size-4 text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="size-4 text-amber-400 print:text-amber-600 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V13M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span>{item.tip}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= SKILL MATCH SECTION ================= */}
      {feedback.skillMatch && (
        <section className="panel p-6 bg-surface-800/80 border border-border-soft rounded-2xl print:bg-white print:border-slate-200 pdf-break-inside-avoid">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-softer print:border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/25 text-violet-400 print:bg-violet-50 print:text-violet-700 print:border-violet-200">
                <svg viewBox="0 0 24 24" fill="none" className="size-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="section-eyebrow print:text-blue-700">Keyword Alignment</span>
                <h2 className="text-xl font-bold text-slate-100 print:text-slate-900">Skill Match & Gaps</h2>
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-violet-400 print:text-violet-700">
              {feedback.skillMatch.matchPercentage}% <span className="text-xs text-slate-500 font-normal">Match Rate</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="p-4 bg-surface-700/30 border border-emerald-500/20 rounded-xl print:bg-slate-50 print:border-emerald-200">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700 mb-3 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Matched Skills ({feedback.skillMatch.matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {feedback.skillMatch.matchedSkills.length > 0 ? (
                  feedback.skillMatch.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 print:bg-emerald-100 print:text-emerald-800 print:border-emerald-300"
                    >
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No matched skills detected.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-4 bg-surface-700/30 border border-rose-500/20 rounded-xl print:bg-slate-50 print:border-rose-200">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-400 print:text-rose-700 mb-3 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V13M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Missing Skills ({feedback.skillMatch.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {feedback.skillMatch.missingSkills.length > 0 ? (
                  feedback.skillMatch.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 print:bg-rose-100 print:text-rose-800 print:border-rose-300"
                    >
                      + {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No critical skills missing!</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= STRENGTHS & AREAS FOR IMPROVEMENT ================= */}
      {(feedback.strengths || feedback.weaknesses) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pdf-break-inside-avoid">
          {/* Strengths */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="panel p-6 bg-surface-800/80 border border-border-soft rounded-2xl print:bg-white print:border-slate-200">
              <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-border-softer print:border-slate-200">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 print:bg-emerald-100 print:text-emerald-700">
                  <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-emerald-300 print:text-emerald-800">Key Strengths</h2>
              </div>
              <ul className="space-y-2.5">
                {feedback.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-300 print:text-slate-800 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 print:bg-emerald-50/50 print:border-emerald-100"
                  >
                    <span className="text-emerald-400 font-bold shrink-0">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {feedback.weaknesses && feedback.weaknesses.length > 0 && (
            <div className="panel p-6 bg-surface-800/80 border border-border-soft rounded-2xl print:bg-white print:border-slate-200">
              <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-border-softer print:border-slate-200">
                <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 print:bg-rose-100 print:text-rose-700">
                  <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V13M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-rose-300 print:text-rose-800">Areas for Improvement</h2>
              </div>
              <ul className="space-y-2.5">
                {feedback.weaknesses.map((weakness, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-300 print:text-slate-800 p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/15 print:bg-rose-50/50 print:border-rose-100"
                  >
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ================= ACTIONABLE SUGGESTIONS ================= */}
      {suggestionsList.length > 0 && (
        <section className="panel p-6 bg-surface-800/80 border border-border-soft rounded-2xl print:bg-white print:border-slate-200 pdf-break-inside-avoid">
          <div className="flex items-center gap-3 pb-3 mb-4 border-b border-border-softer print:border-slate-200">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 print:bg-amber-50 print:text-amber-700 print:border-amber-200">
              <svg viewBox="0 0 24 24" fill="none" className="size-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="section-eyebrow print:text-blue-700">Action Plan</span>
              <h2 className="text-xl font-bold text-slate-100 print:text-slate-900">Recommended Action Items</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {suggestionsList.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-700/30 border border-border-softer print:bg-amber-50/30 print:border-amber-200 text-sm"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs shrink-0 print:bg-amber-200 print:text-amber-900">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-slate-200 print:text-slate-800 leading-relaxed pt-0.5">{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= DETAILED CATEGORY FEEDBACK ================= */}
      <section className="panel p-6 bg-surface-800/80 border border-border-soft rounded-2xl print:bg-white print:border-slate-200 pdf-break-inside-avoid">
        <div className="pb-3 mb-4 border-b border-border-softer print:border-slate-200">
          <span className="section-eyebrow print:text-blue-700">Deep-Dive Analysis</span>
          <h2 className="text-xl font-bold text-slate-100 print:text-slate-900">Category Detailed Breakdown</h2>
        </div>

        <div className="space-y-5">
          {[
            { name: 'Tone & Style', category: feedback.toneAndStyle },
            { name: 'Content', category: feedback.content },
            { name: 'Structure', category: feedback.structure },
            { name: 'Skills', category: feedback.skills },
          ].map(({ name, category }) => (
            <div key={name} className="p-4 rounded-xl bg-surface-700/20 border border-border-softer print:bg-slate-50 print:border-slate-200 pdf-break-inside-avoid">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-100 print:text-slate-900">{name}</h3>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-surface-600/60 border border-border-soft text-slate-200 print:bg-slate-200 print:text-slate-800">
                  {category.score}/100
                </span>
              </div>
              <div className="space-y-2.5">
                {category.tips.map((tipItem, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs ${
                      tipItem.type === 'good'
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300 print:bg-emerald-50 print:border-emerald-200 print:text-emerald-900'
                        : 'bg-amber-500/5 border-amber-500/20 text-amber-300 print:bg-amber-50 print:border-amber-200 print:text-amber-900'
                    }`}
                  >
                    <p className="font-semibold text-sm mb-1">{tipItem.tip}</p>
                    <p className="opacity-90 leading-relaxed">{tipItem.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SUBTLE REPORT FOOTER ================= */}
      <footer className="report-footer text-center py-4 border-t border-border-softer print:border-slate-300 text-xs text-slate-400 print:text-slate-600 font-mono flex items-center justify-between max-sm:flex-col gap-2">
        <span>CVSense | Resume Analysis Report</span>
        <span>Generated on {currentDate}</span>
      </footer>
    </div>
  );
};

export default ReportView;
