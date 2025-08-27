import React from 'react';

interface Photo {
  _id: string;
  url: string;
}

interface Nominee {
  _id: string;
  name: string;
  photos: Photo[];
}

interface NomineeCardProps {
  nominee: Nominee;
  isAdmin: boolean;
  onDeleteNominee: (id: string) => void;
  onDeletePhoto: (nomineeId: string, photoId: string) => void;
}

const NomineeCard: React.FC<NomineeCardProps> = ({ nominee, isAdmin, onDeleteNominee, onDeletePhoto }) => {
  return (
    <div className="nominee-card">
      <h3>{nominee.name}</h3>
      {isAdmin && (
        <button 
            className="admin-delete-btn"
            onClick={() => onDeleteNominee(nominee._id)}>
            Eliminar Auxiliar
        </button>
      )}
      <div className="photo-gallery">
        {nominee.photos.map((photo) => (
          <div key={photo._id} className="photo-item">
            <img src={photo.url} alt={`Foto de ${nominee.name}`} />
            {isAdmin && (
               <button 
                    className="photo-delete-btn"
                    onClick={() => onDeletePhoto(nominee._id, photo._id)}>
                    X
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NomineeCard;
