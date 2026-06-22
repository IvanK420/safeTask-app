import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API.post('/auth/login', { email, password });
            login(response.data.token); // Stocke le token et connecte l'utilisateur
            navigate('/dashboard'); // Redirection vers l'espace sécurisé
        } catch (err) {
            setError(err.response?.data?.error || 'Identifiants invalides.');
        }
    };

    return (
        <main style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
            <h2>Connexion à SafeTask</h2>
            
            {error && <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email">Email :</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password">Mot de passe :</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Se connecter
                </button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Pas encore de compte ? <Link to="/register">Créez un compte</Link>
            </p>
        </main>
    );
};

export default Login;