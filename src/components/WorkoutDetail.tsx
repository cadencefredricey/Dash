import { useState } from "react";
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
  onComplete: () => void;
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

  // 🔹 Handle workout completion (updates streaks)
  const handleComplete = () => {
    const currentStreak = parseInt(localStorage.getItem("currentStreak") || "0", 10);
    const newStreak = currentStreak + 1;
    localStorage.setItem("currentStreak", String(newStreak));

    const longestStreak = parseInt(localStorage.getItem("longestStreak") || "0", 10);
    if (newStreak > longestStreak) {
      localStorage.setItem("longestStreak", String(newStreak));
    }

    const totalWorkouts = parseInt(localStorage.getItem("totalWorkouts") || "0", 10) + 1;
    localStorage.setItem("totalWorkouts", String(totalWorkouts));

    setShowFeedback(true);
  };

  const handleSubmitFeedback = () => {
    toast({
      title: "Feedback Submitted",
      description: "Thanks for the feedback! We'll use this to improve your future workouts.",
    });
    onComplete();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "run":
        return "bg-primary text-primary-foreground";
      case "cross-training":
        return "bg-secondary text-secondary-foreground";
      case "stretching":
        return "bg-accent text-accent-foreground";
      case "rest":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low":
        return "bg-accent/20 text-accent border-accent/30";
      case "moderate":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => setShowFeedback(false)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workout
          </Button>

          <Card className="p-6 shadow-soft">
            <h2 className="text-2xl font-bold mb-6">How did it go?</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Did you complete the workout?</Label>
                <RadioGroup 
                  value={feedback.completed}
                  onValueChange={(value) => setFeedback({...feedback, completed: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="completed-yes" />
                    <Label htmlFor="completed-yes">Yes, completed as planned</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="completed-partial" />
                    <Label htmlFor="completed-partial">Partially completed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="completed-no" />
                    <Label htmlFor="completed-no">Did not complete</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>How difficult was it?</Label>
                <RadioGroup 
                  value={feedback.difficulty}
                  onValueChange={(value) => setFeedback({...feedback, difficulty: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy">Too easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="perfect" id="perfect" />
                    <Label htmlFor="perfect">Just right</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard">Too difficult</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Any injuries or concerns?</Label>
                <RadioGroup 
                  value={feedback.injury}
                  onValueChange={(value) => setFeedback({...feedback, injury: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="no-injury" />
                    <Label htmlFor="no-injury">No issues</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minor" id="minor-pain" />
                    <Label htmlFor="minor-pain">Minor soreness/discomfort</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="injury" id="injury" />
                    <Label htmlFor="injury">Injury or significant pain</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other thoughts about this workout?"
                  value={feedback.notes}
                  onChange={(e) => setFeedback({...feedback, notes: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleSubmitFeedback}
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={!feedback.completed || !feedback.difficulty || !feedback.injury}
              >
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
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Schedule
        </Button>

        <Card className="p-6 shadow-soft">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold">{workout.day}</h1>
              <Badge className={getTypeColor(workout.type)}>
                {workout.type.replace("-", " ")}
              </Badge>
              <Badge variant="outline" className={getIntensityColor(workout.intensity)}>
                {workout.intensity} intensity
              </Badge>
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
              <Target className="h-5 w-5 text-primary" />
              Workout Details
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {workout.description}
            </p>
          </div>

          {workout.type === "run" && (
            <div className="mb-6">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-semibold mb-2 text-primary">Running Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Start with a 5-10 minute warm-up walk</li>
                  <li>• Maintain a conversational pace for easy runs</li>
                  <li>• Focus on good form and breathing</li>
                  <li>• Cool down with 5 minutes of walking and stretching</li>
                </ul>
              </Card>
            </div>
          )}

          {workout.type === "rest" && (
            <div className="mb-6">
              <Card className="p-4 bg-accent/5 border-accent/20">
                <h4 className="font-semibold mb-2 text-accent">Rest Day Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Allows muscles to recover and rebuild</li>
                  <li>• Prevents overtraining and injury</li>
                  <li>• Light activities like walking are okay</li>
                  <li>• Stay hydrated and get good sleep</li>
                </ul>
              </Card>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleComplete}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Complete
              {/* made button add to streaks on dashboard*/}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFeedback(true)}
              className="w-full"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Issue or Skip
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutDetail;
