import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Flame, Target, Trophy } from "lucide-react";

interface DashboardProps {
  userData: any;
  onNavigateToTraining: () => void;
  onBack: () => void;
  onCompleteWorkout?: () => void;
}

interface StreakDay {
  date: Date;
  completed: boolean;
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Dashboard = ({ userData, onNavigateToTraining, onBack, onCompleteWorkout }: DashboardProps) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [thisWeekCompleted, setThisWeekCompleted] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [streakDays, setStreakDays] = useState<StreakDay[]>([]);

  const weeklyGoal = parseInt(userData.daysPerWeek || "0", 10);

  // --- Helpers ---
  const getCompletedDates = (): string[] => {
    const stored = localStorage.getItem("completedDates");
    return stored ? JSON.parse(stored) : [];
  };

  const refreshStats = () => {
    const completedDates = getCompletedDates();

    // Current streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 100; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      if (completedDates.includes(d.toDateString())) streak++;
      else break;
    }
    setCurrentStreak(streak);

    // Longest streak
    const sorted = completedDates
      .map(d => new Date(d).setHours(0, 0, 0, 0))
      .sort((a, b) => a - b);

    let longest = 0;
    let tempStreak = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0 || sorted[i] === sorted[i - 1] + 86400000) tempStreak++;
      else tempStreak = 1;
      longest = Math.max(longest, tempStreak);
    }
    setLongestStreak(longest);

    // Total workouts
    setTotalWorkouts(parseInt(localStorage.getItem("totalWorkouts") || "0", 10));

    // This week completed
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekCompleted = completedDates
      .map(d => new Date(d).setHours(0, 0, 0, 0))
      .filter(d => d >= startOfWeek.getTime() && d <= today.getTime()).length;

    setThisWeekCompleted(weekCompleted);

    // 30-day streak heatmap
    const heatmap: StreakDay[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i)); // 0 is oldest, 29 is today
      return { date, completed: completedDates.includes(date.toDateString()) };
    });
    setStreakDays(heatmap);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleWorkoutComplete = () => {
    refreshStats();
    if (onCompleteWorkout) onCompleteWorkout();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center shadow-soft">
            <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </Card>

          <Card className="p-4 text-center shadow-soft">
            <div className="bg-gradient-secondary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{longestStreak}</p>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </Card>

          <Card className="p-4 text-center shadow-soft">
            <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{thisWeekCompleted}/{weeklyGoal}</p>
            <p className="text-sm text-muted-foreground">This Week</p>
          </Card>

          <Card className="p-4 text-center shadow-soft">
            <div className="bg-gradient-secondary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{totalWorkouts}</p>
            <p className="text-sm text-muted-foreground">Total Runs</p>
          </Card>
        </div>

        {/* 30-day Heatmap */}
        <Card className="p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" /> 30-Day Activity Heatmap
          </h3>

          <div className="grid grid-cols-7 gap-1">
            {streakDays.map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                  day.completed
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
                title={day.date.toDateString()}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            Keep going! You're on a {currentStreak}-day streak 🔥
          </p>

          <div className="mt-4">
            <Button onClick={onNavigateToTraining}>Go to Today's Workout</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
