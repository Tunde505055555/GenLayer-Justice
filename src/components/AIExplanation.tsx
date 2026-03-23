import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface ChallengeCountdownProps {
  createdAt: Date;
  durationMinutes?: number;
  onExpired?: () => void;
}

export function ChallengeCountdown({ createdAt, durationMinutes = 5, onExpired }: ChallengeCountdownProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const endTime = new Date(createdAt).getTime() + durationMinutes * 60 * 1000;

    const tick = () => {
      const left = Math.max(0, endTime - Date.now());
      setRemaining(left);
      if (left === 0 && onExpired) onExpired();
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [createdAt, durationMinutes, onExpired]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const expired = remaining === 0;

  return (
    <div className={`flex items-center gap-2 rounded-lg px-4 py-3 border ${expired ? "border-success/30 bg-success/10" : "border-warning/30 bg-warning/10"}`}>
      <Timer className={`h-4 w-4 ${expired ? "text-success" : "text-warning"}`} />
      <div className="flex-1">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Challenge Period</div>
        {expired ? (
          <span className="text-sm font-semibold text-success">Period expired — ready to finalize</span>
        ) : (
          <span className="text-sm font-mono font-semibold text-warning">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")} remaining
          </span>
        )}
      </div>
    </div>
  );
}
