import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import '../index.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rgpdConsent, setRgpdConsent] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Validation défensive côté client
        if (!rgpdConsent) {
            setIsError(true);
            setMessage('Vous devez accepter la politique de confidentialité.');
            return;
        }

        try {
            await API.post('/auth/register', { email, password });
            setIsError(false);
            setMessage('Inscription réussie ! Redirection...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.error || 'Une erreur est survenue.');
        }
    };

    return (
        <div className="auth-container">
            <main className="auth-card">
                <h2>Créer un compte SafeTask</h2>
                
                {message && (
                    <div role="alert" className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
                        {message}
                    </div>
                )}

                {/* Structure sémantique conforme RGAA */}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Adresse e-mail</label>
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

                    {/* Case à cocher obligatoire de conformité RGPD */}
                    <div className="checkbox-group">
                        <input 
                            type="checkbox" 
                            id="rgpd" 
                            checked={rgpdConsent} 
                            onChange={(e) => setRgpdConsent(e.target.checked)}
                            aria-required="true"
                        />
                        <label htmlFor="rgpd">
                            J'accepte que SafeTask stocke mes données d'identification conformément à la politique de confidentialité.
                        </label>
                    </div>

                    <button type="submit">S'inscrire</button>
                </form>

                <p>
                    Déjà inscrit ? <Link to="/login">Connectez-vous ici</Link>
                </p>
            </main>
        </div>
    );
};

export default Register;