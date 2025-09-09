import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Play } from "lucide-react";

interface Workout {
  id: string;
  day: string;
  type: "run" | "cross-training" | "rest" | "stretching";
  title: string;
  duration: string;
  description: string;
  intensity: "low" | "moderate" | "high";
}

interface WeeklyScheduleProps {
  workouts: Workout[];
  onWorkoutClick: (workout: Workout) => void;
}

const WeeklySchedule = ({ workouts, onWorkoutClick }: WeeklyScheduleProps) => {
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

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">This Week's Schedule</h2>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <Card 
            key={workout.id}
            className="p-6 hover:shadow-medium transition-shadow duration-300 cursor-pointer"
            onClick={() => onWorkoutClick(workout)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold">{workout.day}</h3>
                  <Badge className={getTypeColor(workout.type)}>
                    {workout.type.replace("-", " ")}
                  </Badge>
                  <Badge variant="outline" className={getIntensityColor(workout.intensity)}>
                    {workout.intensity} intensity
                  </Badge>
                </div>
                
                <h4 className="font-medium mb-2">{workout.title}</h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {workout.description}
                </p>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {workout.duration}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-4"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;