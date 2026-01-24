export interface ApplicationStats {
    totalApplications: number;
    byStatus: {
        status: string;
        count: number;
    }[];
    recentActivity: {
        id: string;
        companyName: string;
        positionTitle: string;
        status: string;
        updatedAt: string;
    }[];
}
