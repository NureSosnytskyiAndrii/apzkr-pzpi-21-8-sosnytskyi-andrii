import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../styles/admin.css';

const Admin = () => {

    const { t } = useTranslation();

    return (
        <div className="blockStyle">
            <h1>{t('admin.panelTitle')}</h1>
            <p>{t('admin.welcomeMessage')}</p>
            <ul className="list-group ulStyle">
                <li className="list-group-item">
                    <Link to="/admin/user_list">{t('admin.viewAllUsers')}</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/admin/organizations">{t('admin.viewAllOrganizations')}</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/admin/officials">{t('admin.viewAllOfficials')}</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/admin/states">{t('admin.viewStates')}</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/admin/organizations/create">{t('admin.addNewOrganization')}</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/admin/officials/create">{t('admin.addNewOfficial')}</Link>
                </li>
            </ul>
            <Link type="button" className="btn btn-outline-primary mt-2" to="/">{t('admin.goBackToHome')}</Link>
        </div>
    );
}

export default Admin;

