export type DisputeStatus = "pending" | "ai_decided" | "under_review" | "resolved";

export type AIDecision = "User A wins" | "User B wins" | null;

export type AIAnalysis = {
  decision: string;
  scoreA: number;
  scoreB: number;
  confidence: number;
  model: string;
};

export type ValidatorVote = {
  validatorId: string;
  action: "accept" | "challenge";
};

export interface Dispute {
  id: string;
  userA: string;
  userB: string;
  amount: number;
  description: string;
  status: DisputeStatus;
  evidenceA: string[];
  evidenceB: string[];
  aiModel1Decision: AIDecision;
  aiModel2Decision: AIDecision;
  aiModel1Analysis: AIAnalysis | null;
  aiModel2Analysis: AIAnalysis | null;
  finalAIDecision: AIDecision | "UNCERTAIN";
  validatorVotes: ValidatorVote[];
  winner: string | null;
  fundsReleased: boolean;
  createdAt: Date;
}
