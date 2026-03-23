/**
 * ContractCode.jsx
 * 
 * Simulates an Intelligent Contract for Onchain Justice
 * using the Equivalence Principle and Optimistic Democracy.
 * 
 * GenLayer-inspired logic functions with realistic AI scoring.
 */

const generateId = () => Math.random().toString(36).substring(2, 10);

// ─── Keyword-based sentiment analysis ──────────────────────────────
const POSITIVE_KEYWORDS = [
  "proof", "evidence", "receipt", "contract", "signed", "confirmed",
  "witness", "documented", "verified", "agreed", "transaction", "delivered",
  "completed", "paid", "acknowledged", "certified", "notarized", "recorded",
  "timestamp", "blockchain", "hash", "audit", "compliance", "guarantee",
];

const NEGATIVE_KEYWORDS = [
  "fraud", "scam", "lie", "fake", "stolen", "breach", "violation",
  "never", "refused", "denied", "failed", "broken", "damaged", "missing",
  "unauthorized", "dispute", "complaint", "negligence", "deception",
];

function analyzeEvidence(evidenceList) {
  let score = 0;

  for (const text of evidenceList) {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/);

    // Factor 1: Evidence length (more detail = stronger)
    score += Math.min(words.length * 0.5, 15);

    // Factor 2: Positive keywords found
    for (const kw of POSITIVE_KEYWORDS) {
      if (lower.includes(kw)) score += 3;
    }

    // Factor 3: Negative keywords (claims against other party)
    for (const kw of NEGATIVE_KEYWORDS) {
      if (lower.includes(kw)) score += 1.5;
    }

    // Factor 4: Specificity — numbers, dates, addresses suggest concrete evidence
    const numberMatches = lower.match(/\d+/g);
    if (numberMatches) score += numberMatches.length * 2;

    // Factor 5: Formal language
    if (lower.includes("pursuant") || lower.includes("hereby") || lower.includes("accordance")) {
      score += 4;
    }
  }

  // Factor 6: Multiple pieces of evidence show stronger case
  score += evidenceList.length * 2;

  return score;
}

/**
 * AI Model 1 — "LegalMind" 
 * Focuses on evidence quality: keyword strength + detail depth
 */
function aiModel1Analyze(evidenceA, evidenceB) {
  const scoreA = analyzeEvidence(evidenceA);
  const scoreB = analyzeEvidence(evidenceB);

  return {
    decision: scoreA >= scoreB ? "User A wins" : "User B wins",
    scoreA: Math.round(scoreA * 10) / 10,
    scoreB: Math.round(scoreB * 10) / 10,
    confidence: Math.min(Math.abs(scoreA - scoreB) / Math.max(scoreA + scoreB, 1) * 100, 99),
    model: "LegalMind v2",
  };
}

/**
 * AI Model 2 — "JusticeNet"
 * Focuses on evidence quantity + specificity ratio
 */
function aiModel2Analyze(evidenceA, evidenceB) {
  let scoreA = evidenceA.length * 5;
  let scoreB = evidenceB.length * 5;

  // Specificity: count unique keywords per side
  const countKeywords = (list) => {
    const found = new Set();
    for (const text of list) {
      const lower = text.toLowerCase();
      for (const kw of [...POSITIVE_KEYWORDS, ...NEGATIVE_KEYWORDS]) {
        if (lower.includes(kw)) found.add(kw);
      }
    }
    return found.size;
  };

  scoreA += countKeywords(evidenceA) * 3;
  scoreB += countKeywords(evidenceB) * 3;

  // Average word count per evidence (depth)
  const avgWords = (list) => list.length > 0 ? list.reduce((s, e) => s + e.split(/\s+/).length, 0) / list.length : 0;
  scoreA += avgWords(evidenceA) * 0.8;
  scoreB += avgWords(evidenceB) * 0.8;

  return {
    decision: scoreA >= scoreB ? "User A wins" : "User B wins",
    scoreA: Math.round(scoreA * 10) / 10,
    scoreB: Math.round(scoreB * 10) / 10,
    confidence: Math.min(Math.abs(scoreA - scoreB) / Math.max(scoreA + scoreB, 1) * 100, 99),
    model: "JusticeNet v1",
  };
}

// ─── Contract Functions ──────────────────────────────────────────

export function createDispute(userA, userB, amount, description) {
  return {
    id: generateId(),
    userA,
    userB,
    amount,
    description,
    status: "pending",
    evidenceA: [],
    evidenceB: [],
    aiModel1Decision: null,
    aiModel2Decision: null,
    aiModel1Analysis: null,
    aiModel2Analysis: null,
    finalAIDecision: null,
    validatorVotes: [],
    winner: null,
    fundsReleased: false,
    createdAt: new Date(),
  };
}

export function submitEvidence(dispute, party, evidence) {
  if (dispute.status !== "pending") {
    throw new Error("Evidence can only be submitted while dispute is pending.");
  }
  const updated = { ...dispute };
  if (party === "A") {
    updated.evidenceA = [...updated.evidenceA, evidence];
  } else if (party === "B") {
    updated.evidenceB = [...updated.evidenceB, evidence];
  } else {
    throw new Error("Invalid party. Must be 'A' or 'B'.");
  }
  return updated;
}

export function runAIDecision(dispute) {
  if (dispute.evidenceA.length === 0 && dispute.evidenceB.length === 0) {
    throw new Error("Both parties must submit evidence before AI analysis.");
  }

  const updated = { ...dispute };

  const analysis1 = aiModel1Analyze(dispute.evidenceA, dispute.evidenceB);
  const analysis2 = aiModel2Analyze(dispute.evidenceA, dispute.evidenceB);

  updated.aiModel1Decision = analysis1.decision;
  updated.aiModel2Decision = analysis2.decision;
  updated.aiModel1Analysis = analysis1;
  updated.aiModel2Analysis = analysis2;

  // Equivalence Principle: both models must agree
  if (analysis1.decision === analysis2.decision) {
    updated.finalAIDecision = analysis1.decision;
  } else {
    updated.finalAIDecision = "UNCERTAIN";
  }

  updated.status = "ai_decided";
  return updated;
}

export function submitVote(dispute, validatorId, action) {
  if (dispute.status !== "ai_decided" && dispute.status !== "under_review") {
    throw new Error("Voting only allowed after AI decision.");
  }

  const updated = { ...dispute };
  const existingIndex = updated.validatorVotes.findIndex(
    (v) => v.validatorId === validatorId
  );

  const vote = { validatorId, action };
  if (existingIndex >= 0) {
    updated.validatorVotes = [...updated.validatorVotes];
    updated.validatorVotes[existingIndex] = vote;
  } else {
    updated.validatorVotes = [...updated.validatorVotes, vote];
  }

  const hasChallenges = updated.validatorVotes.some((v) => v.action === "challenge");
  if (hasChallenges) {
    updated.status = "under_review";
  }

  return updated;
}

export function finalizeDecision(dispute) {
  if (dispute.status === "resolved") {
    throw new Error("Dispute already resolved.");
  }
  if (dispute.status === "under_review") {
    throw new Error("Cannot finalize — dispute is under review due to challenges.");
  }
  if (!dispute.finalAIDecision || dispute.finalAIDecision === "UNCERTAIN") {
    throw new Error("Cannot finalize — AI decision is uncertain.");
  }

  const updated = { ...dispute };
  updated.winner = dispute.finalAIDecision === "User A wins" ? dispute.userA : dispute.userB;
  updated.fundsReleased = true;
  updated.status = "resolved";
  return updated;
}
