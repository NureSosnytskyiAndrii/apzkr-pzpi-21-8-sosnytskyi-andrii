import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../navbar/styles/admin.css";
import {Alert} from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const OrganizationList = () => {
    const { t } = useTranslation();
    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/organizations', config);
                setOrganizations(response.data.organizations);
                console.log(response.data.organizations);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchOrganizations();
    }, []);

    const handleEdit = (organizationId) => {
        navigate(`/admin/organizations/edit/${organizationId}`);
    };

    const handleDelete = async (id) => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            await axios.delete(`http://127.0.0.1:8000/api/admin/organizations/${id}`, config);
            setOrganizations(organizations.filter(org => org.organization_id !== id));
            setSuccessMessage(t('admin.successMessage'));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="infoTable">
            <h1 align="center">{t('admin.organizations')}</h1>
            {error && <p>Error: {error}</p>}
            {successMessage && <div className="alert alert-danger">{successMessage}</div>}
            {organizations.length === 0 && <Alert variant="primary">{t('admin.noData')}</Alert>}
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>{t('admin.organizationName')}</th>
                    <th>{t('admin.activity')}</th>
                    <th>{t('admin.address')}</th>
                    <th>{t('admin.editOrganization')}</th>
                    <th>{t('admin.deleteOrganization')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(organizations) && organizations.map(organization => (
                    <tr key={organization.organization_id}>
                        <td>{organization.organization_id}</td>
                        <td>{organization.organization_name}</td>
                        <td>{organization.organization_activity}</td>
                        <td>{organization.address}</td>
                        <td><button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(organization.organization_id)}>{t('admin.editOrganization')}</button></td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(organization.organization_id)}>{t('admin.deleteOrganization')}</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-2">
                <Link type="button" className="btn btn-outline-primary" to="/admin">{t('admin.goBack')}</Link>
            </div>
        </div>
    );
};

export default OrganizationList;

