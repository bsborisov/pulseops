import { useEffect } from "react";

import { X } from "lucide-react";

import {
  MethodBadge,
  StatusBadge,
} from "@/components/ui/Badge";

import type { RequestEvent } from "@shared/monitoring";

interface RequestDetailPanelProps {
  request:
  | RequestEvent
  | undefined;

  onClose: () => void;
}

interface DetailRowProps {
  label: string;
  children:
  React.ReactNode;
}

function DetailRow({
  label,
  children,
}: DetailRowProps) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-4 border-b border-edge/60 py-3 last:border-0">
      <div className="text-[10px] font-medium uppercase tracking-wider text-lo">
        {label}
      </div>

      <div className="min-w-0 text-[12px] text-mid">
        {children}
      </div>
    </div>
  );
}

export function RequestDetailPanel({
  request,
  onClose,
}: RequestDetailPanelProps) {
  useEffect(() => {
    if (!request) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    request,
    onClose,
  ]);

  if (!request) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close request details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/20 backdrop-blur-[1px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Request details"
        className={[
          "absolute inset-y-0 right-0",
          "flex w-full flex-col",
          "border-l border-edge bg-surface shadow-2xl",
          "sm:w-[440px]",
        ].join(" ")}
      >
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-edge px-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-[13px] font-semibold text-hi">
              Request Details
            </h2>

            <div className="mt-0.5 truncate font-mono text-[10px] text-lo">
              {request.id}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-md text-lo transition-colors hover:bg-panel hover:text-hi"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-5 flex items-center gap-2">
            <MethodBadge
              method={
                request.method
              }
            />

            <StatusBadge
              status={
                request.status
              }
            />

            <span className="ml-auto font-mono text-[11px] text-lo">
              {request.time}
            </span>
          </div>

          <DetailRow label="Endpoint">
            <span className="break-all font-mono">
              {
                request.endpoint
              }
            </span>
          </DetailRow>

          <DetailRow label="Service">
            {request.service}
          </DetailRow>

          <DetailRow label="Method">
            {request.method}
          </DetailRow>

          <DetailRow label="Status">
            <span className="font-mono tabular-nums">
              {request.status}
            </span>
          </DetailRow>

          <DetailRow label="Latency">
            <span
              className={[
                "font-mono tabular-nums",

                request.latency >
                  300
                  ? "text-err"
                  : request.latency >
                    150
                    ? "text-warn"
                    : "text-ok",
              ].join(" ")}
            >
              {
                request.latency
              }
              ms
            </span>
          </DetailRow>

          <DetailRow label="Region">
            {request.region}
          </DetailRow>

          <DetailRow label="Request ID">
            <span className="break-all font-mono text-[10px]">
              {request.id}
            </span>
          </DetailRow>
        </div>
      </aside>
    </div>
  );
}