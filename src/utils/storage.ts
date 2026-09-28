const prefix = '@bioinsight:';

const storage = {
    get<T>(key: string): T | null {
        const item = localStorage.getItem(`${prefix}${key}`);
        return item ? JSON.parse(item) : null;
    },

    set<T>(key: string, value: T): void {
        localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    },

    remove(key: string): void {
        localStorage.removeItem(`${prefix}${key}`);
    },

    clear(): void {
        localStorage.clear();
    },
};

export { storage };