import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

const Landing = lazy(() => import("./pages/Landing"));
const Setup = lazy(() => import("./pages/Setup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#101010]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2ff00]"></div>
    </div>
  );
}

function SetupGuard({ children }) {
  const location = useLocation();
  const [setupStatus, setSetupStatus] = useState("loading");

  useEffect(() => {
    fetch("/api/setup/status")
      .then((res) => res.json())
      .then((data) => {
        setSetupStatus(data.setupComplete ? "complete" : "incomplete");
      })
      .catch(() => {
        setSetupStatus("incomplete");
      });
  }, []);

  if (setupStatus === "loading") {
    return <PageLoader />;
  }

  // If setup is incomplete and the user is not on /setup, redirect them to /setup
  if (setupStatus === "incomplete" && !location.pathname.startsWith("/setup")) {
    return <Navigate to="/setup" replace />;
  }

  // If setup is complete and the user is on /setup, redirect them to the dashboard
  if (setupStatus === "complete" && location.pathname.startsWith("/setup")) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <Suspense fallback={<PageLoader />}>
        <SetupGuard>
          <Routes location={location}>
            {/* Setup Wizard (no MainLayout) */}
            <Route path="/setup" element={<Setup />} />
            <Route path="/setup/*" element={<Setup />} />

            {/* Landing Page Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/home" element={<Landing />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/google/success" element={<AuthCallback />} />
            <Route path="/auth/google/error" element={<AuthCallback />} />

            {/* App Routes - Dashboard */}
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Dashboard />} />
              <Route path="orders" element={<Dashboard />} />
              <Route path="analytics" element={<Dashboard />} />
              <Route path="campaigns" element={<Dashboard />} />
              <Route path="settings" element={<Dashboard />} />
              <Route path="profile" element={<Dashboard />} />
              <Route path="billing" element={<Dashboard />} />
              <Route path="*" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SetupGuard>
      </Suspense>
    </div>
  );
}
