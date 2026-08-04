import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-emerald-400'
            : score > 49
        ? 'text-amber-400' : 'text-rose-400';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-lg text-slate-200">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-lg font-mono">
                    <span className={textColor}>{score}</span><span className="text-slate-600">/100</span>
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="panel panel-hover w-full overflow-hidden">
            <div className="flex flex-row items-center p-6 gap-8 border-b border-border-softer">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <p className="section-eyebrow">Overall</p>
                    <h2 className="text-2xl font-bold text-slate-100">Your Resume Score</h2>
                    <p className="text-sm text-slate-500">
                        Calculated from the categories below.
                    </p>
                </div>
            </div>

            <div className="px-2 pb-2">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category title="Content" score={feedback.content.score} />
                <Category title="Structure" score={feedback.structure.score} />
                <Category title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    )
}
export default Summary
