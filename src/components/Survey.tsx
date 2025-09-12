import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SurveyProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const Survey = ({ onComplete, onBack }: SurveyProps) => {
  const [formData, setFormData] = useState({
    goal: "",
    currentMileTime: "",
    current5kTime: "",
    age: "",
    gender: "",
    experience: "",
    daysPerWeek: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).every((value) => value !== "")) {
      onComplete(formData); // 🔹 Send survey answers back to App.tsx
    }
  };

  const isValid = Object.values(formData).every((value) => value !== "");

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto p-8 shadow-medium">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Let's Create Your Plan
          </h1>
          <p className="text-muted-foreground mt-2">
            Tell us about your running goals and current fitness level
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal">What's your main running goal?</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, goal: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5k">Complete a 5K</SelectItem>
                <SelectItem value="10k">Complete a 10K</SelectItem>
                <SelectItem value="half-marathon">Complete a Half Marathon</SelectItem>
                <SelectItem value="marathon">Complete a Marathon</SelectItem>
                <SelectItem value="fitness">General Fitness</SelectItem>
                <SelectItem value="speed">Improve Speed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Times */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mile-time">Current Mile Time (mm:ss)</Label>
              <Input
                id="mile-time"
                placeholder="e.g., 8:30"
                value={formData.currentMileTime}
                onChange={(e) =>
                  setFormData({ ...formData, currentMileTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="5k-time">Current 5K Time (mm:ss)</Label>
              <Input
                id="5k-time"
                placeholder="e.g., 28:00"
                value={formData.current5kTime}
                onChange={(e) =>
                  setFormData({ ...formData, current5kTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Age + Gender */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label>Running Experience</Label>
            <RadioGroup
              value={formData.experience}
              onValueChange={(value) =>
                setFormData({ ...formData, experience: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner (less than 6 months)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate (6 months - 2 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced (2+ years)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Days per week */}
          <div className="space-y-2">
            <Label>How many days per week can you train?</Label>
            <RadioGroup
              value={formData.daysPerWeek}
              onValueChange={(value) =>
                setFormData({ ...formData, daysPerWeek: value })
              }
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="3days" />
                <Label htmlFor="3days">3 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="4days" />
                <Label htmlFor="4days">4 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="5days" />
                <Label htmlFor="5days">5 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6" id="6days" />
                <Label htmlFor="6days">6 days</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
          >
            Generate My Training Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Survey;
