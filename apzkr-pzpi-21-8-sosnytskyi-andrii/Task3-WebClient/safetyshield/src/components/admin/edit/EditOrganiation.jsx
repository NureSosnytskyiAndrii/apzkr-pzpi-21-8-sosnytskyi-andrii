import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EditOrganization = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState({
        organization_name: '',
        organization_activity: '',
        address: ''
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchOrganization = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/admin/organizations/${id}`, config);
                setOrganization(response.data.organization);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchOrganization();
    }, [id]);

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
            await axios.put(`http://127.0.0.1:8000/api/admin/organization/${id}`, organization, config);
            navigate('/admin/organizations');
        } catch (error) {
            setError(error.message);
        }
    };

    if (isLoading) {
        return <div>{t('admin.loading')}</div>;
    }

    if (error) {
        return <div>{t('admin.error')}: {error}</div>;
    }

    return (
        <div className="container">
            <h1>{t('admin.editOrganization')}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t('admin.organizationName')}</label>
                    <input
                        type="text"
                        className="form-control"
                        name="organization_name"
                        value={organization.organization_name || ''}
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
                        value={organization.organization_activity || ''}
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
                        value={organization.address || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">{t('admin.save')}</button>
            </form>
            <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>{t('admin.cancel')}</button>
        </div>
    );
};

export default EditOrganization;


