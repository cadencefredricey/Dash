import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Flame, Target, Trophy, Settings, User, ChevronRight } from "lucide-react";

interface DashboardProps {
  userData: any;
  onNavigateToTraining: () => void;
  onBack: () => void;
}

const Dashboard = ({ userData, onNavigateToTraining, onBack }: DashboardProps) => {
  const [coachName, setCoachName] = useState("Coach Sarah");
  const [tempCoachName, setTempCoachName] = useState(coachName);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Mock streak data - in real app this would come from user progress
  const currentStreak = 5;
  const longestStreak = 12;
  const totalWorkouts = 23;
  const weeklyGoal = parseInt(userData.daysPerWeek);
  const thisWeekCompleted = 3;

  const handleSaveCoachName = () => {
    setCoachName(tempCoachName);
    setIsSettingsOpen(false);
  };

  const streakDays = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
    completed: i < 9 || i >= 12 // Mock completion pattern
  }));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-1">
              {coachName} has your training plan ready
            </p>
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
                    onChange={(e) => setTempCoachName(e.target.value)}
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
            <Flame className="h-5 w-5 text-primary" />
            Activity Streak
          </h3>
          <div className="grid grid-cols-7 md:grid-cols-14 gap-2">
            {streakDays.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                  day.completed
                    ? 'bg-gradient-primary text-white'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Keep going! You're on a {currentStreak}-day streak 🔥
          </p>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-medium transition-shadow duration-300"
            onClick={onNavigateToTraining}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Training Plan</h3>
                <p className="text-muted-foreground">
                  View your personalized {userData.daysPerWeek}-day training schedule
                </p>
                <Badge className="mt-3 bg-gradient-primary text-white">
                  {userData.goal.replace("-", " ")}
                </Badge>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-secondary w-10 h-10 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Your Coach</h3>
                <p className="text-muted-foreground">{coachName}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              "Great job on your consistency! Today's interval training will help build your speed."
            </p>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Back to Survey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;