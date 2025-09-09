import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Target, Timer, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-running.jpg";
import Survey from "@/components/Survey";
import Dashboard from "@/components/Dashboard";
import MultiWeekTrainingPlan from "@/components/MultiWeekTrainingPlan";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"landing" | "survey" | "dashboard" | "plan">("landing");
  const [userData, setUserData] = useState(null);

  const handleSurveyComplete = (data: any) => {
    setUserData(data);
    setCurrentStep("dashboard");
  };

  if (currentStep === "survey") {
    return <Survey onComplete={handleSurveyComplete} onBack={() => setCurrentStep("landing")} />;
  }

  if (currentStep === "dashboard" && userData) {
    return (
      <Dashboard 
        userData={userData} 
        onNavigateToTraining={() => setCurrentStep("plan")}
        onBack={() => setCurrentStep("survey")} 
      />
    );
  }

  if (currentStep === "plan" && userData) {
    return <MultiWeekTrainingPlan userData={userData} onBack={() => setCurrentStep("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Runners in action" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Dash
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your personalized running training plan. Achieve your goals with science-backed workouts tailored to your current fitness level.
            </p>
            <Button 
              variant="hero"
              size="lg" 
              onClick={() => setCurrentStep("survey")}
              className="text-lg px-8 py-4 shadow-strong hover:shadow-medium transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Dash?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a training plan that adapts to your schedule, fitness level, and goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 text-center shadow-soft hover:shadow-medium transition-shadow duration-300">
            <div className="bg-gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Personalized Goals</h3>
            <p className="text-muted-foreground">
              Whether you're training for a 5K, marathon, or just staying fit, we create a plan that works for you.
            </p>
          </Card>

          <Card className="p-8 text-center shadow-soft hover:shadow-medium transition-shadow duration-300">
            <div className="bg-gradient-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Timer className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Smart Scheduling</h3>
            <p className="text-muted-foreground">
              Balanced weekly plans with running, cross-training, stretching, and rest days for optimal recovery.
            </p>
          </Card>

          <Card className="p-8 text-center shadow-soft hover:shadow-medium transition-shadow duration-300">
            <div className="bg-gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
            <p className="text-muted-foreground">
              Daily feedback system helps you track progress, report injuries, and adjust your training.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;