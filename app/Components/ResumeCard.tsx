import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import ScoreCircle from "~/Components/ScoreCircle";
import ConfirmDialog from "~/Components/ConfirmDialog";

/**
 * ResumeCard — analyzed resume card on the home page.
 * Features:
 * - Delete icon hidden by default; fades/slides in on hover (desktop)
 * - On touch/mobile devices the delete icon is always visible but subtle
 * - Confirmation dialog before deletion; deletion goes through Puter KV
 * - Loading state, error handling, and duplicate-click protection
 */
const ResumeCard = ({
  resume,
  onDelete,
}: {
  resume: Resume;
  /** Callback after the card has been removed from storage */
  onDelete?: () => void;
}) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;
  const { fs, kv } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let url: string | undefined;
    const loadResume = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (!blob) return;
        url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch {
        /* file read failures are non-fatal for the card itself */
      }
    };
    loadResume();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [imagePath, fs]);

  /* Detect touch capability so mobile users (no hover) always see the delete affordance */
  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const handleRequestDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return; // prevent duplicate delete requests
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await kv.delete(`resume:${id}`);
      /* Remove the associated resume image from storage to keep KV/fs consistent */
      try {
        await fs.delete(imagePath);
      } catch {
        /* image deletion failure should not block removing the analysis */
      }
      onDelete?.();
      setConfirmOpen(false);
    } catch (err) {
      console.error("Failed to delete resume:", err);
      setDeleteError(err instanceof Error ? err.message : "Something went wrong while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Link
        to={`/resume/${id}`}
        className="resume-card group animate-in fade-in duration-700"
        aria-label={`${companyName ?? "Resume"} analysis — ${jobTitle ?? "view details"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Delete action — hidden until hover (desktop) or always subtle (touch) */}
        <button
          type="button"
          aria-label="Delete analysis"
          title="Delete analysis"
          onClick={handleRequestDelete}
          className={`delete-button ${
            isTouchDevice || isHovered ? "opacity-100 translate-y-0" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 6H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {deleteError && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-accent-violet/15 border border-accent-violet/30 text-[11px] text-violet-200 animate-in fade-in duration-300">
            Could not delete — {deleteError}
          </div>
        )}

        <div className="resume-card-header">
          <div className="flex flex-col gap-2 min-w-0">
            {companyName && <h2 className="text-slate-100! font-bold wrap-break-word">{companyName}</h2>}
            {jobTitle && <h3 className="text-base wrap-break-word text-slate-500">{jobTitle}</h3>}
            {!companyName && !jobTitle && <h2 className="text-slate-100! font-bold">Resume</h2>}
          </div>
          <div className="shrink-0">
            <ScoreCircle score={feedback.overallScore} />
          </div>
        </div>
        {resumeUrl && (
          <div className="gradient-border animate-in fade-in duration-700 relative overflow-hidden rounded-2xl">
            <div className="w-full h-full relative">
              <img
                src={resumeUrl}
                alt="resume"
                className="w-full h-87.5 max-sm:h-50 object-cover object-top rounded-[14px] transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-950/70 via-transparent to-transparent rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12S6.5 5 12 5S21 12 21 12S17.5 19 12 19S3 12 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  View full analysis
                </span>
              </div>
            </div>
          </div>
        )}
      </Link>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this resume analysis?"
        message="Are you sure you want to delete this analysis? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ResumeCard;
