import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logout from './pages/Logout';
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import Cookies from 'js-cookie';
import './styles/navbar.css';
import './styles/dropdown.css';
import {Dropdown} from "react-bootstrap";
import 'flag-icons/css/flag-icons.min.css';
import i18n from "i18next";

const Navigation = ({user, setUser}) => {

    const {t} = useTranslation();

    const languages = [
        {
            code: 'en',
            name: 'English',
            country_code: 'gb'
        },
        {
            code: 'ua',
            name: 'Ukrainian',
            country_code: 'ua'
        }
    ]

    const currentLanguageCode = Cookies.get('i18next') || 'en';

    const GlobeIcon = ({width = 24, height = 24}) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor"
             className="bi bi-globe"
             viewBox="0 0 16 16">
            <path
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472M3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
        </svg>
    )

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem('user')));

    }, [setUser]);

    return (
        <nav className="navbar">
            <Link to="/">
                <div className="logo-container">
                    <img src="/7017671.webp" alt="Logo" className="logo" />
                    <span className="logo-text">SafetyShield</span>
                </div>
            </Link>
            <ul className="ml-auto">
                <li><Link to="/">{t("navbar.home")}</Link></li>
                {user && (
                    <>
                        {user.role === "admin" && <li className="ml-auto"><Link to="/admin">{t("navbar.admin_panel")}</Link></li>}
                        <li className="ml-auto"><Link to="/user/user-info">{t("navbar.user_info")}</Link></li>
                        <li className="ml-auto"><Logout setUser={setUser} /></li>
                        <li className="ml-auto user-info">{user.name} {user.surname}</li>
                    </>
                )}
                {!user && (
                    <>
                        <li className="ml-auto"><Link to="/login">{t("navbar.login")}</Link></li>
                        <li className="ml-auto"><Link to="/register">{t("navbar.register")}</Link></li>
                    </>
                )}
                <li className="nav-item ml-auto">
                <Dropdown>
                    <Dropdown.Toggle variant="custom-dropdown-toggle" id="dropdown-basic">
                        <GlobeIcon/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item><span className="dropdown-item-text">{t('navbar.language')}</span></Dropdown.Item>
                        {languages.map(({code, name, country_code}) => (
                            <Dropdown.Item onClick={() => i18next.changeLanguage(code)}
                                           disabled={code === currentLanguageCode}>
                                     <span className={`fi fi-${country_code} mx-2`}
                                           style={{ opacity: code === currentLanguageCode ? 0.5 : 1 }}></span>
                                {name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;

