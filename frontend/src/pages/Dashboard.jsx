import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Dashboard = () => {
    const { logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    // 1. Charger les tâches à l'affichage de la page
    const fetchTasks = async () => {
        try {
            const response = await API.get('/tasks');
            setTasks(response.data);
        } catch (err) {
            setError('Impossible de récupérer vos tâches.');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // 2. Soumission du formulaire de création
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!title) return;

        try {
            await API.post('/tasks', { title, description });
            setTitle('');
            setDescription('');
            fetchTasks(); // Recharge la liste
        } catch (err) {
            setError('Erreur lors de la création de la tâche.');
        }
    };

    // 3. Changement de statut rapide (Bouton d'action métier)
    const handleToggleStatus = async (task) => {
        const nextStatus = task.status === 'A faire' ? 'En cours' : task.status === 'En cours' ? 'Terminé' : 'A faire';
        try {
            await API.put(`/tasks/${task.id}`, { ...task, status: nextStatus });
            fetchTasks();
        } catch (err) {
            setError('Erreur lors de la modification du statut.');
        }
    };

    // 4. Suppression
    const handleDeleteTask = async (id) => {
        try {
            await API.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            setError('Erreur lors de la suppression.');
        }
    };

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Mon Tableau de Bord SafeTask</h2>
                <button onClick={logout} style={{ backgroundColor: '#dc3545', color: 'white', padding: '0.5rem', border: 'none', cursor: 'pointer' }}>
                    Déconnexion
                </button>
            </header>

            {error && <div role="alert" style={{ color: 'red', margin: '1rem 0' }}>{error}</div>}

            {/* Formulaire de création (Accessibilité RGAA) */}
            <section style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '5px', marginTop: '1rem' }}>
                <h3>Ajouter une tâche</h3>
                <form onSubmit={handleCreateTask}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label htmlFor="taskTitle">Titre : </label>
                        <input id="taskTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label htmlFor="taskDesc">Description : </label>
                        <textarea id="taskDesc" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                        Enregistrer
                    </button>
                </form>
            </section>

            {/* Liste des composants métier Tâches */}
            <section style={{ marginTop: '2rem' }}>
                <h3>Mes tâches en cours</h3>
                {tasks.length === 0 ? <p>Aucune tâche pour le moment.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {tasks.map(task => (
                            <li key={task.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>
                                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', background: task.status === 'Terminé' ? '#d4edda' : task.status === 'En cours' ? '#fff3cd' : '#e2e3e5' }}>
                                        {task.status}
                                    </span>
                                </div>
                                <div>
                                    <button onClick={() => handleToggleStatus(task)} style={{ marginRight: '0.5rem', cursor: 'pointer' }}>
                                        Changer statut
                                    </button>
                                    <button onClick={() => handleDeleteTask(task.id)} style={{ backgroundColor: '#ffc107', border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                                        Supprimer
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
};

export default Dashboard;