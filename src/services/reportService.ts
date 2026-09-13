import { api } from '@/config/api';
import type { Insight } from '@/types';

export const reportService = {
    async getInsights(): Promise<Insight[]> {
        const response = await api.get<Insight[]>('/insights');
        return response.data;
    },

    async uploadPdf(file: File): Promise<Insight> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<Insight>('/insights/upload', formData, {
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