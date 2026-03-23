import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDisputes } from "@/context/DisputeContext";
import { useWallet } from "@/context/WalletContext";
import { WalletButton } from "@/components/WalletButton";
import { StatusBadge } from "@/components/StatusBadge";
import { AIExplanation } from "@/components/AIExplanation";
import { ChallengeCountdown } from "@/components/ChallengeCountdown";
import { ValidatorPanel } from "@/components/ValidatorPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Brain, CheckCircle2, XCircle, Shield, Trophy, Send, BarChart3, Info } from "lucide-react";

function ScoreBar({ label, score, maxScore, color }: { label: string; score: number; maxScore: number; color: string }) {
  const pct = Math.min((score / Math.max(maxScore, 1)) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-mono font-semibold ${color}`}>{score}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className={`h-full rounded-full ${color === "text-primary" ? "bg-primary" : "bg-accent"}`} />
      </div>
    </div>
  );
}

export default function DisputeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDispute, submitEvidence, runAIDecision, submitVote, finalizeDecision } = useDisputes();
  const { activeWallet, shortenAddress } = useWallet();
  const dispute = getDispute(id!);

  const [evidenceA, setEvidenceA] = useState("");
  const [evidenceB, setEvidenceB] = useState("");

  if (!dispute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <p className="text-muted-foreground">Dispute not found.</p>
      </div>
    );
  }

  const canRunAI = dispute.status === "pending" && (dispute.evidenceA.length > 0 || dispute.evidenceB.length > 0);
  const canVote = dispute.status === "ai_decided" || dispute.status === "under_review";
  const canFinalize = dispute.status === "ai_decided" && dispute.finalAIDecision !== "UNCERTAIN" && !dispute.validatorVotes.some((v) => v.action === "challenge");

  const maxScore = Math.max(
    dispute.aiModel1Analysis?.scoreA ?? 0,
    dispute.aiModel1Analysis?.scoreB ?? 0,
    dispute.aiModel2Analysis?.scoreA ?? 0,
    dispute.aiModel2Analysis?.scoreB ?? 0,
    1
  );

  const isPartyA = activeWallet?.address === dispute.userA || activeWallet?.role === "userA";
  const isPartyB = activeWallet?.address === dispute.userB || activeWallet?.role === "userB";
  const isValidator = activeWallet?.role === "validator";
  const validatorId = activeWallet ? shortenAddress(activeWallet.address) : "";

  const displayAddr = (addr: string) => {
    if (addr.length > 12) return shortenAddress(addr);
    return addr;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-3">
            <StatusBadge status={dispute.status} />
            <WalletButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{dispute.description}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span><span className="text-primary font-medium">{displayAddr(dispute.userA)}</span> vs <span className="text-accent font-medium">{displayAddr(dispute.userB)}</span></span>
            <span className="font-mono text-primary font-semibold">{dispute.amount} ETH escrowed</span>
            <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Evidence Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-gradient-card p-6 shadow-card">
            <h2 className="mb-5 text-base font-semibold text-foreground flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Evidence Submissions
            </h2>

            {/* User A */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-primary flex items-center gap-2">
                {displayAddr(dispute.userA)} <span className="text-[10px] text-muted-foreground font-normal">(Party A)</span>
              </h3>
              <div className="mb-3 space-y-2">
                {dispute.evidenceA.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-3 text-center rounded-lg bg-secondary/30">No evidence submitted</p>
                ) : (
                  dispute.evidenceA.map((e, i) => (
                    <div key={i} className="rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-secondary-foreground leading-relaxed">
                      <span className="text-[10px] text-muted-foreground font-mono block mb-1">Evidence #{i + 1}</span>
                      {e}
                    </div>
                  ))
                )}
              </div>
              {dispute.status === "pending" && (
                <div className="flex gap-2">
                  <Input placeholder="Submit evidence for Party A..." value={evidenceA} onChange={(e) => setEvidenceA(e.target.value)} className="bg-secondary border-border text-sm" />
                  <Button size="sm" variant="outline" onClick={() => { if (evidenceA.trim()) { submitEvidence(dispute.id, "A", evidenceA); setEvidenceA(""); } }}>
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* User B */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-accent flex items-center gap-2">
                {displayAddr(dispute.userB)} <span className="text-[10px] text-muted-foreground font-normal">(Party B)</span>
              </h3>
              <div className="mb-3 space-y-2">
                {dispute.evidenceB.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-3 text-center rounded-lg bg-secondary/30">No evidence submitted</p>
                ) : (
                  dispute.evidenceB.map((e, i) => (
                    <div key={i} className="rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-secondary-foreground leading-relaxed">
                      <span className="text-[10px] text-muted-foreground font-mono block mb-1">Evidence #{i + 1}</span>
                      {e}
                    </div>
                  ))
                )}
              </div>
              {dispute.status === "pending" && (
                <div className="flex gap-2">
                  <Input placeholder="Submit evidence for Party B..." value={evidenceB} onChange={(e) => setEvidenceB(e.target.value)} className="bg-secondary border-border text-sm" />
                  <Button size="sm" variant="outline" onClick={() => { if (evidenceB.trim()) { submitEvidence(dispute.id, "B", evidenceB); setEvidenceB(""); } }}>
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI Decision Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-gradient-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent" /> AI Analysis
              </h2>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Equivalence Principle</span>
            </div>

            {dispute.aiModel1Analysis ? (
              <div className="space-y-5">
                {/* Model 1 */}
                <div className="rounded-lg border border-border bg-secondary/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <BarChart3 className="h-3 w-3 text-accent" /> {dispute.aiModel1Analysis.model}
                    </span>
                    <span className="text-xs font-mono text-accent">{Math.round(dispute.aiModel1Analysis.confidence)}% confident</span>
                  </div>
                  <ScoreBar label={displayAddr(dispute.userA)} score={dispute.aiModel1Analysis.scoreA} maxScore={maxScore} color="text-primary" />
                  <div className="mt-2" />
                  <ScoreBar label={displayAddr(dispute.userB)} score={dispute.aiModel1Analysis.scoreB} maxScore={maxScore} color="text-accent" />
                  <div className="mt-3 text-xs font-semibold text-foreground">→ {dispute.aiModel1Decision}</div>
                </div>

                {/* Model 2 */}
                <div className="rounded-lg border border-border bg-secondary/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <BarChart3 className="h-3 w-3 text-accent" /> {dispute.aiModel2Analysis!.model}
                    </span>
                    <span className="text-xs font-mono text-accent">{Math.round(dispute.aiModel2Analysis!.confidence)}% confident</span>
                  </div>
                  <ScoreBar label={displayAddr(dispute.userA)} score={dispute.aiModel2Analysis!.scoreA} maxScore={maxScore} color="text-primary" />
                  <div className="mt-2" />
                  <ScoreBar label={displayAddr(dispute.userB)} score={dispute.aiModel2Analysis!.scoreB} maxScore={maxScore} color="text-accent" />
                  <div className="mt-3 text-xs font-semibold text-foreground">→ {dispute.aiModel2Decision}</div>
                </div>

                {/* Consensus */}
                <div className={`flex items-center justify-between rounded-lg px-4 py-3 border ${dispute.finalAIDecision === "UNCERTAIN" ? "border-destructive/30 bg-destructive/10" : "border-success/30 bg-success/10"}`}>
                  <div>
                    <span className="text-xs text-muted-foreground block">Multi-Model Consensus</span>
                    <span className={`text-sm font-bold ${dispute.finalAIDecision === "UNCERTAIN" ? "text-destructive" : "text-success"}`}>
                      {dispute.finalAIDecision}
                    </span>
                  </div>
                  {dispute.finalAIDecision === "UNCERTAIN" && (
                    <div className="flex items-center gap-1 text-[10px] text-destructive">
                      <Info className="h-3 w-3" /> Models disagree
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Brain className="mx-auto h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Submit evidence, then run AI analysis</p>
                <Button onClick={() => runAIDecision(dispute.id)} disabled={!canRunAI} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Brain className="mr-2 h-4 w-4" /> Run AI Analysis
                </Button>
              </div>
            )}
          </motion.div>

          {/* AI Explanation */}
          {dispute.aiModel1Analysis && dispute.aiModel2Analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <AIExplanation
                model1={dispute.aiModel1Analysis}
                model2={dispute.aiModel2Analysis}
                finalDecision={dispute.finalAIDecision}
                userA={displayAddr(dispute.userA)}
                userB={displayAddr(dispute.userB)}
              />
            </motion.div>
          )}

          {/* Challenge Countdown */}
          {dispute.status === "ai_decided" && dispute.finalAIDecision !== "UNCERTAIN" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
              <ChallengeCountdown createdAt={dispute.createdAt} durationMinutes={5} />
            </motion.div>
          )}

          {/* Validator Voting */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-gradient-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Validator Voting
              </h2>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Optimistic Democracy</span>
            </div>

            {canVote && (
              <div className="space-y-3 mb-5">
                <p className="text-xs text-muted-foreground">
                  {activeWallet
                    ? `Voting as ${shortenAddress(activeWallet.address)}`
                    : "Connect a wallet to vote"}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-success/15 text-success hover:bg-success/25 border border-success/30"
                    disabled={!activeWallet}
                    onClick={() => { if (activeWallet) { submitVote(dispute.id, validatorId || activeWallet.address, "accept"); } }}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Accept
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-destructive/15 text-destructive hover:bg-destructive/25 border border-destructive/30"
                    disabled={!activeWallet}
                    onClick={() => { if (activeWallet) { submitVote(dispute.id, validatorId || activeWallet.address, "challenge"); } }}
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Challenge
                  </Button>
                </div>
              </div>
            )}

            {!canVote && dispute.status === "pending" && (
              <p className="text-sm text-muted-foreground text-center py-6">Voting opens after AI decision</p>
            )}

            {dispute.status === "under_review" && (
              <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-xs text-destructive">Decision challenged. Dispute is under review and cannot be finalized.</p>
              </div>
            )}
          </motion.div>

          {/* Validator Panel */}
          {dispute.validatorVotes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <ValidatorPanel votes={dispute.validatorVotes} />
            </motion.div>
          )}

          {/* Resolution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-gradient-card p-6 shadow-card">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-5">
              <Trophy className="h-4 w-4 text-primary" /> Final Resolution
            </h2>

            {dispute.status === "resolved" ? (
              <div className="text-center py-8">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 mb-4 glow-gold">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground">{dispute.winner && dispute.winner.length > 12 ? shortenAddress(dispute.winner) : dispute.winner}</p>
                <p className="text-sm text-muted-foreground mt-1">Winner</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/15 border border-success/20 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm font-mono font-semibold text-success">{dispute.amount} ETH released</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-5">
                  {dispute.status === "under_review"
                    ? "Decision challenged — awaiting review resolution"
                    : dispute.finalAIDecision === "UNCERTAIN"
                    ? "AI models disagree — manual governance required"
                    : dispute.status === "pending"
                    ? "Awaiting evidence and AI analysis"
                    : "All validators accepted. Ready to finalize."}
                </p>
                <Button onClick={() => finalizeDecision(dispute.id)} disabled={!canFinalize} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold">
                  <Trophy className="mr-2 h-4 w-4" /> Finalize & Release Funds
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
