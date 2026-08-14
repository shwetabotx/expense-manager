import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});


// Get profile
export const getProfile = (token) => {
    return API.get("/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


// Update profile
export const updateProfile = (profileData, token) => {
    return API.put(
        "/profile",
        profileData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};