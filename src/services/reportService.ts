import { api } from '@/config/api';
import type { Insight, UserWithoutPassword } from '@/types';
import { storage } from '@/utils/storage';

export const reportService = {
    async getInsights(): Promise<Insight[]> {
        const response = await api.get<Insight[]>('/insights');
        return response.data;
    },

    async uploadPdf(file: File): Promise<Insight> {
        const user = storage.get<UserWithoutPassword>('user');
        const id = user!._id;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', id)

        const response = await api.post<Insight>('/insight/save', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    async deleteReport(id: string): Promise<void> {
        await api.delete(`/insights/${id}`);
    },
};