import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CreateOrganization = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState({
        organization_name: '',
        organization_activity: '',
        address: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrganization(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/admin/organization', organization, config);
            navigate('/admin/organizations');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <h1>{t('admin.addOrganization')}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t('admin.organizationName')}</label>
                    <input
                        type="text"
                        className="form-control"
                        name="organization_name"
                        value={organization.organization_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>{t('admin.activity')}</label>
                    <input
                        type="text"
                        className="form-control"
                        name="organization_activity"
                        value={organization.organization_activity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>{t('admin.address')}</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={organization.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">{t('admin.addOrganization')}</button>
            </form>
            <button className="btn btn-outline-primary mt-2" onClick={() => navigate(-1)}>{t('admin.cancel')}</button>
        </div>
    );
};

export default CreateOrganization;
