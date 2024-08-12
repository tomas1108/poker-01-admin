export const saveStorageToken = (token: string) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("poker_access_token", JSON.stringify(token));
    }
}

export const getStorageToken = () => {
    if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem("poker_access_token");
        if (token) {
            try {
                return JSON.parse(token);
            } catch (e) {
                console.error('Failed to parse token from localStorage', e);
            }
        }
    }
    return null;
}

export const clearStorageToken = () => {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("poker_access_token");
    }
}
