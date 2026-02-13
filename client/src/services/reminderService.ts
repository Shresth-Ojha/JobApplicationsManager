import api from '@/lib/api';
import type { Application } from '@/types/application';
import { useAuthStore } from '@/store/authStore';

const isGuestMode = () => useAuthStore.getState().isGuest;

export interface DueReminder {
    id: string;
    companyName: string;
    positionTitle: string;
    status: string;
    reminderDays: number;
    lastReminderAck: string;
    updatedAt: string;
}

// Guest mode: compute due reminders from localStorage
const getGuestDueReminders = (): DueReminder[] => {
    const data = localStorage.getItem('guest-applications');
    if (!data) return [];

    const applications: Application[] = JSON.parse(data);
    const now = new Date();

    return applications.filter((app) => {
        if (!app.reminderEnabled) return false;
        if (app.status === 'REJECTED' || app.status === 'WITHDRAWN') return false;

        const dueDate = new Date(app.lastReminderAck);
        dueDate.setDate(dueDate.getDate() + app.reminderDays);
        return now >= dueDate;
    }).map((app) => ({
        id: app.id,
        companyName: app.companyName,
        positionTitle: app.positionTitle,
        status: app.status,
        reminderDays: app.reminderDays,
        lastReminderAck: app.lastReminderAck,
        updatedAt: app.updatedAt,
    }));
};

const acknowledgeGuestReminder = (id: string): void => {
    const data = localStorage.getItem('guest-applications');
    if (!data) return;

    const applications: Application[] = JSON.parse(data);
    const index = applications.findIndex((a) => a.id === id);
    if (index === -1) return;

    applications[index].lastReminderAck = new Date().toISOString();
    localStorage.setItem('guest-applications', JSON.stringify(applications));
};

export const reminderService = {
    async getDueReminders(): Promise<DueReminder[]> {
        if (isGuestMode()) return getGuestDueReminders();
        const response = await api.get<DueReminder[]>('/reminders');
        return response.data;
    },

    async acknowledgeReminder(id: string): Promise<void> {
        if (isGuestMode()) {
            acknowledgeGuestReminder(id);
            return;
        }
        await api.post(`/reminders/${id}/acknowledge`);
    },
};
