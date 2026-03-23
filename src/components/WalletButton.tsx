import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, LogOut, UserCircle, Star } from "lucide-react";

export function WalletButton() {
  const { activeWallet, connectedWallets, connectWallet, disconnectWallet, switchWallet, shortenAddress } = useWallet();
  const [open, setOpen] = useState(false);

  if (!activeWallet) {
    return (
      <Button onClick={() => connectWallet()} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold text-xs">
        <Wallet className="mr-1.5 h-3.5 w-3.5" /> Connect Wallet
      </Button>
    );
  }

  const roleLabel = activeWallet.role === "userA" ? "Party A" : activeWallet.role === "userB" ? "Party B" : "Validator";
  const roleColor = activeWallet.role === "userA" ? "text-primary" : activeWallet.role === "userB" ? "text-accent" : "text-success";

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="border-border bg-secondary/50 text-foreground hover:bg-secondary text-xs gap-1.5"
      >
        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        <span className="font-mono">{shortenAddress(activeWallet.address)}</span>
        <span className={`text-[10px] font-semibold ${roleColor}`}>({roleLabel})</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-border bg-card p-3 shadow-card">
            <div className="mb-2 text-[10px] text-muted-foreground uppercase tracking-wider">Connected Wallets</div>
            <div className="space-y-1.5 mb-3">
              {connectedWallets.map((w) => {
                const rl = w.role === "userA" ? "Party A" : w.role === "userB" ? "Party B" : "Validator";
                const rc = w.role === "userA" ? "text-primary" : w.role === "userB" ? "text-accent" : "text-success";
                const isActive = w.address === activeWallet.address;
                return (
                  <button
                    key={w.address}
                    onClick={() => { switchWallet(w.address); setOpen(false); }}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors ${isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary border border-transparent"}`}
                  >
                    <UserCircle className={`h-4 w-4 ${rc}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-foreground truncate">{shortenAddress(w.address)}</div>
                      <div className={`text-[10px] ${rc} font-semibold`}>{rl}</div>
                    </div>
                    <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Star className="h-2.5 w-2.5 text-primary" /> {w.reputation}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 text-[11px]" onClick={() => { connectWallet(); setOpen(false); }}>
                <Wallet className="mr-1 h-3 w-3" /> Add Wallet
              </Button>
              <Button size="sm" variant="outline" className="text-[11px] text-destructive hover:text-destructive" onClick={() => { disconnectWallet(); setOpen(false); }}>
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
