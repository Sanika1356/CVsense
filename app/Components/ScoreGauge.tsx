import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    const percentage = score / 100;

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    const label = score > 69 ? "Strong" : score > 49 ? "Fair" : "Needs work";
    const labelColor = score > 69 ? "text-emerald-400" : score > 49 ? "text-amber-400" : "text-rose-400";

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="55%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Foreground arc with rounded ends */}
                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - percentage)}
                        className="transition-[stroke-dashoffset] duration-1000 ease-out"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <div className="text-xl font-mono font-semibold pt-4 text-slate-100">
                        {score}<span className="text-slate-500">/100</span>
                    </div>
                </div>
            </div>
            <span className={`text-xs font-medium uppercase tracking-wider ${labelColor}`}>{label}</span>
        </div>
    );
};

export default ScoreGauge;
