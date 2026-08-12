const Insights = ({
  strengths,
  weaknesses,
  suggestions,
}: {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}) => {
  return (
    <div className="panel flex flex-col gap-6 w-full p-6">
      {strengths.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5 text-accent-blue"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
              <path
                d="M8.5 12.5L10.75 14.75L15.5 9.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Strengths
          </h3>
          <ul className="flex flex-col gap-2">
            {strengths.map((strength, index) => (
              <li
                key={index}
                className="text-sm text-slate-300 bg-accent-blue/5 border border-accent-blue/20 rounded-lg p-3"
              >
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {weaknesses.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-violet-300 flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5 text-accent-violet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
              <path
                d="M12 8V13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="0.9" fill="currentColor" />
            </svg>
            Areas for Improvement
          </h3>
          <ul className="flex flex-col gap-2">
            {weaknesses.map((weakness, index) => (
              <li
                key={index}
                className="text-sm text-slate-300 bg-accent-violet/5 border border-accent-violet/20 rounded-lg p-3"
              >
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5 text-accent-blue"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
              <path
                d="M12 8V12.5M12 16H12.01"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Suggestions
          </h3>
          <ul className="flex flex-col gap-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-slate-300 bg-surface-700/40 border border-border-soft rounded-lg p-3"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Insights;
