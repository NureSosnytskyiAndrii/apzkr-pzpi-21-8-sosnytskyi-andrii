import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";

const UserInfo = () => {
    const { t } = useTranslation();
    const { navigate } = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/user_info`, config);
                setUserInfo(response.data);
            } catch (err) {
                setError(t('user_info.error'));
            }
        };

        fetchUserInfo();
    }, [t]);

    const handleDeleteAccount = async () => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            await axios.delete(`http://127.0.0.1:8000/api/delete_account/${userInfo.user_id}`, config);
            setDeleteSuccess(true);
            setUserInfo(null);  // Clear user info after deletion
            sessionStorage.clear();
            navigate('/');
        } catch (err) {
            setError(t('user_info.delete_error'));
        }
    };

    if (deleteSuccess) {
        return <div>{t('user_info.delete_success')}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>{t('user_info.loading')}</div>;
    }

    return (
        <div className="container">
            <h2 className="text-primary">{t('user_info.title')}</h2>
            <p>{t('user_info.name')}: {userInfo.name}</p>
            <p>{t('user_info.email')}: {userInfo.email}</p>
            {userInfo.employee && (
                <>
                    <h3 className="text-primary">{t('user_info.employee_details')}</h3>
                    <p>{t('user_info.position')}: {userInfo.employee.position}</p>
                    <p>{t('user_info.gender')}: {userInfo.employee.gender}</p>
                    <p>{t('user_info.organization_id')}: {userInfo.employee.organization_id}</p>
                </>
            )}
            {userInfo.organization && (
                <>
                    <h3 className="text-primary">{t('user_info.organization_details')}</h3>
                    <p>{t('user_info.organization_name')}: {userInfo.organization.organization_name}</p>
                    <p>{t('user_info.organization_activity')}: {userInfo.organization.organization_activity}</p>
                    <p>{t('user_info.address')}: {userInfo.organization.address}</p>
                </>
            )}
            <button onClick={handleDeleteAccount} className="btn btn-danger mt-3">
                {t('user_info.delete_account')}
            </button>
        </div>
    );
};

export default UserInfo;
