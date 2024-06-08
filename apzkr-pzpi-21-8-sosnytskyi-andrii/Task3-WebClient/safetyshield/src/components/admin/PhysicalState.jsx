import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import "../navbar/styles/admin.css";
import { useTranslation } from 'react-i18next';

const PhysicalStateList = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [physicalStates, setPhysicalStates] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchPhysicalStates = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/admin/official_health_readings/${id}`, config);
                setPhysicalStates(response.data.health_readings);
                console.log(response.data.health_readings)
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPhysicalStates();
    }, [id]);

    return (
        <div className="infoTable">
            <h1 align="center">{t('admin.physicalStates')}</h1>
            {error && <p>{t('admin.error')}: {error}</p>}
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>{t('admin.sensorType')}</th>
                    <th>{t('admin.timestamp')}</th>
                    <th>{t('admin.heartRate')}</th>
                    <th>{t('admin.temperature')}</th>
                    <th>{t('admin.bloodPressure')}</th>
                    <th>{t('admin.employeeId')}</th>
                    <th>{t('admin.viewDetails')}</th>
                    <th>{t('admin.deleteOfficial')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(physicalStates) && physicalStates.map(physicalState => (
                    <tr key={physicalState.health_reading_id}>
                        <td>{physicalState.health_reading_id}</td>
                        <td>{physicalState.sensor_type}</td>
                        <td>{physicalState.timestamp}</td>
                        <td>{physicalState.heart_rate}</td>
                        <td>{physicalState.temperature}</td>
                        <td>{physicalState.blood_pressure}</td>
                        <td>{physicalState.employee_id}</td>
                        <td>
                            <Link to={`/admin/officials/physical_state/sensor_data/${physicalState.health_reading_id}`} className="btn btn-info btn-sm mb-2">{t('admin.viewDetails')}</Link>
                        </td>
                        <td><button className="btn btn-danger btn-sm">{t('admin.deletePhysicalState')}</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-2">
                <Link type="button" className="btn btn-outline-primary" to="/admin/officials">{t('admin.goBack')}</Link>
            </div>
        </div>
    );
};

export default PhysicalStateList;
