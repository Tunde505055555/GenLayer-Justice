import React, { createContext, useContext, useState, useCallback } from "react";
import type { Dispute } from "@/types/dispute";
import { SAMPLE_DISPUTES } from "@/data/sampleDisputes";
import {
  createDispute as createDisputeFn,
  submitEvidence as submitEvidenceFn,
  runAIDecision as runAIDecisionFn,
  submitVote as submitVoteFn,
  finalizeDecision as finalizeDecisionFn,
} from "@/ContractCode";

interface DisputeContextType {
  disputes: Dispute[];
  createDispute: (userA: string, userB: string, amount: number, description: string) => Dispute;
  submitEvidence: (disputeId: string, party: "A" | "B", evidence: string) => void;
  runAIDecision: (disputeId: string) => void;
  submitVote: (disputeId: string, validatorId: string, action: "accept" | "challenge") => void;
  finalizeDecision: (disputeId: string) => void;
  getDispute: (id: string) => Dispute | undefined;
}

const DisputeContext = createContext<DisputeContextType | null>(null);

export function DisputeProvider({ children }: { children: React.ReactNode }) {
  const [disputes, setDisputes] = useState<Dispute[]>(SAMPLE_DISPUTES);

  const updateDispute = useCallback((id: string, updater: (d: Dispute) => Dispute) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? updater(d) : d)));
  }, []);

  const createDispute = useCallback((userA: string, userB: string, amount: number, description: string) => {
    const dispute = createDisputeFn(userA, userB, amount, description) as Dispute;
    setDisputes((prev) => [dispute, ...prev]);
    return dispute;
  }, []);

  const submitEvidence = useCallback((disputeId: string, party: "A" | "B", evidence: string) => {
    updateDispute(disputeId, (d) => submitEvidenceFn(d, party, evidence) as Dispute);
  }, [updateDispute]);

  const runAIDecision = useCallback((disputeId: string) => {
    updateDispute(disputeId, (d) => runAIDecisionFn(d) as Dispute);
  }, [updateDispute]);

  const submitVote = useCallback((disputeId: string, validatorId: string, action: "accept" | "challenge") => {
    updateDispute(disputeId, (d) => submitVoteFn(d, validatorId, action) as Dispute);
  }, [updateDispute]);

  const finalizeDecision = useCallback((disputeId: string) => {
    updateDispute(disputeId, (d) => finalizeDecisionFn(d) as Dispute);
  }, [updateDispute]);

  const getDispute = useCallback((id: string) => disputes.find((d) => d.id === id), [disputes]);

  return (
    <DisputeContext.Provider value={{ disputes, createDispute, submitEvidence, runAIDecision, submitVote, finalizeDecision, getDispute }}>
      {children}
    </DisputeContext.Provider>
  );
}

export function useDisputes() {
  const ctx = useContext(DisputeContext);
  if (!ctx) throw new Error("useDisputes must be used within DisputeProvider");
  return ctx;
}
