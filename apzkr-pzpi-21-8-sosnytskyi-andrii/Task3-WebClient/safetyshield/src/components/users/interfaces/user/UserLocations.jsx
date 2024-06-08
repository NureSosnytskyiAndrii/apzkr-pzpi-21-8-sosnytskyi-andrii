import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const UserLocations = ({ user }) => {
    const { t } = useTranslation();
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user_location', config);
                setLocations(response.data.locationInfo.locations);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchLocations();
    }, []);

    return (
        <div className="container">
            <h1 className="my-4"><span className="text-primary">{user.name + ' ' + user.surname + `'s` + ' '}</span>{t('user_info.locations')}</h1>
            {error && <p>{t('admin.error')}: {error}</p>}
            {locations.length === 0 && <Alert variant="primary">{t('admin.noData')}</Alert>}
            <table className="table table-striped mb-4">
                <thead>
                <tr>
                    <th>{t('user_info.id')}</th>
                    <th>{t('user_info.latitude')}</th>
                    <th>{t('user_info.longitude')}</th>
                    <th>{t('user_info.notes')}</th>
                    <th>{t('user_info.timestamp')}</th>
                    <th>{t('admin.actions')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(locations) && locations.map(location => (
                    <tr key={location.location_id}>
                        <td>{location.location_id}</td>
                        <td>{location.latitude}</td>
                        <td>{location.longitude}</td>
                        <td>{location.notes}</td>
                        <td>{location.timestamp}</td>
                        <td>
                            <Link
                                to={`/user/map/map_view/${location.latitude}/${location.longitude}`}
                                className="btn btn-info btn-sm">
                                {t('user_info.seeOnMap')}
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserLocations;


