import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import AppLayout from '@/layouts/AppLayout'
import { Button } from '@/components/ui/button'
import LoginPage from '@/pages/auth/LoginPage'
import ApplicationsPage from '@/pages/applications/ApplicationsPage'
import CreateApplicationPage from '@/pages/applications/CreateApplicationPage'
import EditApplicationPage from '@/pages/applications/EditApplicationPage'
import AnalyticsPage from '@/pages/analytics/AnalyticsPage'
import ProfilePage from '@/pages/ProfilePage'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { applicationService } from '@/services/applicationService';
import { analyticsService } from '@/services/analyticsService';
import type { Application } from '@/types/application';
import type { ApplicationStats } from '@/types/analytics';
import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, Plus } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsData = await analyticsService.getStats();
        setStats(statsData);
        const appsData = await applicationService.getAll();
        setRecentApps(appsData.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/applications/new">
            <Plus className="mr-2 h-4 w-4" /> New Application
          </Link>
        </Button>
      </div>

      {/* Constrained container for aligned cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid gap-6 grid-cols-2">
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Briefcase className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats?.totalApplications || 0}</div>
              <p className="text-sm text-muted-foreground mt-1">tracked jobs</p>
              <p className="text-xs text-muted-foreground mt-3 italic">
                "Every application is a step closer to your dream job."
              </p>
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {stats?.byStatus.reduce((acc, curr) =>
                  ['APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW'].includes(curr.status)
                    ? acc + curr.count : acc, 0) || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">in progress</p>
              <p className="text-xs text-muted-foreground mt-3 italic">
                "Success is not final, failure is not fatal."
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="p-2">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApps.map(app => (
                <div key={app.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{app.positionTitle}</p>
                    <p className="text-sm text-muted-foreground">{app.companyName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
              {recentApps.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activity.</p>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    "The only way to do great work is to love what you do." — Steve Jobs
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useAuthStore } from "./store/authStore"

function Landing() {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/login" replace />
}

import RegisterPage from '@/pages/auth/RegisterPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/new" element={<CreateApplicationPage />} />
            <Route path="/applications/:id" element={<EditApplicationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
