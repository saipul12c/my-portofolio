import { useState, useEffect } from "react";

export const useSessionId = () => {
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const storedSessionId = localStorage.getItem("zodiakSessionId");
        if (storedSessionId) {
            setSessionId(storedSessionId);
        } else {
            const newSessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
            setSessionId(newSessionId);
            localStorage.setItem("zodiakSessionId", newSessionId);
        }
    }, []);

    return sessionId;
};