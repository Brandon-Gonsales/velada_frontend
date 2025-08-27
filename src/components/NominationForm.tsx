import React, { useState } from 'react';
import api from '../services/api';

interface NominationFormProps {
  onNominationSuccess: () => void;
}

const NominationForm: React.FC<NominationFormProps> = ({ onNominationSuccess }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      setError('Por favor, completa el nombre y sube una foto.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      const response = await api.post('/nominees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setSuccess(`¡Foto añadida a ${name} exitosamente! Gracias por tu aporte.`);
      } else {
        setSuccess(`¡${name} ha sido postulado exitosamente!`);
      }
      
      setName('');
      setImage(null);
      (document.getElementById('image-input') as HTMLInputElement).value = '';
      onNominationSuccess();
    } catch (err) {
      setError('Hubo un error al postular. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Postula a tu Auxiliar</h2>
      <p>Completa el formulario para nominar a tu auxiliar favorito para la velada.</p>
      <br/>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="form-group">
          <label htmlFor="name">Nombre del Auxiliar</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Ej: Juan Pérez'
          />
        </div>
        <div className="form-group">
          <label htmlFor="image-input">Foto del Auxiliar</label>
          <input
            type="file"
            id="image-input"
            className="form-control"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            accept="image/png, image/jpeg, image/jpg"
            required
          />
           <small>No se permite contenido pornográfico o explícito.</small>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Postulando...' : 'Postular'}
        </button>
      </form>
    </div>
  );
};

export default NominationForm;
