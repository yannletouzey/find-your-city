import { useRef, useEffect, useState } from 'react';
import { indexWeather } from './nomenclature';
import { Map } from './Map';
import { Legend } from './Legend';
import { popData } from './popData';
import { departementsRegion } from '../departements-region';

function App() {
  const KEY_API_WEATHER = import.meta.env.VITE_KEY_API_WEATHER;

  const [search, setSearch] = useState('');
  const [dataApi, setDataApi] = useState([]);
  const [dataWeather, setDataWeather] = useState([]);
  const [limit, setLimit] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapRef = useRef();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value, 10));
  };

  const getData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(search)}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des villes');
      const data = await response.json();
      setDataApi(data.slice(0, limit));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const getDataWeather = async (code, nameCity, codeDepartement, postalCode, pop) => {
    try {
      const response = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${KEY_API_WEATHER}&insee=${code}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de la météo');
      const data = await response.json();      
      return { nom: nameCity, code, forecast: data.forecast, codeDepartement, postalCode, pop };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await getData();
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (dataApi.length === 0) return;
      setLoading(true);
      setDataWeather([]);
      try {
        const weatherPromises = dataApi.map((item) =>
          getDataWeather(item.code, item.nom, item.codeDepartement, item.codesPostaux, item.population)
        );
        const weatherResults = await Promise.all(weatherPromises);
        const filteredResults = weatherResults.filter((item) => item !== null);
        setDataWeather(filteredResults);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération de la météo.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [dataApi]);

  const renderWeather = (weatherCode) => {
    const weatherInfo = indexWeather.find((item) => item[0] === weatherCode);
    if (weatherInfo) {
      return `${weatherInfo[1]} ${weatherInfo[2]}`;
    }
    return 'Non disponible';
  };

  const getWeatherGradient = (weatherCode) => {
    const weatherInfo = indexWeather.find((item) => item[0] === weatherCode);
    if (weatherInfo && weatherInfo[3]) {
      const [color1, color2] = weatherInfo[3];
      return `linear-gradient(135deg, ${color1}, ${color2})`;
    }
    return 'linear-gradient(135deg, #E0E0E0, #B0BEC5)';
  };


  useEffect(() => {
    if (!mapRef.current) return;
    const paths = mapRef.current.querySelectorAll('path');

    paths.forEach((path) => {
      path.style.fill = 'white';
      const matchingDepartement = popData.find((item) => {
        let newId = item.code_departement;
        if (newId === '2A') newId = 20;
        else if (newId === '2B') newId = 21;
        else if (parseInt(newId) >= 21) newId = parseInt(newId) + 1;
        return parseInt(newId) === parseInt(path.id);
      });

      if (matchingDepartement) {
        const pop = matchingDepartement.population;
        if (pop < 500000) path.style.fill = 'lightgreen';
        if (pop > 500000) path.style.fill = 'yellow';
        if (pop > 1000000) path.style.fill = 'orange';
        if (pop > 1500000) path.style.fill = 'pink';
        if (pop > 2000000) path.style.fill = 'red';
      }

      const matchingSearch = dataApi.some((city) => city.codeDepartement === matchingDepartement?.code_departement);
      if (matchingSearch) {
        path.style.fill = 'black';
      }
    });
  }, [dataApi]);

  function formatNumber(value) {
    if (isNaN(value)) return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Trouve ta ville</h1>

      <div className="map-container">
        <Map mapRef={mapRef} />
        <Legend />
      </div>

      <div>
        <label htmlFor="limit">Limite de résultats : </label>
        <select onChange={handleLimit} value={limit}>
          <option value={1}>1 résultat</option>
          <option value={2}>2 résultats</option>
          <option value={5}>5 résultats</option>
          <option value={10}>10 résultats</option>
          <option value={1000}>Tous les résultats</option>
        </select>

        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <input
            type="search"
            id="search"
            value={search}
            onChange={handleChange}
            placeholder="Rechercher une commune"
          />
          <button type="submit" className="submit" style={{ marginLeft: '1rem' }}>
            Lancer une recherche
          </button>
        </form>

        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: 'lightcoral' }}>{error}</p>}

        {dataWeather.length > 0 && dataWeather.map((item, id) => {
          const weatherCode = item.forecast[0]?.weather;
          const gradient = getWeatherGradient(weatherCode);
          const weatherLabel = renderWeather(weatherCode);
          const departement = departementsRegion.find((dep) => dep.num_dep == item.codeDepartement);
          const popDepartement = popData.find((pop) => pop.code_departement === item.codeDepartement);
          
          return (
            <ul
              key={id}
              className="card"
              style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: '1rem',
                color: 'white',
                background: gradient,
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'background 0.5s ease'
              }}
            >
              <li>🏙️ Nom : <b>{item.nom}</b></li>
              <li>📍 Département : <b>{item.codeDepartement}</b> - <b>{departement.dep_name}</b></li>
              <li>🌐 Région : <b>{departement.region_name}</b></li>
              <li className="postals">
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', listStyle: 'none', padding: 0 }}>
                  <li className="postals-text">{item.postalCode.length > 1 ? '📭 Codes postaux : ' : '📭 Code postal : '}</li>
                  {item.postalCode.map((cp, index) => (
                    <li key={index}><b>{cp}</b>{index < item.postalCode.length - 1 && <span>,</span>}</li>
                  ))}
                </ul>
              </li>
              <li>🆔 Code INSEE : <b>{item.code}</b></li>
              <li>🌍 Coordonnées :
                <ul className='coord'>
                  <li>Latitude : <b>{item.forecast[0].latitude}</b></li>
                  <li>Longitude : <b>{item.forecast[0].longitude}</b></li>
                </ul>
              </li>
              <li>👤 Population : 
                <ul className='pop'>
                  <li>de la ville <b>{formatNumber(item.pop)}</b> {item.pop > 1 ? 'habitants' : 'habitant'}</li>
                  <li>du département : <b>{formatNumber(popDepartement.population)}</b> {popDepartement.population > 1 ? 'habitants' : 'habitant'}</li>
                </ul>
              </li>
              <li>🌡️ Température :
                <ul className='temp'>
                  <li>min {item.forecast[0]?.tmin}°C</li>
                  <li>max {item.forecast[0]?.tmax}°C</li>
                </ul>
              </li>
              <li>🌦️ Temps : {weatherLabel}</li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}

export default App;
