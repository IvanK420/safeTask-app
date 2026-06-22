import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { logout } = useAuth();
    return (
        <main style={{ padding: '2rem' }}>
            <h2>Mon Espace de Travail Sécurisé (Dashboard)</h2>
            <p>Félicitations, vous êtes connecté ! Les données ici sont protégées.</p>
            <button onClick={logout} style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                Déconnexion
            </button>
        </main>
    );
};
export default Dashboard;