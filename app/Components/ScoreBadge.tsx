interface ScoreBadgeProps {
  score: number;
}

/**
 * Unified blue/violet status badge (no red/orange/green).
 * "Strong" and "Good Start" share the violet family; "Needs Work" is a
 * cooler, softer blue tone so status stays readable without traffic lights.
 */
const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = "";
  let badgeText = "";
  let dotColor = "";

  if (score > 70) {
    badgeColor = "bg-badge-base text-badge-base-text border border-accent-violet/20";
    badgeText = "Strong";
    dotColor = "bg-accent-violet";
  } else if (score > 49) {
    badgeColor = "bg-accent-blue/10 text-accent-blue border border-accent-blue/20";
    badgeText = "Good Start";
    dotColor = "bg-accent-blue";
  } else {
    badgeColor = "bg-light-blue-100/60 text-slate-300 border border-white/15";
    badgeText = "Needs Work";
    dotColor = "bg-slate-400";
  }

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${badgeColor}`}>
      <span className={`size-1.5 rounded-full ${dotColor} pulse-glow`} />
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;
