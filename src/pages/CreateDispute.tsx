import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDisputes } from "@/context/DisputeContext";
import { useWallet } from "@/context/WalletContext";
import { WalletButton } from "@/components/WalletButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Scale } from "lucide-react";

export default function CreateDispute() {
  const navigate = useNavigate();
  const { createDispute } = useDisputes();
  const { activeWallet, connectedWallets, shortenAddress } = useWallet();

  const walletA = connectedWallets.find((w) => w.role === "userA");
  const walletB = connectedWallets.find((w) => w.role === "userB");

  const [userA, setUserA] = useState("");
  const [userB, setUserB] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const effectiveUserA = walletA ? walletA.address : userA;
  const effectiveUserB = walletB ? walletB.address : userB;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveUserA || !effectiveUserB || !amount || !description) return;
    const dispute = createDispute(effectiveUserA, effectiveUserB, parseFloat(amount), description);
    navigate(`/dispute/${dispute.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/60">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-gradient-card p-8 shadow-card">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Create New Dispute</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {walletA || walletB
                ? "Connected wallets auto-fill party addresses."
                : "Connect wallets or enter addresses manually."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Party A</label>
                {walletA ? (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-mono text-primary">
                    {shortenAddress(walletA.address)}
                  </div>
                ) : (
                  <Input placeholder="0x... or name" value={userA} onChange={(e) => setUserA(e.target.value)} className="bg-secondary border-border" />
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Party B</label>
                {walletB ? (
                  <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm font-mono text-accent">
                    {shortenAddress(walletB.address)}
                  </div>
                ) : (
                  <Input placeholder="0x... or name" value={userB} onChange={(e) => setUserB(e.target.value)} className="bg-secondary border-border" />
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Amount (ETH)</label>
              <Input type="number" step="0.01" min="0" placeholder="1.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-secondary border-border" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Dispute Description</label>
              <textarea
                placeholder="Describe the dispute..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-gold">
              <Lock className="mr-2 h-4 w-4" /> Lock Funds & Create Dispute
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
