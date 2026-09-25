import { api } from "@/config/api"

export interface RegisterResponse { 
    message: string
}

const registerService = {
    async register(email: string, password: string): Promise<RegisterResponse | null> {
        try {
            const response = await api.post<RegisterResponse>('/auth/register', { 
                email,
                password
            })

            return response.data.message ? response.data : null;
        } catch (error) {
            console.error(error)
            return null;
        }
    }
}

export { registerService }