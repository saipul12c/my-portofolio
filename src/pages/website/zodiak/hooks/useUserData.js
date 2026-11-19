import { useState, useEffect } from "react";

export const useUserData = (sessionId) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!sessionId) return;
        const storedUserData = localStorage.getItem(`zodiakUserData_${sessionId}`);
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                if (parsedData && parsedData.nama && parsedData.zodiak) {
                    setUserData(parsedData);
                }
            } catch (error) {
                console.error("Error parsing stored user data:", error);
            }
        }
    }, [sessionId]);

    return [userData, setUserData];
};