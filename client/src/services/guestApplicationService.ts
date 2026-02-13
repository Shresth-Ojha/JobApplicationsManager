import type { Application, CreateApplicationDTO, UpdateApplicationDTO } from '@/types/application';

const STORAGE_KEY = 'guest-applications';

const generateId = () => `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getStoredApplications = (): Application[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveApplications = (applications: Application[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

// Migrate old guest applications that don't have reminder fields
const migrateGuestApplications = () => {
    const applications = getStoredApplications();
    if (applications.length === 0) return;

    let needsSave = false;

    for (const app of applications) {
        if (app.reminderEnabled === undefined) {
            app.reminderEnabled = true;
            needsSave = true;
        }
        if (app.reminderDays === undefined) {
            app.reminderDays = 7;
            needsSave = true;
        }
        if (!app.lastReminderAck) {
            app.lastReminderAck = app.updatedAt;
            needsSave = true;
        }
    }

    if (needsSave) {
        saveApplications(applications);
    }
};

// Run migration on module load
migrateGuestApplications();

export const guestApplicationService = {
    async getAll(): Promise<Application[]> {
        return getStoredApplications();
    },

    async getById(id: string): Promise<Application> {
        const applications = getStoredApplications();
        const app = applications.find(a => a.id === id);
        if (!app) throw new Error('Application not found');
        return app;
    },

    async create(data: CreateApplicationDTO): Promise<Application> {
        const applications = getStoredApplications();
        const now = new Date().toISOString();
        const newApp: Application = {
            id: generateId(),
            userId: 'guest',
            companyName: data.companyName,
            positionTitle: data.positionTitle,
            jobDescription: data.jobDescription,
            jobUrl: data.jobUrl,
            applicationDate: data.applicationDate || now,
            status: data.status || 'APPLIED',
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            salaryCurrency: data.salaryCurrency,
            locationCity: data.locationCity,
            locationCountry: data.locationCountry,
            priority: data.priority || 'MEDIUM',
            notes: data.notes,
            reminderEnabled: data.reminderEnabled !== undefined ? data.reminderEnabled : true,
            reminderDays: data.reminderDays || 7,
            lastReminderAck: now,
            createdAt: now,
            updatedAt: now,
        };
        applications.push(newApp);
        saveApplications(applications);
        return newApp;
    },

    async update(id: string, data: UpdateApplicationDTO): Promise<Application> {
        const applications = getStoredApplications();
        const index = applications.findIndex(a => a.id === id);
        if (index === -1) throw new Error('Application not found');

        const updatedApp = {
            ...applications[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        applications[index] = updatedApp;
        saveApplications(applications);
        return updatedApp;
    },

    async delete(id: string): Promise<void> {
        const applications = getStoredApplications();
        const filtered = applications.filter(a => a.id !== id);
        saveApplications(filtered);
    },
};
