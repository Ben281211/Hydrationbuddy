import { motion } from "motion/react";
import { ReactNode } from "react";

interface QuickAddButtonProps {
  amount: number;
  label: string;
  icon: ReactNode;
  onClick: (amount: number) => void;
}

export function QuickAddButton({
  amount,
  label,
  icon,
  onClick,
}: QuickAddButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(amount)}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200/50 shadow-sm transition-colors"
    >
      <div className="w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-emerald-700">{amount}ml</p>
        <p className="text-xs text-emerald-600/70">{label}</p>
      </div>
    </motion.button>
  );
}