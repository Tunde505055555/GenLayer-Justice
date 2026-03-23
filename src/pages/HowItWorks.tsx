import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Shield, Scale, Users, Zap, CheckCircle2, XCircle, Lock, Trophy } from "lucide-react";

const steps = [
  { icon: Lock, title: "1. Dispute Created", desc: "Two parties lock funds in escrow. Both submit evidence supporting their claim.", color: "text-primary" },
  { icon: Brain, title: "2. AI Analysis", desc: "Two independent AI models (LegalMind v2 & JusticeNet v1) analyze all evidence using multi-factor scoring.", color: "text-accent" },
  { icon: Scale, title: "3. Equivalence Check", desc: "Both models must agree on the outcome. If they disagree, the result is marked UNCERTAIN — preventing single-model bias.", color: "text-warning" },
  { icon: Users, title: "4. Validator Challenge Period", desc: "A countdown begins. Validators can accept or challenge the AI decision during this window.", color: "text-success" },
  { icon: Zap, title: "5. Optimistic Finalization", desc: "If no challenges are raised before the timer expires, the decision is automatically finalized and funds released.", color: "text-primary" },
  { icon: Trophy, title: "6. Resolution", desc: "The winner receives the escrowed funds. Reputation scores update based on outcomes.", color: "text-primary" },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/60">
        <div className="mx-auto flex max-w-4xl items-center px-6 py-3">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">How It Works</h1>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Onchain Justice combines AI intelligence with human oversight to resolve disputes fairly and transparently.
          </p>
        </motion.div>

        {/* Steps timeline */}
        <div className="relative mb-16">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative pl-16">
                <div className={`absolute left-3 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-secondary border border-border`}>
                  <step.icon className={`h-3.5 w-3.5 ${step.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Deep dive cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-accent/20 bg-accent/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-bold text-foreground">Equivalence Principle</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Inspired by GenLayer's deterministic consensus model, the Equivalence Principle ensures no single AI model can unilaterally decide a dispute.</p>
              <div className="rounded-lg bg-secondary/30 border border-border p-4">
                <p className="font-semibold text-foreground text-xs mb-2">How scoring works:</p>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /> Evidence length & detail depth</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /> Positive keywords (proof, receipt, contract)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /> Specificity — numbers, dates, addresses</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /> Formal language indicators</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /> Multiple pieces of evidence bonus</li>
                </ul>
              </div>
              <p>
                <span className="text-accent font-medium">LegalMind v2</span> weighs evidence quality and depth, while{" "}
                <span className="text-accent font-medium">JusticeNet v1</span> focuses on quantity and unique keyword coverage. 
                Both must reach the same conclusion for the decision to be valid.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Optimistic Democracy</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>AI decisions are optimistically accepted unless challenged, balancing efficiency with community oversight.</p>
              <div className="rounded-lg bg-secondary/30 border border-border p-4 space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-success mt-0.5" />
                  <span><span className="text-success font-medium">Accept</span> — Validator agrees with AI decision. No effect on finalization.</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <XCircle className="h-3 w-3 text-destructive mt-0.5" />
                  <span><span className="text-destructive font-medium">Challenge</span> — Flags the dispute for review. Blocks finalization until resolved.</span>
                </div>
              </div>
              <p>
                A <span className="text-primary font-medium">countdown timer</span> runs after the AI decision. If the timer expires with no challenges, 
                the decision is automatically finalized and funds are released to the winner.
              </p>
              <p>
                This mirrors blockchain optimistic rollups — assume validity, but allow disputes. Validator reputation scores 
                track accuracy over time, incentivizing honest participation.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
