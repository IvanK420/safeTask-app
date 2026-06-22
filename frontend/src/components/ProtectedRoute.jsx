import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Si l'utilisateur n'est pas authentifié, redirection vers /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Sinon, affiche la page demandée
    return children;
};

export default ProtectedRoute;