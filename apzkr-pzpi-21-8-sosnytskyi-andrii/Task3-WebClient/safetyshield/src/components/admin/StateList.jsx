import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../navbar/styles/states.css'

const UserConditions = () => {
    const { t } = useTranslation();
    const [conditionInfo, setConditionInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.get('http://127.0.0.1:8000/api/admin/current_conditions', config)
            .then(response => {
                setConditionInfo(response.data.current_conditions);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Normal':
                return 'table-success';
            case 'Heart rate is low':
            case 'High blood pressure':
            case 'High temperature':
                return 'table-danger';
            default:
                return '';
        }
    };

    if (loading) return <p>{t('admin.loading')}</p>;
    if (error) return <p>{t('admin.error')}</p>;

    return (
        <div>
            <h2>{t('admin.viewStates')}</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>{t('condition_id')}</th>
                    <th>{t('status')}</th>
                    <th>{t('notes')}</th>
                    <th>{t('organization_id')}</th>
                    <th>{t('employee_id')}</th>
                    <th>{t('location_id')}</th>
                    <th>{t('view_more')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(conditionInfo) && conditionInfo.map(condition => (
                    <tr key={condition.condition_id} className={getStatusClass(condition.status)}>
                        <td>{condition.condition_id}</td>
                        <td>{condition.status}</td>
                        <td>{condition.notes}</td>
                        <td>{condition.organization_id}</td>
                        <td>{condition.employee_id}</td>
                        <td>{condition.location_id}</td>
                        <td>
                            <Link to={`/admin/states/details/${condition.employee_id}/${condition.organization_id}/${condition.location_id}`}>
                                {t('admin.details')}
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserConditions;
