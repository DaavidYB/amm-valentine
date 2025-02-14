const API_URL = import.meta.env.VERCEL_URL;

export const submitQuiz = async (name: string, answers: number[]): Promise<{ userId: string }> => {
    const response = await fetch(`${API_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, answers }),
    });
    return response.json();
};

export const getMatch = async (userId: string, mode: "love" | "anti-love"): Promise<{ match: { name: string, compatibility: string } | null }> => {
    const response = await fetch(`${API_URL}/api/match/${userId}/${mode}`);
    return response.json();
};

// export const fetchSongs = async (mode: "love" | "anti-love") => {
//     const response = await fetch(`${API_URL}/api/playlist/${mode}`);
//     return response.json();
// };
export const fetchSongs = async (mode: "love" | "anti-love", userId: string) => {
    const response = await fetch(`${API_URL}/api/playlist/${mode}?userId=${userId}`);
    return response.json();
};

export const addSong = async (title: string, artist: string, url: string, userId: string, mode: "love" | "anti-love") => {
    const response = await fetch(`${API_URL}/api/playlist/${mode}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, url, userId }),
    });
    return response.json();
};


export const toggleLikeSong = async (songId: string, userId: string, mode: "love" | "anti-love") => {
    const response = await fetch(`${API_URL}/api/playlist/${mode}/like/${songId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    return response.json();
};
  
export const createPlaylistUser = async (): Promise<string> => {
    const response = await fetch(`${API_URL}/api/playlist/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    // console.log("Réponse de l'API:", data);  // Vérifie que l'ID est bien là

    return data.userId; // 🔥 Retourne directement l'ID !
};

export const searchSongs = async (query: string) => {
    const response = await fetch(`${API_URL}/api/playlist/search/${query}`);
    return response.json();
};

// Récupérer tous les messages
export const fetchMessages = async (): Promise<{ _id: string, content: string }[]> => {
    const response = await fetch(`${API_URL}/api/message`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
    }

    return response.json();
};

// Ajouter un message
export const addMessage = async (content: string): Promise<{ _id: string, content: string }> => {
    const response = await fetch(`${API_URL}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du message');
    }

    return response.json();
};