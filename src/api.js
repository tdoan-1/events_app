const API_URL = "http://localhost:5000/api/conference";
// location of backend

export const getConferences = async () => {
    try {
        /*  this line connects frontend and backend
            by calling backend API to get conference data
        */
        const response = await fetch(`${API_URL}/list`);

        // converts API response to JSON format
        return await response.json(); 
    } catch (error) {
        console.error("Error fetching conferences:", error);
        return []; // return empty array if error
    }
};
