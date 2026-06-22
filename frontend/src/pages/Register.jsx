import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

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
        <main style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
            <h2>Créer un compte SafeTask</h2>
            
            {message && (
                <div role="alert" style={{ color: isError ? 'red' : 'green', marginBottom: '1rem' }}>
                    {message}
                </div>
            )}

            {/* Structure sémantique conforme RGAA */}
            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email">Adresse e-mail :</label>
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

                {/* Case à cocher obligatoire de conformité RGPD */}
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
                    <input 
                        type="checkbox" 
                        id="rgpd" 
                        checked={rgpdConsent} 
                        onChange={(e) => setRgpdConsent(e.target.checked)}
                        aria-required="true"
                    />
                    <label htmlFor="rgpd" style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                        J'accepte que SafeTask stocke mes données d'identification conformément à la politique de confidentialité.
                    </label>
                </div>

                <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    S'inscrire
                </button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Déjà inscrit ? <Link to="/login">Connectez-vous ici</Link>
            </p>
        </main>
    );
};

export default Register;