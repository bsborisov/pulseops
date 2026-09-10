import { cn } from "@/lib/utils";

export type ConnectionState =
  | "connecting"
  | "live"
  | "reconnecting"
  | "offline";

interface ConnectionIndicatorProps {
  state: ConnectionState;
}

const stateConfig: Record<
  ConnectionState,
  {
    label: string;
    dotClassName: string;
    textClassName: string;
  }
> = {
  connecting: {
    label: "Connecting",
    dotClassName: "bg-warn animate-pulse",
    textClassName: "text-warn",
  },

  live: {
    label: "Live",
    dotClassName: "bg-ok animate-pulse-dot",
    textClassName: "text-ok",
  },

  reconnecting: {
    label: "Reconnecting",
    dotClassName: "bg-warn animate-pulse",
    textClassName: "text-warn",
  },

  offline: {
    label: "Offline",
    dotClassName: "bg-err",
    textClassName: "text-err",
  },
};

export function ConnectionIndicator({
  state,
}: ConnectionIndicatorProps) {
  const config = stateConfig[state];

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          config.dotClassName,
        )}
      />

      <span
        className={cn(
          "text-xs font-medium",
          config.textClassName,
        )}
      >
        {config.label}
      </span>
    </div>
  );
}