import { api } from '@/config/api';
import type { UserWithoutPassword } from '@/types';
import { storage } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';

export interface LoginResponse {
    token: string;
    user: UserWithoutPassword;
}

const authService = {
    async login(email: string, password: string): Promise<LoginResponse | null> {
        try {
            const response = await api.post<LoginResponse>('/auth/authenticate', {
                email,
                password
            });

            if (response.data.token) {
                storage.set<string>('token', response.data.token);
                storage.set<UserWithoutPassword>('user', response.data.user);
            }

            return response.data.token ? response.data : null;
        } catch (error) {
            console.error(error)
            return null;
        }
    },

    logout(): void {
        const navigate = useNavigate();
        navigate('/login');
        storage.remove('token')
        storage.remove('user')
    },

    getToken(): string | null {
        return storage.get<string>('token');
    },
};

export { authService };