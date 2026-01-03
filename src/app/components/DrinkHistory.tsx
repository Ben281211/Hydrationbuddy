import { Droplet, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DrinkEntry {
  id: string;
  amount: number;
  time: string;
}

interface DrinkHistoryProps {
  entries: DrinkEntry[];
  onDelete: (id: string, amount: number) => void;
}

export function DrinkHistory({ entries, onDelete }: DrinkHistoryProps) {
  return (
    <div className="w-full">
      <h3 className="text-emerald-800 mb-3">Today's Hydration</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {entries.length === 0 ? (
            <p className="text-emerald-600/50 text-center py-8">
              No drinks logged yet. Start tracking!
            </p>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-emerald-100 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-blue-500" fill="currentColor" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-emerald-700">{entry.amount}ml</p>
                  <p className="text-xs text-emerald-600/60">{entry.time}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(entry.id, entry.amount)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}