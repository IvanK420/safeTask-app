import { useEffect } from 'react';

const statusLabels = { 'A faire': 'todo', 'En cours': 'progress', 'Terminé': 'done' };

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso));
};

const TaskModal = ({ task, onClose, onToggleStatus, onDelete, ownerName }) => {
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    if (!task) return null;

    const handleDelete = () => {
        onDelete(task.id);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Détails de la tâche">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{task.title}</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
                </div>

                <div className="modal-body">
                    <div className="modal-field">
                        <span className="modal-label">Statut</span>
                        <button
                            className={`badge ${statusLabels[task.status] || 'todo'}`}
                            onClick={() => onToggleStatus(task)}
                            title="Cliquer pour changer le statut"
                        >
                            {task.status}
                        </button>
                    </div>

                    <div className="modal-field">
                        <span className="modal-label">Description</span>
                        <p className="modal-value">
                            {task.description || <span className="modal-empty">Aucune description</span>}
                        </p>
                    </div>

                    <div className="modal-field">
                        <span className="modal-label">Propriétaire</span>
                        <span className="owner">{ownerName}</span>
                    </div>

                    <div className="modal-dates">
                        <div className="modal-date-item">
                            <span className="modal-label">Créée le</span>
                            <span className="modal-value-sm">{formatDate(task.createdAt)}</span>
                        </div>
                        <div className="modal-date-item">
                            <span className="modal-label">Modifiée le</span>
                            <span className="modal-value-sm">{formatDate(task.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="modal-btn-danger" onClick={handleDelete}>Supprimer</button>
                    <button className="modal-btn-secondary" onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
