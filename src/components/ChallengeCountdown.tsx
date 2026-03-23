import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Dispute } from "@/types/dispute";
import { StatusBadge } from "@/components/StatusBadge";
import { Scale } from "lucide-react";

export function DisputeCard({ dispute, index }: { dispute: Dispute; index: number }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => navigate(`/dispute/${dispute.id}`)}
      className="group cursor-pointer rounded-xl border border-border bg-gradient-card p-6 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-gold"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {dispute.description.length > 40 ? dispute.description.slice(0, 40) + "…" : dispute.description}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {dispute.userA} vs {dispute.userB}
            </p>
          </div>
        </div>
        <StatusBadge status={dispute.status} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Escrowed</span>
          <span className="font-mono text-sm font-semibold text-primary">{dispute.amount} ETH</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(dispute.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
