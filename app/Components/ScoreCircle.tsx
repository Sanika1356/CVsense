const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = score / 100;
    const strokeDashoffset = circumference * (1 - progress);

    const trackColor =
        score > 69 ? "#34d399" : score > 49 ? "#fbbf24" : "#fb7185";

    return (
        <div className="relative w-25 h-25">
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                {/* Partial circle with gradient */}
                <defs>
                    <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="url(#grad)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-[stroke-dashoffset] duration-1000 ease-out"
                />
            </svg>

            {/* Score and issues */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono font-semibold text-sm text-slate-100">{`${score}`}<span className="text-slate-500">/100</span></span>
                <span className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: trackColor }}>
                    {score > 69 ? "Strong" : score > 49 ? "Fair" : "Weak"}
                </span>
            </div>
        </div>
    );
};

export default ScoreCircle;
