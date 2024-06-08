import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

const CurrentLocationList = () => {
    // Destructure the id parameter from the URL using useParams hook
    const { id } = useParams();
    // useTranslation hook for handling translations
    const { t } = useTranslation();

    // State hooks to manage the list of locations and any error message
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);

    // useEffect hook to fetch location data when the component mounts or id changes
    useEffect(() => {
        // Get the token from sessionStorage for authorization
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // Function to fetch location data from the API
        const fetchLocations = async () => {
            try {
                // Make a GET request to fetch the user's locations
                const response = await axios.get(`http://127.0.0.1:8000/api/admin/user_locations/${id}`, config);
                // Set the fetched locations to the state
                setLocations(response.data.locations);
                console.log(response.data);
            } catch (error) {
                // Set the error message if the request fails
                setError(error.message);
            }
        };

        // Call the fetchLocations function
        fetchLocations();
    }, [id]);

    return (
        <div className="container">
            <h1 align="center">{t('admin.currentLocations')}</h1>
            {/* Display error message if there is an error */}
            {error && <p>{t('admin.error')}: {error}</p>}
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>{t('admin.latitude')}</th>
                    <th>{t('admin.longitude')}</th>
                    <th>{t('admin.timestamp')}</th>
                    <th>{t('admin.notes')}</th>
                    <th>{t('admin.viewDetails')}</th>
                </tr>
                </thead>
                <tbody>
                {/* Check if locations is an array and map through it to display each location */}
                {Array.isArray(locations) && locations.map(location => (
                    <tr key={location.location_id}>
                        <td>{location.location_id}</td>
                        <td>{location.latitude}</td>
                        <td>{location.longitude}</td>
                        <td>{location.timestamp}</td>
                        <td>{location.notes}</td>
                        <td>
                            <Link
                                to={`/admin/map/map_view/${location.latitude}/${location.longitude}`}
                                className="btn btn-info btn-sm">
                                {t('admin.seeOnMap')}
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Button to go back to the previous page */}
            <div className="mt-2 mb-2">
                <Link type="button" className="btn btn-outline-primary" to="/admin/officials">{t('admin.goBack')}</Link>
            </div>
        </div>
    );
};

export default CurrentLocationList;
