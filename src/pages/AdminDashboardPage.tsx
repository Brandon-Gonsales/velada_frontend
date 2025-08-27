import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import NomineeCard from '../components/NomineeCard';
import { useAuth } from '../context/AuthContext';

interface Photo {
  _id: string;
  url: string;
}

interface Nominee {
  _id: string;
  name: string;
  photos: Photo[];
}

const AdminDashboardPage: React.FC = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchNominees = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/nominees');
      setNominees(data);
    } catch (error) {
      console.error("Failed to fetch nominees", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNominees();
  }, [fetchNominees]);
  
  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleDeleteNominee = async (id: string) => {
    if(window.confirm('¿Estás seguro de que quieres eliminar a este auxiliar y todas sus fotos?')) {
        try {
            await api.delete(`/nominees/${id}`);
            fetchNominees();
        } catch (error) {
            console.error('Failed to delete nominee', error);
            alert('Error al eliminar el auxiliar.');
        }
    }
  };

  const handleDeletePhoto = async (nomineeId: string, photoId: string) => {
     if(window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
        try {
            await api.delete(`/nominees/${nomineeId}/photos/${photoId}`);
            fetchNominees();
        } catch (error) {
            console.error('Failed to delete photo', error);
            alert('Error al eliminar la foto.');
        }
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Panel de Administración</h1>
        <button onClick={handleLogout} className="btn">Cerrar Sesión</button>
      </header>

      <main>
        {loading ? (
          <p>Cargando nominados...</p>
        ) : (
          <div className="nominee-grid">
            {nominees.map((nominee) => (
              <NomineeCard
                key={nominee._id}
                nominee={nominee}
                isAdmin={true}
                onDeleteNominee={handleDeleteNominee}
                onDeletePhoto={handleDeletePhoto}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
