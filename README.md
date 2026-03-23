# GenLayer Justice

AI-powered on-chain dispute resolution with Equivalence Principle and Optimistic Democracy.

## 🌐 Live Demo

👉 https://genlayer-justice.lovable.app/

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)

---

## Overview

GenLayer Justice is a decentralized dispute resolution web application that simulates an **Intelligent Contract** on the GenLayer protocol. It demonstrates how AI models and validator consensus can fairly resolve disputes on-chain — without requiring a centralized authority.

The app showcases two core protocol concepts:

- **Equivalence Principle** — Multiple independent AI models analyze evidence and must reach agreement for a decision to be valid.
- **Optimistic Democracy** — Validators can challenge AI decisions within a time window, ensuring human oversight over automated rulings.

---

## Features

### 🏛️ Dispute Creation (Escrow Simulation)
- Create disputes between two parties (User A and User B)
- Specify an amount and description
- Funds are "locked" in simulated escrow until resolution

### 📄 Evidence Submission
- Both parties can submit text-based evidence
- Evidence is stored and displayed separately per party
- Scoring considers length, keywords, specificity, and formality

### 🤖 AI Decision System
- Two simulated AI models (**LegalMind v2** and **JusticeNet v1**) independently analyze evidence
- Each model returns a weighted score and a winning party
- If both models agree → decision is finalized
- If they disagree → status is marked as **UNCERTAIN**
- An **AI Explanation** panel shows reasoning, confidence levels, and score breakdowns

### 🗳️ Optimistic Democracy Voting
- Validators can **Accept** or **Challenge** the AI decision
- A **countdown timer** enforces a challenge window before finalization
- If no challenge is raised → decision is auto-finalized
- If challenged → dispute enters **Under Review** status

### ✅ Final Resolution
- Winner is declared and funds are released (simulated)
- Dispute status transitions: `Pending` → `AI Decided` → `Under Review` / `Resolved`

### 👛 Wallet Connection
- Simulated wallet connection with shortened addresses (e.g., `0x1a2B...9xYz`)
- Role assignment based on connection order:
  - 1st wallet → **User A**
  - 2nd wallet → **User B**
  - Subsequent wallets → **Validators**
- Reputation scores tracked per wallet address

### 📊 Dashboard
- Professional Web3-styled dashboard with dispute cards and status badges
- Reputation leaderboard for connected wallets
- Validator panel showing vote tallies per dispute

### 📖 How It Works
- Educational page explaining the Equivalence Principle and Optimistic Democracy
- Step-by-step dispute lifecycle timeline

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 18 + TypeScript               |
| Build Tool   | Vite 5                              |
| Styling      | Tailwind CSS 3 + shadcn/ui          |
| Routing      | React Router v6                     |
| State        | React Context API + TanStack Query  |
| Animations   | Framer Motion                       |
| Charts       | Recharts                            |

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── AIExplanation.tsx     # AI reasoning breakdown
│   ├── ChallengeCountdown.tsx# Validator challenge timer
│   ├── DisputeCard.tsx       # Dispute list card
│   ├── NavLink.tsx           # Navigation link
│   ├── StatusBadge.tsx       # Status indicator badges
│   ├── ValidatorPanel.tsx    # Validator votes display
│   └── WalletButton.tsx      # Wallet connect button
├── context/
│   ├── DisputeContext.tsx    # Dispute state management
│   └── WalletContext.tsx     # Wallet & role management
├── data/
│   └── sampleDisputes.ts    # Demo dispute data
├── pages/
│   ├── Index.tsx             # Home / dashboard
│   ├── CreateDispute.tsx     # New dispute form
│   ├── DisputeDetail.tsx     # Single dispute view
│   └── HowItWorks.tsx        # Educational explainer
├── types/
│   └── dispute.ts            # TypeScript interfaces
├── ContractCode.jsx          # Simulated intelligent contract logic
└── App.tsx                   # Router & providers
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun

### Installation

```bash
git clone <repository-url>
cd genlayer-justice
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Demo Walkthrough

1. **Connect Wallet** — Click "Connect Wallet" in the header to simulate a wallet connection.
2. **Browse Disputes** — View pre-loaded sample disputes on the dashboard.
3. **Create a Dispute** — Fill in the amount, description, and parties.
4. **Submit Evidence** — Add evidence for either party on the dispute detail page.
5. **Run AI Analysis** — Trigger the AI decision and review the explanation panel.
6. **Vote as Validator** — Connect additional wallets and accept or challenge the decision.
7. **Finalize** — Wait for the challenge countdown to expire, then finalize the dispute.

---

## Key Concepts

### Equivalence Principle
Multiple independent AI models must reach the same conclusion for a decision to be considered valid. This reduces the risk of a single biased or faulty model determining outcomes.

### Optimistic Democracy
AI decisions are assumed correct unless actively challenged by human validators within a defined time window. This balances efficiency (most decisions finalize automatically) with safety (bad decisions can be caught).

---

## License

This project is open source and available under the [MIT License](LICENSE).
