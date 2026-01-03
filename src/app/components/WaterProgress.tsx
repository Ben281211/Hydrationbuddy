import { Droplet } from "lucide-react";
import { motion } from "motion/react";

interface WaterProgressProps {
  current: number;
  goal: number;
}

export function WaterProgress({ current, goal }: WaterProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-64 h-64 -rotate-90">
        {/* Background circle */}
        <circle
          cx="128"
          cy="128"
          r="90"
          stroke="#E8F5E9"
          strokeWidth="16"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx="128"
          cy="128"
          r="90"
          stroke="url(#gradient)"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#66BB6A" />
            <stop offset="100%" stopColor="#43A047" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full blur-xl opacity-60" />
          <Droplet className="w-12 h-16 text-blue-500 relative drop-shadow-lg" strokeWidth={2} fill="currentColor" />
        </motion.div>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-baseline gap-1"
          >
            <span className="text-4xl text-emerald-700">{current}</span>
            <span className="text-xl text-emerald-600">ml</span>
          </motion.div>
          <p className="text-sm text-emerald-600/70 mt-1">of {goal}ml goal</p>
        </div>
      </div>
    </div>
  );
}