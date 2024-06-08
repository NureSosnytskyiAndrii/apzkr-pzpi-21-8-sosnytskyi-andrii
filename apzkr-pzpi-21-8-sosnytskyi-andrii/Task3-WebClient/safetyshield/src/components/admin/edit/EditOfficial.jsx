import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EditOfficial = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        position: '',
        gender: '',
        user_id: '',
        organization_id: ''
    });
    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchOfficial = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/admin/employees/${id}`, config);
                setFormData(response.data.employee);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/user/', config);
                const filteredUsers = response.data.users.filter(user => user.role !== 'admin');
                setUsers(filteredUsers);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/organizations', config);
                setOrganizations(response.data.organizations);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchOfficial();
        fetchUsers();
        fetchOrganizations();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            await axios.put(`http://127.0.0.1:8000/api/admin/employee/${id}`, formData, config);

            setSuccessMessage(t('admin.officialUpdatedSuccess'));
            setTimeout(() => {
                setSuccessMessage(null);
                navigate('/admin/officials');
            }, 3000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="infoTable">
            <h1 align="center">{t('admin.editOfficial')}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="position">{t('admin.officialPosition')}:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gender">{t('admin.gender')}:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="user_id">{t('admin.user')}:</label>
                    <select
                        className="form-control"
                        id="user_id"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                    >
                        <option value="">{t('admin.selectUser')}</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} {user.surname}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="organization_id">{t('admin.organization')}:</label>
                    <select
                        className="form-control"
                        id="organization_id"
                        name="organization_id"
                        value={formData.organization_id}
                        onChange={handleChange}
                    >
                        <option value="">{t('admin.selectOrganization')}</option>
                        {organizations.map(organization => (
                            <option key={organization.organization_id} value={organization.organization_id}>
                                {organization.organization_name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary mt-2">{t('admin.updateOfficial')}</button>
            </form>
            <div className="mt-2">
                <Link type="button" className="btn btn-outline-primary" to="/admin/officials">{t('admin.goBack')}</Link>
            </div>
        </div>
    );
};

export default EditOfficial;

