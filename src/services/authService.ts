import { api } from '@/config/api';
import type { User } from '@/types';

export interface LoginResponse {
    token: string;
    user: Omit<User, 'password'>;
}

const authService = {
    async login(email: string, password: string): Promise<LoginResponse | null> {
        try {
            const response = await api.post<LoginResponse>('/auth/authenticate', {
                email,
                password
            });
            
            return response.data.token ? response.data : null;
        } catch (error) {
            console.error(error)
            return null;
        }
    },

    logout(): void {
        window.location.href = '/login';
    },

    getToken(): string | null {
        return 'token';
    },
};

export { authService };