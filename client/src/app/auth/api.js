export const login = async (data) => {
    return await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(data)
    });
}

export const register = async (data) => {
    return await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(data)
    });
}