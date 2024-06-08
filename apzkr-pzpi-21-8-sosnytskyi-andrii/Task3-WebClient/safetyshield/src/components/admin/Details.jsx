import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Details = () => {
    const { t } = useTranslation();
    const [employeeInfo, setEmployeeInfo] = useState({});
    const [organizationInfo, setOrganizationInfo] = useState({});
    const [locationInfo, setLocationInfo] = useState([]);
    const { employeeId, organizationId, locationId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchData = async () => {
            try {
                const employeeResponse = await axios.get(`http://127.0.0.1:8000/api/admin/employees/${employeeId}`, config);
                setEmployeeInfo(employeeResponse.data.employee);

                const organizationResponse = await axios.get(`http://127.0.0.1:8000/api/admin/organizations/${organizationId}`, config);
                setOrganizationInfo(organizationResponse.data.organization);

                const locationResponse = await axios.get(`http://127.0.0.1:8000/api/admin/current_locations/${locationId}`, config);
                setLocationInfo(locationResponse.data.current_locations);

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [employeeId, organizationId, locationId]);

    if (loading) return <p>{t('loading')}</p>;
    if (error) return <p>{t('error')}</p>;

    return (
        <div style={{height: "100vh"}}>
            <h2>{t('details_header')}</h2>
            <h3 className="mt-3 text-primary">{t('employee_info')}</h3>
            <p><strong>{t('employee_name')}:</strong> {employeeInfo.name}</p>
            <p><strong>{t('employee_position')}:</strong> {employeeInfo.position}</p>
            <p><strong>{t('employee_gender')}:</strong> {employeeInfo.gender}</p>

            <h3 className="text-primary">{t('organization_info')}</h3>
            <p><strong>{t('organization_name')}:</strong> {organizationInfo.organization_name}</p>
            <p><strong>{t('organization_activity')}:</strong> {organizationInfo.organization_activity}</p>
            <p><strong>{t('organization_address')}:</strong> {organizationInfo.address}</p>

            <h3 className="text-primary">{t('admin.current_locations')}</h3>
            {locationInfo.length > 0 ? (
                <ul>
                    <li><strong>{t('admin.location_id')}:</strong> {locationInfo[0].location_id}</li>
                    <li><strong>{t('admin.latitude')}:</strong> {locationInfo[0].latitude}</li>
                    <li><strong>{t('admin.longitude')}:</strong> {locationInfo[0].longitude}</li>
                    <li><strong>{t('admin.notes')}:</strong> {locationInfo[0].notes}</li>
                    <li><strong>{t('admin.timestamp')}:</strong> {locationInfo[0].timestamp}</li>
                </ul>
            ) : (
                <p>{t('no_locations')}</p>
            )}
            <div className="mt-2">
                <Link type="button" className="btn btn-outline-primary" to="/admin/states">{t('admin.goBack')}</Link>
            </div>
        </div>
    );
};

export default Details;

