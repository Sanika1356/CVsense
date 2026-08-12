import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

/** Unified score badge within the blue/violet family (no traffic lights). */
const scoreBadgeTone = (score: number): "base" | "attention" =>
  score > 39 ? "base" : "attention";

const ScoreBadge = ({ score }: { score: number }) => {
  const tone = scoreBadgeTone(score);
  return (
      <div
          className={cn(
              "flex flex-row gap-1.5 items-center px-2.5 py-1 rounded-[96px] border",
              tone === "base"
                  ? "bg-badge-base border-accent-violet/20"
                  : "bg-badge-attention border-accent-blue/20"
          )}
      >
        <span
            className={cn(
                "size-1.5 rounded-full",
                tone === "base" ? "bg-accent-violet" : "bg-accent-blue"
            )}
        />
        <p
            className={cn(
                "text-sm font-medium font-mono",
                tone === "base" ? "text-badge-base-text" : "text-badge-attention-text"
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
  <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 text-accent-blue" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
    <path d="M8.5 12.5L10.75 14.75L15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ImproveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 text-accent-violet" xmlns="http://www.w3.org/2000/svg">
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
                          ? "bg-accent-blue/5 border-accent-blue/20 text-blue-300"
                          : "bg-accent-violet/5 border-accent-violet/20 text-violet-300"
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
