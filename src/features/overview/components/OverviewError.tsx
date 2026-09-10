import {
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

interface OverviewErrorProps {
  error: Error;
  retrying: boolean;
  onRetry: () => void;
}

export function OverviewError({
  error,
  retrying,
  onRetry,
}: OverviewErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-5">
      <div className="w-full max-w-md rounded-lg border border-err/20 bg-surface p-6 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-err/10 text-err">
          <TriangleAlert size={19} />
        </div>

        <h2 className="mt-4 text-[14px] font-semibold text-hi">
          Unable to load monitoring data
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-lo">
          {error.message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className={[
            "mx-auto mt-5 flex items-center gap-2 rounded-md",
            "border border-edge bg-panel px-3 py-2",
            "text-xs font-medium text-mid",
            "transition-colors hover:border-accent/30 hover:text-hi",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          <RotateCcw
            size={13}
            className={
              retrying
                ? "animate-spin"
                : ""
            }
          />

          {retrying
            ? "Retrying..."
            : "Try again"}
        </button>
      </div>
    </div>
  );
}