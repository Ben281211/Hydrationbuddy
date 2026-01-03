import { useState, useEffect } from "react";
import { WaterProgress } from "./components/WaterProgress";
import { QuickAddButton } from "./components/QuickAddButton";
import { DrinkHistory } from "./components/DrinkHistory";
import { Plus, RotateCcw, GlassWater, Droplets, Waves, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DrinkEntry {
  id: string;
  amount: number;
  time: string;
}

export default function App() {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [totalWater, setTotalWater] = useState(0);
  const [drinkHistory, setDrinkHistory] = useState<DrinkEntry[]>([]);
  const [customAmount, setCustomAmount] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoal");
    const savedTotal = localStorage.getItem("totalWater");
    const savedHistory = localStorage.getItem("drinkHistory");
    const savedDate = localStorage.getItem("lastDate");
    const today = new Date().toDateString();

    // Reset if it's a new day
    if (savedDate !== today) {
      localStorage.setItem("lastDate", today);
      localStorage.setItem("totalWater", "0");
      localStorage.setItem("drinkHistory", "[]");
    } else {
      if (savedGoal) setDailyGoal(parseInt(savedGoal));
      if (savedTotal) setTotalWater(parseInt(savedTotal));
      if (savedHistory) setDrinkHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dailyGoal", dailyGoal.toString());
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem("totalWater", totalWater.toString());
  }, [totalWater]);

  useEffect(() => {
    localStorage.setItem("drinkHistory", JSON.stringify(drinkHistory));
  }, [drinkHistory]);

  const addWater = (amount: number) => {
    setTotalWater((prev) => prev + amount);

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newEntry: DrinkEntry = {
      id: Date.now().toString(),
      amount,
      time,
    };

    setDrinkHistory((prev) => [newEntry, ...prev]);
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0) {
      addWater(amount);
      setCustomAmount("");
    }
  };

  const resetDay = () => {
    setTotalWater(0);
    setDrinkHistory([]);
  };

  const handleGoalUpdate = () => {
    const newGoal = parseInt(goalInput);
    if (newGoal && newGoal > 0) {
      setDailyGoal(newGoal);
      setShowSettings(false);
      setGoalInput("");
    }
  };

  const handleDeleteEntry = (id: string) => {
    setDrinkHistory((prev) => prev.filter((entry) => entry.id !== id));
    setTotalWater((prev) => prev - drinkHistory.find((entry) => entry.id === id)?.amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          <h1 className="text-emerald-800 mb-2">Hydration Buddy</h1>
          <p className="text-emerald-600/70">
            Stay hydrated, stay healthy!
          </p>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(!showSettings)}
            className="absolute top-0 right-0 p-2 rounded-full hover:bg-emerald-100 transition-colors"
          >
            <Settings className="w-5 h-5 text-emerald-600" />
          </motion.button>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-white/70 border border-emerald-200">
                <h3 className="text-emerald-800 mb-3">Daily Goal</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder={`Current: ${dailyGoal}ml`}
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-emerald-800 placeholder:text-emerald-400/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onKeyDown={(e) => e.key === "Enter" && handleGoalUpdate()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoalUpdate}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Update
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-6">
          {/* Progress */}
          <WaterProgress current={totalWater} goal={dailyGoal} />

          {/* Quick Add Buttons */}
          <div className="w-full">
            <h3 className="text-emerald-800 mb-3 text-center">Quick Add</h3>
            <div className="grid grid-cols-3 gap-3">
              <QuickAddButton
                amount={250}
                label="Glass"
                icon={<GlassWater className="w-8 h-8 text-emerald-600" />}
                onClick={addWater}
              />
              <QuickAddButton
                amount={500}
                label="Bottle"
                icon={<Droplets className="w-8 h-8 text-emerald-600" />}
                onClick={addWater}
              />
              <QuickAddButton
                amount={750}
                label="Large"
                icon={<Waves className="w-8 h-8 text-emerald-600" />}
                onClick={addWater}
              />
            </div>
          </div>

          {/* Custom Amount */}
          <div className="w-full">
            <h3 className="text-emerald-800 mb-3 text-center">Custom Amount</h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter ml..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/70 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-emerald-800 placeholder:text-emerald-400/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCustomAdd}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetDay}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/50 border border-emerald-200 text-emerald-700 hover:bg-white/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Day
          </motion.button>

          {/* History */}
          <DrinkHistory entries={drinkHistory} onDelete={handleDeleteEntry} />

          {/* Motivational Message */}
          {totalWater >= dailyGoal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full p-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 border border-emerald-300 text-center"
            >
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-emerald-800">
                Amazing! You've reached your daily goal!
              </p>
              <p className="text-sm text-emerald-600/70 mt-1">
                Keep up the great hydration!
              </p>
            </motion.div>
          )}

          {totalWater > 0 && totalWater < dailyGoal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-4 rounded-xl bg-white/40 border border-emerald-100/50 text-center"
            >
              <p className="text-emerald-700">
                {dailyGoal - totalWater}ml to go! 💪
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}