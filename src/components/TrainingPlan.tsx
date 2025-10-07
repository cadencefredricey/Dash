import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Target } from "lucide-react";
import WeeklySchedule from "./WeeklySchedule";
import WorkoutDetail from "./WorkoutDetail";

interface TrainingPlanProps {
  userData: { id: number; goal: string; daysPerWeek: string; experience: string };
  onBack: () => void;
}

interface Workout {
  id: string;
  day: string;
  type: "run" | "cross-training" | "rest" | "stretching";
  title: string;
  duration: string;
  description: string;
  intensity: "low" | "moderate" | "high";
}

const TrainingPlan = ({ userData, onBack }: TrainingPlanProps) => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const generatePlan = (): Workout[] => {
    const weekNumber = 1; // you can change or make dynamic later

    const baseWorkouts: Workout[] = [
      {
        id: `${weekNumber}-1`,
        day: "Monday",
        type: "run",
        title: "Easy Run",
        duration: `${25 + weekNumber * 2} mins`,
        description:
          "Comfortable pace run to build aerobic base. Focus on maintaining conversational pace.",
        intensity: "low",
      },
      {
        id: `${weekNumber}-2`,
        day: "Tuesday",
        type: "cross-training",
        title: "Cross Training",
        duration: `${40 + weekNumber} mins`,
        description:
          "Low-impact cardio like cycling, swimming, or elliptical to maintain fitness while reducing impact stress.",
        intensity: "moderate",
      },
      {
        id: `${weekNumber}-3`,
        day: "Wednesday",
        type: "run",
        title: weekNumber <= 4 ? "Tempo Run" : "Interval Training",
        duration: `${30 + weekNumber} mins`,
        description:
          weekNumber <= 4
            ? "Comfortably hard pace for sustained effort. Build lactate threshold."
            : "Speed work with intervals. Warm up 10 mins, intervals at target pace, cool down 10 mins.",
        intensity: "high",
      },
      {
        id: `${weekNumber}-4`,
        day: "Thursday",
        type: "stretching",
        title: "Recovery & Stretching",
        duration: "30 mins",
        description:
          "Active recovery with dynamic stretches, foam rolling, and light mobility work.",
        intensity: "low",
      },
      {
        id: `${weekNumber}-5`,
        day: "Friday",
        type: "rest",
        title: "Rest Day",
        duration: "0 mins",
        description:
          "Complete rest to allow your body to recover and adapt to training stress.",
        intensity: "low",
      },
      {
        id: `${weekNumber}-6`,
        day: "Saturday",
        type: "run",
        title: "Long Run",
        duration: `${45 + weekNumber * 3} mins`,
        description:
          "Build endurance with longer, steady-pace run. Keep effort conversational throughout.",
        intensity: "moderate",
      },
      {
        id: `${weekNumber}-7`,
        day: "Sunday",
        type: "run",
        title: "Recovery Run",
        duration: `${20 + weekNumber} mins`,
        description:
          "Very easy pace run to promote active recovery and blood flow.",
        intensity: "low",
      },
    ];

    const daysPerWeek = parseInt(userData.daysPerWeek);
    if (daysPerWeek <= 3)
      return baseWorkouts.filter(
        (w) => w.id.endsWith("1") || w.id.endsWith("3") || w.id.endsWith("6")
      );
    if (daysPerWeek === 4)
      return baseWorkouts.filter(
        (w) =>
          w.id.endsWith("1") ||
          w.id.endsWith("2") ||
          w.id.endsWith("3") ||
          w.id.endsWith("6")
      );
    if (daysPerWeek === 5)
      return baseWorkouts.filter((w) => !w.id.endsWith("5") && !w.id.endsWith("7"));
    return baseWorkouts.filter((w) => !w.id.endsWith("5"));
  };

  const weeklyPlan = generatePlan();

  // Save training plan to backend
  useEffect(() => {
    const savePlan = async () => {
      if (!userData?.id || !weeklyPlan?.length) return;

      try {
        const response = await fetch("/api/training-plan/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.id, plan: weeklyPlan }),
        });
        if (!response.ok) console.error("Failed to save training plan");
      } catch (err) {
        console.error("Error saving training plan:", err);
      }
    };

    savePlan();
  }, [userData.id, weeklyPlan]);

  if (selectedWorkout) {
    return (
      <WorkoutDetail
        workout={selectedWorkout}
        onBack={() => setSelectedWorkout(null)}
        onComplete={() => setSelectedWorkout(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header & overview */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
            Your Personalized Training Plan
          </h1>
          {/*
          <p className="text-muted-foreground">
            Based on your goal: {userData.goal.replace("-", " ")} •{" "}
            {userData.daysPerWeek} days per week
          </p>
          */}
        </div>
        {/*
        <Card className="mb-8 p-6 shadow-soft">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Goal</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {userData.goal.replace("-", " ")}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-secondary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Schedule</h3>
              <p className="text-sm text-muted-foreground">
                {userData.daysPerWeek} days per week
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Experience</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {userData.experience}
              </p>
            </div>
          </div>
        </Card>
        */}

        <WeeklySchedule workouts={weeklyPlan} onWorkoutClick={setSelectedWorkout} />
      </div>
    </div>
  );
};

export default TrainingPlan;
