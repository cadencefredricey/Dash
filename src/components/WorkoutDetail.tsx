import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Target, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Workout {
  id: string;
  day: string;
  type: "run" | "cross-training" | "rest" | "stretching";
  title: string;
  duration: string;
  description: string;
  intensity: "low" | "moderate" | "high";
}

interface WorkoutDetailProps {
  workout: Workout;
  onBack: () => void;
  onComplete?: () => void; // callback to refresh dashboard
}

const WorkoutDetail = ({ workout, onBack, onComplete }: WorkoutDetailProps) => {
  const [feedback, setFeedback] = useState({
    completed: "",
    difficulty: "",
    notes: "",
    injury: "",
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // --- Complete Workout ---
  const handleComplete = () => {
    const today = new Date();
    const todayStr = today.toDateString();

    // Load completed dates
    const storedDates = localStorage.getItem("completedDates");
    const completedDates: string[] = storedDates ? JSON.parse(storedDates) : [];

    if (!completedDates.includes(todayStr)) {
      completedDates.push(todayStr);
      localStorage.setItem("completedDates", JSON.stringify(completedDates));
    }

    // Update total workouts
    const totalWorkouts = parseInt(localStorage.getItem("totalWorkouts") || "0", 10) + 1;
    localStorage.setItem("totalWorkouts", String(totalWorkouts));

    // Update streaks
    let currentStreak = 0;
    for (let i = 0; i < 100; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      if (completedDates.includes(d.toDateString())) currentStreak++;
      else break;
    }
    localStorage.setItem("currentStreak", String(currentStreak));

    const longestStreak = Math.max(
      currentStreak,
      parseInt(localStorage.getItem("longestStreak") || "0", 10)
    );
    localStorage.setItem("longestStreak", String(longestStreak));

    // Refresh dashboard
    if (onComplete) onComplete();

    navigate("/dashboard");
  };

  const handleSubmitFeedback = () => {
    toast({
      title: "Feedback Submitted",
      description: "Thanks for your feedback!",
    });
    if (onComplete) onComplete();
    setShowFeedback(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "run": return "bg-primary text-primary-foreground";
      case "cross-training": return "bg-secondary text-secondary-foreground";
      case "stretching": return "bg-accent text-accent-foreground";
      case "rest": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low": return "bg-accent/20 text-accent border-accent/30";
      case "moderate": return "bg-secondary/20 text-secondary border-secondary/30";
      case "high": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button variant="ghost" onClick={() => setShowFeedback(false)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workout
          </Button>

          <Card className="p-6 shadow-soft">
            <h2 className="text-2xl font-bold mb-6">Workout Feedback</h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Did you complete the workout?</Label>
                <RadioGroup value={feedback.completed} onValueChange={v => setFeedback({ ...feedback, completed: v })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="completed-yes" />
                    <Label htmlFor="completed-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="completed-partial" />
                    <Label htmlFor="completed-partial">Partially</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="completed-no" />
                    <Label htmlFor="completed-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Difficulty</Label>
                <RadioGroup value={feedback.difficulty} onValueChange={v => setFeedback({ ...feedback, difficulty: v })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="perfect" id="perfect" />
                    <Label htmlFor="perfect">Just right</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard">Hard</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Any injuries?</Label>
                <RadioGroup value={feedback.injury} onValueChange={v => setFeedback({ ...feedback, injury: v })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="no-injury" />
                    <Label htmlFor="no-injury">None</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minor" id="minor" />
                    <Label htmlFor="minor">Minor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="injury" id="injury" />
                    <Label htmlFor="injury">Major</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Optional" value={feedback.notes} onChange={e => setFeedback({ ...feedback, notes: e.target.value })}/>
              </div>

              <Button onClick={handleSubmitFeedback} className="w-full bg-gradient-primary hover:opacity-90" disabled={!feedback.completed || !feedback.difficulty || !feedback.injury}>
                Submit Feedback
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="p-6 shadow-soft">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold">{workout.day}</h1>
              <Badge className={getTypeColor(workout.type)}>{workout.type.replace("-", " ")}</Badge>
              <Badge variant="outline" className={getIntensityColor(workout.intensity)}>{workout.intensity} intensity</Badge>
            </div>

            <h2 className="text-xl font-semibold mb-3">{workout.title}</h2>

            <div className="flex items-center gap-1 text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <span>{workout.duration}</span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> Workout Details
            </h3>
            <p className="text-muted-foreground leading-relaxed">{workout.description}</p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleComplete} className="w-full bg-gradient-primary hover:opacity-90">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Complete
            </Button>

            <Button variant="outline" onClick={() => setShowFeedback(true)} className="w-full">
              <AlertTriangle className="mr-2 h-4 w-4" /> Report Issue or Skip
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutDetail;
