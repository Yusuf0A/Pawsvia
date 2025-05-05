import React, { useEffect, useState } from 'react';
import './styles.css';

function App() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5050/api/pets')
      .then(res => res.json())
      .then(data => {
        setPets(data.animals || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <h1>Pawsvia 🐾</h1>
      {loading ? <p>Loading pets...</p> :
        pets.map(pet => (
          <div key={pet.id} className="animal-card">
            {pet.photos?.[0]?.medium && (
              <img
                src={pet.photos[0].medium}
                alt={pet.name}
                className="animal-photo"
              />
            )}
            <div className="animal-info">
              <h2>{pet.name}</h2>
              <p>{pet.description ? pet.description : 'No description available.'}</p>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default App;



