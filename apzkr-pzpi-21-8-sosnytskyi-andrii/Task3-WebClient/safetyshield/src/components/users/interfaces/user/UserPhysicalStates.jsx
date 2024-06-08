import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const UserPhysicalState = ({ user }) => {
    const { t } = useTranslation();
    const [healthReadings, setHealthReadings] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHealthReadings = async () => {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/get_health_reading', config);
                setHealthReadings(response.data.health_data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchHealthReadings();
    }, []);

    const handleDelete = async (id) => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            await axios.delete(`http://127.0.0.1:8000/api/delete_health_reading/${id}`, config);
            setHealthReadings(healthReadings.filter(reading => reading.health_reading_id !== id));
            setSuccessMessage(t('user_info.recordDeletedSuccess'));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <h1 className="my-4"><span className="text-primary">{user.name + ' ' + user.surname + `'s` + ' '}</span>{t('user_info.healthReadings')}</h1>
            {error && <p>{t('user_info.error')}: {error}</p>}
            {successMessage && <Alert variant="warning">{successMessage}</Alert>}
            {healthReadings.length === 0 && <Alert variant="primary">{t('user_info.noData')}</Alert>}
            <table className="table table-bordered mb-4">
                <thead>
                <tr>
                    <th>{t('user_info.id')}</th>
                    <th>{t('user_info.sensorType')}</th>
                    <th>{t('user_info.timestamp')}</th>
                    <th>{t('user_info.heartRate')}</th>
                    <th>{t('user_info.temperature')}</th>
                    <th>{t('user_info.bloodPressure')}</th>
                    <th>{t('user_info.actions')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(healthReadings) && healthReadings.map(reading => (
                    <tr key={reading.health_reading_id}>
                        <td>{reading.health_reading_id}</td>
                        <td>{reading.sensor_type}</td>
                        <td>{reading.timestamp}</td>
                        <td>{reading.heart_rate}</td>
                        <td>{reading.temperature}</td>
                        <td>{reading.blood_pressure}</td>
                        <td>
                            <Link
                                to={`/user/physical_states/details`}
                                className="btn btn-info btn-sm">
                                {t('user_info.viewDetails')}
                            </Link>
                            <button
                                className="btn btn-danger btn-sm m-2"
                                onClick={() => handleDelete(reading.health_reading_id)}>
                                {t('user_info.delete')}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserPhysicalState;
