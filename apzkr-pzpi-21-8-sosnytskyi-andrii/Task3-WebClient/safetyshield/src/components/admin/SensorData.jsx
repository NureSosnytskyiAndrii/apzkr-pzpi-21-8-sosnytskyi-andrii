import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import "../navbar/styles/admin.css";
import { useTranslation } from 'react-i18next';

const SensorDataList = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [sensorData, setSensorData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchSensorData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/admin/sensor_data/${id}`, config);
                setSensorData(response.data.sensor_data);
                console.log(response.data)
            } catch (error) {
                setError(error.message);
            }
        };

        fetchSensorData();
    }, [id]);

    return (
        <div className="infoTable" style={{height: "150vh"}}>
            <h1 align="center">{t('admin.sensorData')}</h1>
            {error && <p>{t('admin.error')}: {error}</p>}
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>{t('admin.type')}</th>
                    <th>{t('admin.value')}</th>
                    <th>{t('admin.created')}</th>
                    <th>{t('admin.physicalStateId')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(sensorData) && sensorData.map(sensor => (
                    <tr key={sensor.reading_id}>
                        <td>{sensor.reading_id}</td>
                        <td>{sensor.type}</td>
                        <td>{sensor.value}</td>
                        <td>{sensor.created}</td>
                        <td>{sensor.health_reading_id}</td>
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

export default SensorDataList;
