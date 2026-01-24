import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsService } from '@/services/analyticsService';
import type { ApplicationStats } from '@/types/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
    APPLIED: '#3b82f6',
    SCREENING: '#8b5cf6',
    PHONE_INTERVIEW: '#f59e0b',
    TECHNICAL_INTERVIEW: '#f97316',
    ONSITE_INTERVIEW: '#ec4899',
    OFFER_RECEIVED: '#10b981',
    ACCEPTED: '#059669',
    REJECTED: '#ef4444',
    WITHDRAWN: '#6b7280',
};

export default function AnalyticsPage() {
    const [stats, setStats] = useState<ApplicationStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await analyticsService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!stats) return null;

    const chartData = stats.byStatus.map((item) => ({
        name: item.status.replace('_', ' '),
        count: item.count,
        color: STATUS_COLORS[item.status] || '#cbd5e1',
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalApplications}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Application Status Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[350px]">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={0}
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No data to display
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
