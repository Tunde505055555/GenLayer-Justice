import React, { createContext, useContext, useState, useCallback } from "react";

export type WalletRole = "userA" | "userB" | "validator";

interface WalletState {
  address: string;
  role: WalletRole;
  reputation: number;
}

interface WalletContextType {
  connectedWallets: WalletState[];
  activeWallet: WalletState | null;
  connectWallet: () => WalletState;
  disconnectWallet: () => void;
  switchWallet: (address: string) => void;
  getReputation: (address: string) => number;
  updateReputation: (address: string, delta: number) => void;
  shortenAddress: (address: string) => string;
}

const WalletContext = createContext<WalletContextType | null>(null);

function generateWalletAddress(): string {
  const hex = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) addr += hex[Math.floor(Math.random() * 16)];
  return addr;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connectedWallets, setConnectedWallets] = useState<WalletState[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const activeWallet = activeIndex >= 0 ? connectedWallets[activeIndex] : null;

  const shortenAddress = useCallback((addr: string) => {
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  const connectWallet = useCallback(() => {
    const address = generateWalletAddress();
    const count = connectedWallets.length;
    const role: WalletRole = count === 0 ? "userA" : count === 1 ? "userB" : "validator";
    const wallet: WalletState = { address, role, reputation: 50 };
    setConnectedWallets((prev) => [...prev, wallet]);
    setActiveIndex(connectedWallets.length);
    return wallet;
  }, [connectedWallets.length]);

  const disconnectWallet = useCallback(() => {
    if (activeIndex < 0) return;
    setConnectedWallets((prev) => prev.filter((_, i) => i !== activeIndex));
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev === 0 && connectedWallets.length > 1 ? 0 : -1));
  }, [activeIndex, connectedWallets.length]);

  const switchWallet = useCallback((address: string) => {
    const idx = connectedWallets.findIndex((w) => w.address === address);
    if (idx >= 0) setActiveIndex(idx);
  }, [connectedWallets]);

  const getReputation = useCallback((address: string) => {
    const w = connectedWallets.find((w) => w.address === address);
    return w?.reputation ?? 50;
  }, [connectedWallets]);

  const updateReputation = useCallback((address: string, delta: number) => {
    setConnectedWallets((prev) =>
      prev.map((w) => (w.address === address ? { ...w, reputation: Math.max(0, Math.min(100, w.reputation + delta)) } : w))
    );
  }, []);

  return (
    <WalletContext.Provider value={{ connectedWallets, activeWallet, connectWallet, disconnectWallet, switchWallet, getReputation, updateReputation, shortenAddress }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
