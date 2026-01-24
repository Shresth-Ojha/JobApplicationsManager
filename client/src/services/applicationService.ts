import api from '@/lib/api';
import type { Application, CreateApplicationDTO, UpdateApplicationDTO } from '@/types/application';
import { guestApplicationService } from './guestApplicationService';
import { useAuthStore } from '@/store/authStore';

const isGuestMode = () => useAuthStore.getState().isGuest;

export const applicationService = {
    async getAll(): Promise<Application[]> {
        if (isGuestMode()) return guestApplicationService.getAll();
        const response = await api.get<Application[]>('/applications');
        return response.data;
    },

    async getById(id: string): Promise<Application> {
        if (isGuestMode()) return guestApplicationService.getById(id);
        const response = await api.get<Application>(`/applications/${id}`);
        return response.data;
    },

    async create(data: CreateApplicationDTO): Promise<Application> {
        if (isGuestMode()) return guestApplicationService.create(data);
        const response = await api.post<Application>('/applications', data);
        return response.data;
    },

    async update(id: string, data: UpdateApplicationDTO): Promise<Application> {
        if (isGuestMode()) return guestApplicationService.update(id, data);
        const response = await api.put<Application>(`/applications/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        if (isGuestMode()) return guestApplicationService.delete(id);
        await api.delete(`/applications/${id}`);
    },
};

