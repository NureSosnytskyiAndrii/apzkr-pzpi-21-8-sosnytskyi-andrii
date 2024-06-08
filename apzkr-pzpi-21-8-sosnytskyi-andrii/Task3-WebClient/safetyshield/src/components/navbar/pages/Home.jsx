import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import '../styles/home.css';

const Home = ({ user }) => {
    const { t } = useTranslation();

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-description">
                    <h1>{t('home.welcome')}</h1>
                    <h2>{t('home.title')}</h2>
                    <p>{t('home.description')}</p>
                    <h2>{t('home.keyFeatures')}</h2>
                    <ul>
                        <li>{t('home.features.manage')}</li>
                        <li>{t('home.features.tracking')}</li>
                        <li>{t('home.features.monitoring')}</li>
                        <li>{t('home.features.alerts')}</li>
                        <li>{t('home.features.interface')}</li>
                    </ul>
                </div>
                <div className="home-image">
                    <img src="/preview.png" alt="Project Illustration" />
                </div>
                {user && (
                    <div className="links-container">
                        <div className="geolocation-link">
                            <Link to={`/user/locations`} className="btn">
                                <i className="fas fa-map-marker-alt"></i> {t('home.viewLocations')}
                            </Link>
                        </div>
                        <div className="state-link">
                            <Link to={`/user/physical_states`} className="btn">
                                <i className="fas fa-heartbeat"></i> {t('home.viewPhysicalState')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;

