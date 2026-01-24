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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
            <p className="text-xs text-muted-foreground">tracked jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.byStatus.reduce((acc, curr) =>
                ['APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW'].includes(curr.status)
                  ? acc + curr.count : acc, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 run-zoom-in">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApps.map(app => (
                <div key={app.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{app.positionTitle}</p>
                    <p className="text-xs text-muted-foreground">{app.companyName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
              {recentApps.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
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
