import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/Dashboard";
import TrainingPlan from "./components/TrainingPlan";
import Survey from "./components/Survey";
import LoginForm from './LoginForm';
import Register from "./pages/register";
import PrivateRoute from "@/components/PrivateRoute";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const AppRoutes = () => {
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState<any | null>(null);

  const dummyUser = { id: 0, username: "Demo", email: "demo@example.com" };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard
              userData={dummyUser}
              onNavigateToTraining={() => navigate("/training-plan")}
              onBack={() => navigate("/")}
            />
          </PrivateRoute>
        }
      />

      <Route
        path="/training-plan"
        element={
          <PrivateRoute>
            {surveyData ? (
              <TrainingPlan
                userData={surveyData}
                onBack={() => navigate("/dashboard")}
              />
            ) : (
              <Survey
                onComplete={(data) => setSurveyData(data)}
                onBack={() => navigate("/dashboard")}
              />
            )}
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
