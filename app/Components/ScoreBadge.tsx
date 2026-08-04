interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let badgeText = '';
  let dotColor = '';

  if (score > 70) {
    badgeColor = 'bg-badge-green text-badge-green-text border border-emerald-500/20';
    badgeText = 'Strong';
    dotColor = 'bg-emerald-400';
  } else if (score > 49) {
    badgeColor = 'bg-badge-yellow text-badge-yellow-text border border-amber-500/20';
    badgeText = 'Good Start';
    dotColor = 'bg-amber-400';
  } else {
    badgeColor = 'bg-badge-red text-badge-red-text border border-rose-500/20';
    badgeText = 'Needs Work';
    dotColor = 'bg-rose-400';
  }

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${badgeColor}`}>
      <span className={`size-1.5 rounded-full ${dotColor} pulse-glow`} />
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;
