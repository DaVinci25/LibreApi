import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuración de iconos
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GymIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const UserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Tipos de datos
interface Gym {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name: string;
    website?: string;
  };
}

interface Province {
  codigo: string;
  nombre: string;
  capital: string;
  poblacion: number;
  superficie: number;
  comunidad: string;
  bounds: [[number, number], [number, number]];
}

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
}

function App() {
  const [position, setPosition] = useState<[number, number]>([40.4168, -3.7038]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState({ provinces: false, gyms: false });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('28'); // Madrid
  const [currentProvince, setCurrentProvince] = useState<Province | null>(null);

  // 1. Obtener datos de provincias de datos.gob.es
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(prev => ({ ...prev, provinces: true }));
      try {
        // API de datos.gob.es para información territorial
        const response = await fetch('https://datos.gob.es/apidata/catalog/dataset?q=provincias&sort=title');
        const datasets = await response.json();
        
        // Buscar el dataset específico de provincias
        const provinceDataset = datasets.result.items.find(
          (item: any) => item.title.includes('Provincias')
        );

        if (provinceDataset) {
          const dataResponse = await fetch(provinceDataset.link);
          const provincesData = await dataResponse.json();
          
          // Mapear datos y añadir coordenadas aproximadas
          const formattedProvinces = provincesData.map((prov: any) => ({
            codigo: prov.codigo,
            nombre: prov.nombre,
            capital: prov.capital || 'Desconocida',
            poblacion: prov.poblacion || 0,
            superficie: prov.superficie || 0,
            comunidad: prov.comunidad || 'Desconocida',
            bounds: getProvinceBounds(prov.codigo)
          }));

          setProvinces(formattedProvinces);
          setCurrentProvince(formattedProvinces.find((p: any) => p.codigo === selectedProvince) || null);
        }
      } catch (error) {
        console.error("Error cargando provincias:", error);
        // Usar datos de fallback si la API falla
        setProvinces(fallbackProvinces);
        setCurrentProvince(fallbackProvinces.find(p => p.codigo === selectedProvince) || null);
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, []);

  // 2. Buscar gimnasios via Overpass API
  const searchGyms = async () => {
    if (!currentProvince) return;
    
    setLoading(prev => ({ ...prev, gyms: true }));
    try {
      const [southWest, northEast] = currentProvince.bounds;
      const query = `
        [out:json];
        (
          node["leisure"="sports_centre"](${southWest[0]},${southWest[1]},${northEast[0]},${northEast[1]});
          way["leisure"="sports_centre"](${southWest[0]},${southWest[1]},${northEast[0]},${northEast[1]});
        );
        out center;
      `;
      
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      
      const data = await response.json();
      
      setGyms(data.elements.map((element: any) => ({
        id: element.id,
        lat: element.lat || element.center.lat,
        lon: element.lon || element.center.lon,
        tags: element.tags || {}
      })));
    } catch (error) {
      console.error("Error buscando gimnasios:", error);
    } finally {
      setLoading(prev => ({ ...prev, gyms: false }));
    }
  };

  // 3. Actualizar provincia seleccionada
  useEffect(() => {
    if (provinces.length > 0) {
      const province = provinces.find(p => p.codigo === selectedProvince);
      if (province) {
        setCurrentProvince(province);
        const [[lat1, lon1], [lat2, lon2]] = province.bounds;
        setPosition([(lat1 + lat2) / 2, (lon1 + lon2) / 2]);
      }
    }
  }, [selectedProvince, provinces]);

  return (
    <div className="app-container">
      <h1>Gimnasios en España</h1>
      
      <div className="info-panel">
        {loading.provinces ? (
          <p>Cargando datos de provincias...</p>
        ) : currentProvince ? (
          <div className="province-info">
            <h2>{currentProvince.nombre}</h2>
            <div className="province-details">
              <p><strong>Capital:</strong> {currentProvince.capital}</p>
              <p><strong>Población:</strong> {currentProvince.poblacion.toLocaleString()} hab.</p>
              <p><strong>Superficie:</strong> {currentProvince.superficie} km²</p>
              <p><strong>Comunidad:</strong> {currentProvince.comunidad}</p>
            </div>
          </div>
        ) : (
          <p>No se encontraron datos de la provincia</p>
        )}
        
        <div className="controls">
          <div className="province-select">
            <label htmlFor="province">Provincia:</label>
            <select
              id="province"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              disabled={loading.provinces}
            >
              {provinces.map(province => (
                <option key={province.codigo} value={province.codigo}>
                  {province.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={searchGyms}
            disabled={loading.gyms || !currentProvince}
            className="search-button"
          >
            {loading.gyms ? 'Buscando...' : 'Buscar Gimnasios'}
          </button>
        </div>
      </div>
      
      <div className="map-container">
        <MapContainer 
          center={position} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={position} icon={UserIcon}>
            <Popup>Centro de {currentProvince?.nombre || 'España'}</Popup>
          </Marker>
          
          {gyms.map(gym => (
            <Marker 
              key={`gym-${gym.id}`}
              position={[gym.lat, gym.lon]}
              icon={GymIcon}
            >
              <Popup>
                <div className="gym-popup">
                  <h3>{gym.tags.name || 'Gimnasio'}</h3>
                  {gym.tags.website && (
                    <p>
                      <strong>Web:</strong>{' '}
                      <a href={gym.tags.website} target="_blank" rel="noreferrer">
                        {gym.tags.website}
                      </a>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapUpdater position={position} />
        </MapContainer>
      </div>
    </div>
  );
}

// Función auxiliar para coordenadas aproximadas
function getProvinceBounds(code: string): [[number, number], [number, number]] {
  const bounds: Record<string, [[number, number], [number, number]]> = {
    '28': [[40.35, -3.9], [40.55, -3.6]], // Madrid
    '08': [[41.3, 2.0], [41.5, 2.3]],     // Barcelona
    '46': [[39.4, -0.4], [39.5, -0.3]],   // Valencia
    '41': [[37.2, -6.2], [37.6, -5.8]],   // Sevilla
    '50': [[41.5, -1.2], [42.0, -0.7]],   // Zaragoza
    '03': [[38.2, -0.9], [38.8, -0.1]],   // Alicante
    '29': [[36.6, -4.6], [36.9, -4.3]],   // Málaga
    '48': [[43.1, -3.1], [43.4, -2.8]],   // Vizcaya
    '26': [[42.2, -2.6], [42.5, -2.3]],   // La Rioja
    '33': [[43.2, -6.1], [43.6, -5.5]],   // Asturias
    '35': [[27.8, -15.8], [29.3, -13.3]], // Las Palmas
    '38': [[28.0, -17.9], [28.5, -16.1]]  // Santa Cruz de Tenerife
  };
  return bounds[code] || [[40.0, -4.0], [41.0, -3.0]]; // Default para provincias no mapeadas
}

// Datos de fallback (si la API no está disponible)
const fallbackProvinces: Province[] = [
  {
    codigo: '28',
    nombre: 'Madrid',
    capital: 'Madrid',
    poblacion: 6663394,
    superficie: 8028,
    comunidad: 'Comunidad de Madrid',
    bounds: [[40.35, -3.9], [40.55, -3.6]]
  },
  {
    codigo: '08',
    nombre: 'Barcelona',
    capital: 'Barcelona',
    poblacion: 5620285,
    superficie: 7723,
    comunidad: 'Cataluña',
    bounds: [[41.3, 2.0], [41.5, 2.3]]
  },
];

export default App;