import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Flame, Target, Trophy, Settings, ChevronRight } from "lucide-react";

interface DashboardProps {
  userData: any;
  onNavigateToTraining: () => void;
  onNavigateToSurvey?: () => void; // <--- new optional callback
  onBack: () => void;
}

interface StreakDay {
  date: Date;
  completed: boolean;
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Dashboard = ({ userData, onNavigateToTraining, onNavigateToSurvey, onBack }: DashboardProps) => {
  const [coachName, setCoachName] = useState("Coach Dash");
  const [tempCoachName, setTempCoachName] = useState(coachName);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  const weeklyGoal = parseInt(userData.daysPerWeek || "0");
  const thisWeekCompleted = 0;

  // Build streakDays for current + next week
  const [streakDaysState, setStreakDaysState] = useState<StreakDay[]>(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const storedStreak = parseInt(localStorage.getItem("currentStreak") || "0", 10);

    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const completed = date <= today && date >= new Date(today.getTime() - (storedStreak - 1) * 24 * 60 * 60 * 1000);
      return { date, completed };
    });
  });

  // Helper: load completed dates from localStorage
const getCompletedDates = (): string[] => {
  const stored = localStorage.getItem("completedDates");
  return stored ? JSON.parse(stored) : [];
};

// Helper: save completed dates to localStorage
const setCompletedDates = (dates: string[]) => {
  localStorage.setItem("completedDates", JSON.stringify(dates));
};


  // Mark today as completed and redirect to training
  const handleCompleteWorkout = () => {
  const today = new Date();
  const todayStr = today.toDateString();

  let completedDates = getCompletedDates();

  // Only add if not already completed
  if (!completedDates.includes(todayStr)) {
    completedDates.push(todayStr);
    setCompletedDates(completedDates);
  }

  // Determine streak: count consecutive days ending today
  let newStreak = 0;
  for (let i = 0; i < 100; i++) { // look back up to 100 days
    const day = new Date();
    day.setDate(today.getDate() - i);
    if (completedDates.includes(day.toDateString())) {
      newStreak++;
    } else {
      break; // stop at the first gap
    }
  }

  setCurrentStreak(newStreak);
  localStorage.setItem("currentStreak", String(newStreak));

  // Update streakDaysState for visualization
  setStreakDaysState(prev =>
    prev.map(day => ({
      ...day,
      completed: completedDates.includes(day.date.toDateString())
    }))
  );

  // Navigate to today's training
  onNavigateToTraining();
};




  // Fetch saved stats
  useEffect(() => {
    setCurrentStreak(parseInt(localStorage.getItem("currentStreak") || "0", 10));
    setLongestStreak(parseInt(localStorage.getItem("longestStreak") || "0", 10));
    setTotalWorkouts(parseInt(localStorage.getItem("totalWorkouts") || "0", 10));
  }, []);

  const handleSaveCoachName = () => {
    setCoachName(tempCoachName);
    setIsSettingsOpen(false);
  };

  // NEW: Safe navigation that skips survey if completed
  const handleNavigateToTraining = () => {
  // Always go straight to the training plan, regardless of survey
  onNavigateToTraining();
};

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-1">{coachName} has your training plan ready</p>
          </div>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Coach Name</label>
                  <Input
                    value={tempCoachName}
                    onChange={e => setTempCoachName(e.target.value)}
                    placeholder="Enter coach name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveCoachName}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
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

        {/* Streak Visualization */}
        <Card className="p-6 mb-8 shadow-soft">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" /> Activity Streak
          </h3>

          {/* Weekday labels */}
            <div className="grid grid-cols-7 gap-2 mb-1 text-center text-xs font-medium text-muted-foreground">
              {streakDaysState.slice(0, 7).map((day, index) => (
                <div key={index}>{weekdays[day.date.getDay()]}</div>
              ))}
            </div>


          {/* Streak squares */}
          <div className="grid grid-cols-7 md:grid-cols-14 gap-2">
  {streakDaysState.map((day, index) => (
    <div
      key={index}
      className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
        day.completed
          ? "bg-blue-500 text-white shadow-md"
          : "bg-muted text-muted-foreground border border-border"
      }`}
    >
      {day.date.getDate()}
    </div>
  ))}
</div>


          <p className="text-sm text-muted-foreground mt-3">
            Keep going! You're on a {currentStreak}-day streak 🔥
          </p>

          <div className="mt-4">
            <Button onClick={handleCompleteWorkout}>Complete Today's Workout</Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-1 gap-4 mb-8">
          <Card
            className="p-6 cursor-pointer hover:shadow-medium transition-shadow duration-300"
            onClick={handleNavigateToTraining}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">View Training Plan</h3>
                <p className="text-sm text-muted-foreground">Check your upcoming workouts</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Keep pushing toward your goal — one run at a time!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
