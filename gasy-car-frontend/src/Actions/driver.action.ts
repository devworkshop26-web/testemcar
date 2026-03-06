import axios from "axios";

export const getDrivers = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/drivers/`);
    return response.data;
};
