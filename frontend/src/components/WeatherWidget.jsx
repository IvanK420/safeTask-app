import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// WMO Weather Codes Translation and SVG Icons
const WEATHER_CODES = {
    0: { label: 'Ciel dégagé', icon: 'sun', bg: 'linear-gradient(135deg, #FF9900 0%, #FF5E62 100%)' },
    1: { label: 'Principalement dégagé', icon: 'cloud-sun', bg: 'linear-gradient(135deg, #FF9900 0%, #FF5E62 100%)' },
    2: { label: 'Partiellement nuageux', icon: 'cloud-sun', bg: 'linear-gradient(135deg, #5D9CEC 0%, #50C878 100%)' },
    3: { label: 'Couvert', icon: 'cloud', bg: 'linear-gradient(135deg, #657786 0%, #4B5563 100%)' },
    45: { label: 'Brouillard', icon: 'mist', bg: 'linear-gradient(135deg, #8E9EAB 0%, #EEF2F3 100%)' },
    48: { label: 'Brouillard givrant', icon: 'mist', bg: 'linear-gradient(135deg, #8E9EAB 0%, #EEF2F3 100%)' },
    51: { label: 'Bruine légère', icon: 'rain-light', bg: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)' },
    53: { label: 'Bruine modérée', icon: 'rain', bg: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)' },
    55: { label: 'Bruine dense', icon: 'rain', bg: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)' },
    56: { label: 'Bruine verglaçante légère', icon: 'rain-snow', bg: 'linear-gradient(135deg, #70a1ff 0%, #2f3542 100%)' },
    57: { label: 'Bruine verglaçante dense', icon: 'rain-snow', bg: 'linear-gradient(135deg, #70a1ff 0%, #2f3542 100%)' },
    61: { label: 'Pluie faible', icon: 'rain-light', bg: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)' },
    63: { label: 'Pluie modérée', icon: 'rain', bg: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)' },
    65: { label: 'Pluie forte', icon: 'rain-heavy', bg: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)' },
    66: { label: 'Pluie verglaçante légère', icon: 'rain-snow', bg: 'linear-gradient(135deg, #70a1ff 0%, #2f3542 100%)' },
    67: { label: 'Pluie verglaçante forte', icon: 'rain-snow', bg: 'linear-gradient(135deg, #70a1ff 0%, #2f3542 100%)' },
    71: { label: 'Chute de neige légère', icon: 'snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
    73: { label: 'Chute de neige modérée', icon: 'snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
    75: { label: 'Chute de neige forte', icon: 'snow-heavy', bg: 'linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)' },
    77: { label: 'Grains de neige', icon: 'snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
    80: { label: 'Averses de pluie faibles', icon: 'rain-light', bg: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)' },
    81: { label: 'Averses de pluie modérées', icon: 'rain', bg: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)' },
    82: { label: 'Averses de pluie violentes', icon: 'rain-heavy', bg: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)' },
    85: { label: 'Averses de neige faibles', icon: 'snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
    86: { label: 'Averses de neige fortes', icon: 'snow-heavy', bg: 'linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)' },
    95: { label: 'Orage faible ou modéré', icon: 'thunderstorm', bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%, #2c5364 100%)' },
    96: { label: 'Orage avec grêle faible', icon: 'thunderstorm', bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%, #2c5364 100%)' },
    99: { label: 'Orage avec grêle forte', icon: 'thunderstorm', bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%, #2c5364 100%)' },
};

const DEFAULT_WEATHER = { label: 'Temps variable', icon: 'cloud', bg: 'linear-gradient(135deg, #657786 0%, #4B5563 100%)' };

const WeatherIcon = ({ name }) => {
    switch (name) {
        case 'sun':
            return (
                <svg className="weather-svg sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" fill="rgba(255, 235, 59, 0.2)" stroke="#FFD700" />
                    <line x1="12" y1="2" x2="12" y2="4" stroke="#FF9900" />
                    <line x1="12" y1="20" x2="12" y2="22" stroke="#FF9900" />
                    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" stroke="#FF9900" />
                    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" stroke="#FF9900" />
                    <line x1="2" y1="12" x2="4" y2="12" stroke="#FF9900" />
                    <line x1="20" y1="12" x2="22" y2="12" stroke="#FF9900" />
                    <line x1="6.34" y1="17.66" x2="4.93" y2="19.07" stroke="#FF9900" />
                    <line x1="19.07" y1="4.93" x2="17.66" y2="6.34" stroke="#FF9900" />
                </svg>
            );
        case 'cloud-sun':
            return (
                <svg className="weather-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="#FF9900" />
                    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 15.25" fill="rgba(255, 255, 255, 0.2)" />
                    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 15.25" stroke="#FFFFFF" />
                </svg>
            );
        case 'cloud':
            return (
                <svg className="weather-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" />
                </svg>
            );
        case 'rain-light':
            return (
                <svg className="weather-svg rain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#FFFFFF" />
                    <line x1="8" y1="21" x2="7" y2="23" stroke="#70a1ff" />
                    <line x1="12" y1="22" x2="11" y2="24" stroke="#70a1ff" />
                    <line x1="16" y1="21" x2="15" y2="23" stroke="#70a1ff" />
                </svg>
            );
        case 'rain':
            return (
                <svg className="weather-svg rain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#FFFFFF" />
                    <line x1="8" y1="20" x2="6" y2="23" stroke="#70a1ff" strokeWidth="2.5" />
                    <line x1="12" y1="20" x2="10" y2="23" stroke="#70a1ff" strokeWidth="2.5" />
                    <line x1="16" y1="20" x2="14" y2="23" stroke="#70a1ff" strokeWidth="2.5" />
                </svg>
            );
        case 'rain-heavy':
            return (
                <svg className="weather-svg rain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#FFFFFF" />
                    <line x1="6" y1="20" x2="4" y2="23" stroke="#54a0ff" strokeWidth="3" />
                    <line x1="10" y1="20" x2="8" y2="23" stroke="#54a0ff" strokeWidth="3" />
                    <line x1="14" y1="20" x2="12" y2="23" stroke="#54a0ff" strokeWidth="3" />
                    <line x1="18" y1="20" x2="16" y2="23" stroke="#54a0ff" strokeWidth="3" />
                </svg>
            );
        case 'snow':
            return (
                <svg className="weather-svg snow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#FFFFFF" />
                    <circle cx="8" cy="22" r="1" fill="#FFFFFF" stroke="none" />
                    <circle cx="12" cy="23" r="1.2" fill="#FFFFFF" stroke="none" />
                    <circle cx="16" cy="22" r="1" fill="#FFFFFF" stroke="none" />
                </svg>
            );
        case 'snow-heavy':
            return (
                <svg className="weather-svg snow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#FFFFFF" />
                    <line x1="8" y1="21" x2="8.01" y2="21" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                    <line x1="12" y1="23" x2="12.01" y2="23" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="16" y1="21" x2="16.01" y2="21" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                    <line x1="10" y1="24" x2="10.01" y2="24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="14" y1="24" x2="14.01" y2="24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );
        case 'rain-snow':
            return (
                <svg className="weather-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#FFFFFF" />
                    <line x1="8" y1="21" x2="7" y2="23" stroke="#70a1ff" />
                    <circle cx="12" cy="22" r="1" fill="#FFFFFF" stroke="none" />
                    <line x1="16" y1="21" x2="15" y2="23" stroke="#70a1ff" />
                </svg>
            );
        case 'thunderstorm':
            return (
                <svg className="weather-svg lightning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58" stroke="#FFFFFF" />
                    <polyline points="13 11 9 17 12 17 11 23 16 15 13 15 14 11" fill="#FFEB3B" stroke="#FFA000" />
                </svg>
            );
        case 'mist':
            return (
                <svg className="weather-svg mist-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="10" x2="20" y2="10" stroke="#FFFFFF" />
                    <line x1="6" y1="14" x2="18" y2="14" stroke="#FFFFFF" />
                    <line x1="8" y1="18" x2="16" y2="18" stroke="#FFFFFF" />
                    <line x1="5" y1="6" x2="19" y2="6" stroke="#FFFFFF" />
                </svg>
            );
        default:
            return (
                <svg className="weather-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#FFFFFF" />
                </svg>
            );
    }
};

const WeatherWidget = () => {
    // Coordinate states (defaults to Paris)
    const [coords, setCoords] = useState({ lat: 48.8566, lon: 2.3522 });
    const [cityName, setCityName] = useState('Paris, Île-de-France, France');
    
    // Weather details
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Geocoding city search states
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const dropdownRef = useRef(null);

    // Fetch local weather on mount using navigator geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setCoords({ lat, lon });
                    
                    // Try to get location name using free reverse geocoding API or generic label
                    try {
                        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
                        const address = response.data.address;
                        const city = address.city || address.town || address.village || address.suburb || 'Ma position';
                        const country = address.country || '';
                        setCityName(`${city}${country ? `, ${country}` : ''}`);
                    } catch (e) {
                        setCityName('Votre Position');
                    }
                },
                (err) => {
                    console.log('Permission de géolocalisation refusée ou indisponible. Utilisation de la ville par défaut (Paris).');
                }
            );
        }
    }, []);

    // Fetch weather data when coordinates change
    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
            const response = await axios.get(url);
            setWeather(response.data.current);
        } catch (err) {
            setError('Échec de la récupération de la météo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [coords]);

    // Handle outside clicks to close search suggestions dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search city handler with geocoding api
    const handleSearchChange = async (e) => {
        const val = e.target.value;
        setSearch(val);
        
        if (val.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        setSearchLoading(true);
        try {
            const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(val)}&count=5&language=fr&format=json`;
            const response = await axios.get(geocodeUrl);
            setSuggestions(response.data.results || []);
            setShowDropdown(true);
        } catch (err) {
            console.error('Erreur géocodage:', err);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSelectSuggestion = (city) => {
        const fullLocation = [
            city.name,
            city.admin1 || '',
            city.country || ''
        ].filter(Boolean).join(', ');
        
        setCityName(fullLocation);
        setCoords({ lat: city.latitude, lon: city.longitude });
        setSearch('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    // Map weather code details
    const weatherDetails = weather ? (WEATHER_CODES[weather.weather_code] || DEFAULT_WEATHER) : DEFAULT_WEATHER;

    return (
        <section className="weather-widget-card" style={{ background: weatherDetails.bg }}>
            {/* Search Container */}
            <div className="weather-search-container" ref={dropdownRef}>
                <div className="weather-input-wrapper">
                    <input
                        type="text"
                        placeholder="Rechercher une ville..."
                        value={search}
                        onChange={handleSearchChange}
                        onFocus={() => search.trim().length >= 2 && setShowDropdown(true)}
                    />
                    {searchLoading && <span className="weather-search-spinner" />}
                </div>

                {showDropdown && suggestions.length > 0 && (
                    <ul className="weather-dropdown">
                        {suggestions.map((city) => (
                            <li key={city.id} onClick={() => handleSelectSuggestion(city)}>
                                <span className="city-name">{city.name}</span>
                                <span className="city-region">
                                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {loading ? (
                <div className="weather-loading-box">
                    <div className="weather-spinner"></div>
                    <p>Chargement de la météo...</p>
                </div>
            ) : error ? (
                <div className="weather-error-box">
                    <p>{error}</p>
                    <button onClick={fetchWeather} className="weather-retry-btn">Réessayer</button>
                </div>
            ) : weather ? (
                <div className="weather-info-box">
                    <header className="weather-info-header">
                        <div className="weather-city-info">
                            <span className="location-pin">📍</span>
                            <span className="weather-city-title" title={cityName}>
                                {cityName.split(',')[0]}
                            </span>
                            <div className="weather-country-subtitle">
                                {cityName.split(',').slice(1).join(',')}
                            </div>
                        </div>
                        <button onClick={fetchWeather} className="weather-refresh-btn" title="Actualiser">
                            🔄
                        </button>
                    </header>

                    <div className="weather-main-row">
                        <div className="weather-icon-wrapper">
                            <WeatherIcon name={weatherDetails.icon} />
                        </div>
                        <div className="weather-temp-block">
                            <div className="weather-temp">{Math.round(weather.temperature_2m)}°C</div>
                            <div className="weather-condition">{weatherDetails.label}</div>
                        </div>
                    </div>

                    <footer className="weather-details-grid">
                        <div className="weather-detail-item">
                            <span className="detail-label">Ressenti</span>
                            <span className="detail-value">{Math.round(weather.apparent_temperature)}°C</span>
                        </div>
                        <div className="weather-detail-item">
                            <span className="detail-label">Humidité</span>
                            <span className="detail-value">{weather.relative_humidity_2m}%</span>
                        </div>
                        <div className="weather-detail-item">
                            <span className="detail-label">Vent</span>
                            <span className="detail-value">{Math.round(weather.wind_speed_10m)} km/h</span>
                        </div>
                        <div className="weather-detail-item">
                            <span className="detail-label">Précip.</span>
                            <span className="detail-value">{weather.precipitation} mm</span>
                        </div>
                    </footer>
                </div>
            ) : null}
        </section>
    );
};

export default WeatherWidget;
