import { CheckCircle2, XCircle, Shield, Users } from "lucide-react";
import type { ValidatorVote } from "@/types/dispute";

interface ValidatorPanelProps {
  votes: ValidatorVote[];
}

export function ValidatorPanel({ votes }: ValidatorPanelProps) {
  const accepts = votes.filter((v) => v.action === "accept").length;
  const challenges = votes.filter((v) => v.action === "challenge").length;

  return (
    <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Validator Panel</h3>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{votes.length} vote{votes.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Summary bar */}
      {votes.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
            <span className="text-success">{accepts} Accept{accepts !== 1 ? "s" : ""}</span>
            <span className="text-destructive">{challenges} Challenge{challenges !== 1 ? "s" : ""}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden flex">
            {accepts > 0 && (
              <div className="h-full bg-success transition-all" style={{ width: `${(accepts / votes.length) * 100}%` }} />
            )}
            {challenges > 0 && (
              <div className="h-full bg-destructive transition-all" style={{ width: `${(challenges / votes.length) * 100}%` }} />
            )}
          </div>
        </div>
      )}

      {/* Vote list */}
      <div className="space-y-2">
        {votes.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4 italic">No validator votes yet</p>
        ) : (
          votes.map((v, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-mono text-foreground">{v.validatorId}</span>
              </div>
              <span className={`flex items-center gap-1 text-[11px] font-semibold ${v.action === "accept" ? "text-success" : "text-destructive"}`}>
                {v.action === "accept" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {v.action.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
