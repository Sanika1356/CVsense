import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1.5 items-center px-2.5 py-1 rounded-[96px] border",
              score > 69
                  ? "bg-badge-green border-emerald-500/20"
                  : score > 39
                      ? "bg-badge-yellow border-amber-500/20"
                      : "bg-badge-red border-rose-500/20"
          )}
      >
        <span
            className={cn(
                "size-1.5 rounded-full",
                score > 69 ? "bg-emerald-400" : score > 39 ? "bg-amber-400" : "bg-rose-400"
            )}
        />
        <p
            className={cn(
                "text-sm font-medium font-mono",
                score > 69
                    ? "text-badge-green-text"
                    : score > 39
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-xl font-semibold text-slate-100">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const GoodIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 text-emerald-400" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
    <path d="M8.5 12.5L10.75 14.75L15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ImproveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 text-amber-400" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
    <path d="M12 8V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="16" r="0.9" fill="currentColor" />
  </svg>
);

const CategoryContent = ({
                        tips,
                        }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="bg-surface-700/40 border border-border-softer w-full rounded-lg px-5 py-4 grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-2 items-center" key={index}>
                {tip.type === "good" ? <GoodIcon /> : <ImproveIcon />}
                <p className="text-sm text-slate-300">{tip.tip}</p>
              </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-2 rounded-2xl p-4 border",
                      tip.type === "good"
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/5 border-amber-500/20 text-amber-300"
                  )}
              >
                <div className="flex flex-row gap-2 items-center">
                  {tip.type === "good" ? <GoodIcon /> : <ImproveIcon />}
                  <p className="text-base font-semibold">{tip.tip}</p>
                </div>
                <p className="text-sm text-slate-400">{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback, forceOpen = false }: { feedback: Feedback; forceOpen?: boolean }) => {
  return (
      <div className="panel flex flex-col gap-4 w-full p-2">
        <Accordion forceOpen={forceOpen}>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;