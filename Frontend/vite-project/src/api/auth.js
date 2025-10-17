const API_URL = 'http://localhost:8080';

export const signup = async (userData) => {
    const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'},
            body: JSON.stringify(userData),
        });
        return res.json();
    };

export const login = async (credentials) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials),
    });
    return res.json();
};