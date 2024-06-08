import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PhysicalStateDetails = () => {
    const { health_reading_id } = useParams();
    const { t } = useTranslation();
    const [reading, setReading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReadingDetails = async () => {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/get_sensor_data`, config);
                console.log(response.data);
                setReading(response.data.sensor_data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchReadingDetails();
    }, [health_reading_id]);

    if (error) {
        return <Alert variant="danger">{t('admin.error')}: {error}</Alert>;
    }

    if (!reading) {
        return <p>{t('admin.loading')}</p>;
    }

    return (
        <div className="container" style={{height: "150vh"}}>
            <h1 align="center">{t('admin.sensorData')}</h1>
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>{t('admin.id')}</th>
                    <th>{t('admin.sensorType')}</th>
                    <th>{t('admin.value')}</th>
                    <th>{t('admin.created')}</th>
                    <th>{t('admin.physicalStateId')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(reading) && reading.map(Sensor => (
                    <tr key={Sensor.reading_id}>
                        <td>{Sensor.reading_id}</td>
                        <td>{Sensor.type}</td>
                        <td>{Sensor.value}</td>
                        <td>{Sensor.created}</td>
                        <td>{Sensor.health_reading_id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-2">
                <Link type="button" className="btn btn-outline-primary" to="/user/physical_states">{t('admin.goBack')}</Link>
            </div>
        </div>
    );
};

export default PhysicalStateDetails;
