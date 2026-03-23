import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDisputes } from "@/context/DisputeContext";
import { useWallet } from "@/context/WalletContext";
import { WalletButton } from "@/components/WalletButton";
import { DisputeCard } from "@/components/DisputeCard";
import { Button } from "@/components/ui/button";
import { Scale, Plus, Shield, Brain, Blocks, Zap, Users, Activity, BookOpen, Star } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { disputes } = useDisputes();
  const { connectedWallets, shortenAddress } = useWallet();

  const stats = {
    total: disputes.length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
    pending: disputes.filter((d) => d.status === "pending").length,
    totalEth: disputes.reduce((s, d) => s + d.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 glow-gold">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground">Onchain Justice</span>
              <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider">GenLayer</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 border border-success/20">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] font-medium text-success">Testnet Live</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/how-it-works")} className="text-muted-foreground hover:text-foreground text-xs">
              <BookOpen className="mr-1 h-3.5 w-3.5" /> How It Works
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/create")} className="text-xs">
              <Plus className="mr-1 h-3.5 w-3.5" /> New Dispute
            </Button>
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-foreground">Decentralized </span>
            <span className="text-gradient-gold">Justice</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
            AI-powered dispute resolution with multi-model consensus and validator democracy — built on GenLayer's Intelligent Contract architecture.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Activity, label: "Total Disputes", value: stats.total, color: "text-foreground" },
            { icon: Zap, label: "Resolved", value: stats.resolved, color: "text-success" },
            { icon: Users, label: "Pending", value: stats.pending, color: "text-warning" },
            { icon: Blocks, label: "Total Escrowed", value: `${stats.totalEth.toFixed(1)} ETH`, color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-border bg-gradient-card p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <span className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Reputation Leaderboard */}
        {connectedWallets.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-10 rounded-xl border border-border bg-gradient-card p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Wallet Reputation</h3>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {connectedWallets.map((w) => {
                const roleLabel = w.role === "userA" ? "Party A" : w.role === "userB" ? "Party B" : "Validator";
                const roleColor = w.role === "userA" ? "text-primary" : w.role === "userB" ? "text-accent" : "text-success";
                return (
                  <div key={w.address} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-foreground truncate">{shortenAddress(w.address)}</div>
                      <div className={`text-[10px] font-semibold ${roleColor}`}>{roleLabel}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-primary" />
                      <span className="text-sm font-mono font-bold text-primary">{w.reputation}</span>
                    </div>
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${w.reputation}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Concept Explainers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">Equivalence Principle</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Multiple AI models independently analyze evidence and must reach the same conclusion. 
              Like validators on a blockchain, if <span className="text-accent font-medium">LegalMind</span> and <span className="text-accent font-medium">JusticeNet</span> disagree, 
              the result is marked <span className="text-destructive font-medium">UNCERTAIN</span> — preventing single-model bias.
            </p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Optimistic Democracy</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI decisions are accepted by default unless challenged by validators. 
              If <span className="text-primary font-medium">no validator challenges</span> the ruling, it's finalized and funds are released. 
              A single challenge places the dispute <span className="text-destructive font-medium">Under Review</span>.
            </p>
          </div>
        </motion.div>

        {/* Disputes */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Active Disputes</h2>
          <span className="text-xs text-muted-foreground font-mono">{disputes.length} total</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {disputes.map((dispute, i) => (
            <DisputeCard key={dispute.id} dispute={dispute} index={i} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-16">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Onchain Justice · GenLayer Intelligent Contracts</span>
          <span className="font-mono">Testnet v0.1</span>
        </div>
      </footer>
    </div>
  );
}
