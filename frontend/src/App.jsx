import { useState, useEffect } from 'react';
import API from './api/axios';

function App() {
  const [serverStatus, setServerStatus] = useState('Connexion au serveur en cours...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Appel de la route "health" du backend dès le chargement du composant
    API.get('/health')
      .then((response) => {
        setServerStatus(response.data.message);
        setIsError(false);
      })
      .catch((error) => {
        console.error('Erreur réseau :', error);
        setServerStatus('Impossible de joindre le serveur de l\'application.');
        setIsError(true);
      });
  }, []);

  return (
    // Balise sémantique <main> indispensable pour la validation du critère d'accessibilité RGAA
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <header>
        <h1>SafeTask </h1>
        <h2>Espace de Travail Client</h2>
      </header>
      
      <section style={{ marginTop: '2rem', padding: '1rem', borderRadius: '8px', backgroundColor: isError ? '#ffe3e3' : '#e3ffed' }}>
        <h2>Vérification de l'environnement</h2>
        <p>Statut du système : <strong style={{ color: isError ? '#d32f2f' : '#2e7d32' }}>{serverStatus}</strong></p>
      </section>
    </main>
  );
}

export default App;