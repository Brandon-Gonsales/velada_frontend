import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import NominationForm from '../components/NominationForm';
import NomineeCard from '../components/NomineeCard';
import WhatsAppButton from '../components/WhatsAppButton';

interface Photo {
  _id: string;
  url: string;
}

interface Nominee {
  _id: string;
  name: string;
  photos: Photo[];
}

const HomePage: React.FC = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <div className="container">
        <header>
          <h1>La Velada de los Auxis</h1>
          <p>¡Nomina a tu auxiliar favorito y prepárate para votar!</p>
        </header>

        <main>
          <NominationForm onNominationSuccess={fetchNominees} />

          <section>
            <h2>Nominados</h2>
            {loading ? (
              <p>Cargando nominados...</p>
            ) : (
              <div className="nominee-grid">
                {nominees.map((nominee) => (
                  <NomineeCard
                    key={nominee._id}
                    nominee={nominee}
                    isAdmin={false}
                    onDeleteNominee={() => {}}
                    onDeletePhoto={() => {}}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      <WhatsAppButton />
    </>
  );
};

export default HomePage;
