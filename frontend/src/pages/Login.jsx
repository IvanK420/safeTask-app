import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../index.css';

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
        <div className="auth-container">
            <main className="auth-card">
                <h2>Connexion à SafeTask</h2>
                
                {error && <div role="alert" className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            placeholder="votre.email@adresse.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit">Se connecter</button>
                </form>

                <p>
                    Pas encore de compte ? <Link to="/register">Créez un compte</Link>
                </p>
            </main>
        </div>
    );
};

export default Login;