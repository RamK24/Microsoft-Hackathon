// import axios from 'axios';
// import { API_URL } from '../../config';

// Mock delay helper (optional)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Signin
export const signin = async (data) => {
    // Commented out real API call
    /*
    return axios.post(`${API_URL}/auth/signin`, data)
        .then((res: { data: any; }) => {
            return res.data;
        })
        .catch((e: { response: { data: any; }; }) => {
            return e.response.data;
        });
    */

    // Mock success response
    await delay(300); // simulate network delay
    return {
        success: true,
        token: 'Fake-jwt-token',
        user: {
            id: 1,
            email: data.email,
            name: 'Fake User'
        }
    };
};

// Get Profile
export const getProfile = async (token) => {
    /*
    return axios.get(`${API_URL}/auth/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then((res: { data: any; }) => {
        return res.data;
    })
    .catch((e: { response: { data: any; }; }) => {
        return e.response.data;
    });
    */

    await delay(300);
    return {
        success: true,
        id: 1,
        name: 'Fake User',
        email: 'faked@name.com'
    };
};

// Signup
export const signup = async (data) => {
    /*
    return axios.post(`${API_URL}/auth/register`, data)
        .then((res: { data: any; }) => {
            return res.data;
        })
        .catch((e: { response: { data: any; }; }) => {
            return e.response.data;
        });
    */

    await delay(300);
    return {
        success: true,
        message: 'Registration successful (mock)',
        user: {
            id: 2,
            name: data.name,
            email: data.email
        }
    };
};
