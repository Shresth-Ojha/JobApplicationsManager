export interface Application {
    id: string;
    userId: string;
    companyName: string;
    positionTitle: string;
    jobDescription?: string;
    jobUrl?: string;
    applicationDate: string; // ISO Date
    status: 'APPLIED' | 'SCREENING' | 'PHONE_INTERVIEW' | 'TECHNICAL_INTERVIEW' | 'ONSITE_INTERVIEW' | 'OFFER_RECEIVED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    locationCity?: string;
    locationCountry?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    notes?: string;
    reminderEnabled: boolean;
    reminderDays: number;
    lastReminderAck: string; // ISO Date
    createdAt: string;
    updatedAt: string;
}

export type CreateApplicationDTO = Omit<Application, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'applicationDate' | 'lastReminderAck' | 'reminderEnabled' | 'reminderDays'> & {
    applicationDate?: string;
    reminderEnabled?: boolean;
    reminderDays?: number;
};

export type UpdateApplicationDTO = Partial<CreateApplicationDTO>;
