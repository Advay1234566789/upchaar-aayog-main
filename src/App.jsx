import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useRef, useEffect } from "react";
import Hero from "./assets/hero-bg.png";
import Doctor from "./assets/doctor.webp";
import Medicine from "./components/Medicine.jsx";
import JanAushadhiFinder from "./components/JanAushadhiFinder";

function App() {
    const medicineInputRef = useRef(null);
    
    useEffect(() => {
        const loadGoogleMaps = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        };
        loadGoogleMaps();
        
        return () => {
            const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
            if (script) {
                script.remove();
            }
        };
    }, []);
    
    const handleSearchMedicine = () => {
        if (medicineInputRef.current) {
            medicineInputRef.current.focus();
        }
    };

    const HomePage = () => (
        <section className="home-page-container">
            <div className="hero-image-container">
                <img src={Hero} alt="Hero Image"/>
            </div>
            <div className="hero-info-container">
                <div className="info-container">
                    <h1>Generic&nbsp;Name</h1>
                    <p className="home-info">
                        Find Your Remedy, Anytime, Anywhere: <br/> 
                        Your Gateway to Generic Medicine Search!
                    </p>
                    <button onClick={handleSearchMedicine}>Search Medicine</button>
                </div>
                <div className="doctor-image-container">
                    <img src={Doctor} alt="Doctor"/>
                </div>
            </div>
            <h1 className="hero-title">Search Medicine</h1>
            <Medicine inputRef={medicineInputRef}/>
            
            <div className="janaushadhi-location-container">
                <h1>Find nearby Jan Aushadhi Kendra</h1>
                <button 
                    className="janaushadhi-location-button"
                    onClick={() => window.location.href = '/find-kendra'}>
                    Search Jan Aushadhi Kendra
                </button>
            </div>
            
            <div className="about-container">
                <h1>What is Upchaar Aayog ?</h1>
                <p>
                    Upchaar-Aayog follows a holistic approach of addressing
                    affordability, prescription knowledge, and accessibility. We aim
                    to bridge the gap in healthcare access for economically
                    disadvantaged individuals, ensuring no one is deprived of essential
                    medications due to financial constraints or lack of information.
                </p>
            </div>
        </section>
    );

    return (
        <Routes>
            <Route path="/*" element={<HomePage />} />
            <Route path="/find-kendra" element={<JanAushadhiFinder />} />
        </Routes>
    );
}

export default App;
