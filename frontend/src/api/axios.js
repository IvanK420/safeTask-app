import axios from 'axios';

// Configuration d'une instance réutilisable
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // URL de votre backend Express
    timeout: 5000, // Coupe la requête si le serveur ne répond pas après 5s (Sécurité)
    headers: {
        'Content-Type': 'application/json'
    }
});

export default API;