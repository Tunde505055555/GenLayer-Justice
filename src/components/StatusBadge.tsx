import type { DisputeStatus } from "@/types/dispute";

const statusConfig: Record<DisputeStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  ai_decided: {
    label: "AI Decided",
    className: "bg-accent/15 text-accent border-accent/30",
  },
  under_review: {
    label: "Under Review",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  resolved: {
    label: "Resolved",
    className: "bg-success/15 text-success border-success/30",
  },
};

export function StatusBadge({ status }: { status: DisputeStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${config.className}`}>
      {config.label}
    </span>
  );
}
