import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import "../navbar/styles/admin.css"
import { Alert } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const OfficialsList = () => {
    const { t } = useTranslation();
    const [officials, setOfficials] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchOfficials = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/employees', config);
                setOfficials(response.data.employees);
                console.log(response.data.employees)
            } catch (error) {
                setError(error.message);
            }
        };

        fetchOfficials();
    }, []);

    const handleDelete = async (id) => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            await axios.delete(`http://127.0.0.1:8000/api/admin/employees/${id}`, config);
            setSuccessMessage(t('admin.officialDeletedSuccess'));
            setOfficials(officials.filter(official => official.employee_id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="infoTable">
            <h1 align="center">{t('admin.officials')}</h1>
            {error && <p>Error: {error}</p>}
            {officials.length === 0 && <Alert variant="primary">{t('admin.noData')}</Alert>}
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>{t('admin.officialPosition')}</th>
                    <th>{t('admin.gender')}</th>
                    <th>{t('admin.userId')}</th>
                    <th>{t('admin.organization')}</th>
                    <th>{t('admin.more')}</th>
                    <th>{t('admin.editOfficial')}</th>
                    <th>{t('admin.deleteOfficial')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(officials) && officials.map(official => (
                    <tr key={official.employee_id}>
                        <td>{official.employee_id}</td>
                        <td>{official.position}</td>
                        <td>{official.gender}</td>
                        <td>{official.user_id}</td>
                        <td>{official.organization_id}</td>
                        <td>
                            <div>
                                <Link to={`/admin/officials/current_location_list/${official.employee_id}`} className="btn btn-info btn-sm mb-2">{t('admin.seeLocations')}</Link>
                            </div>
                            <div>
                                <Link to={`/admin/officials/physical_state/${official.employee_id}`} className="btn btn-info btn-sm">{t('admin.seePhysicalState')}</Link>
                            </div>
                        </td>
                        <td>
                            <Link to={`/admin/officials/edit/${official.employee_id}`} className="btn btn-outline-primary btn-sm">{t('admin.editOfficial')}</Link>
                        </td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(official.employee_id)}>{t('admin.deleteOfficial')}</button></td>
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

export default OfficialsList;

