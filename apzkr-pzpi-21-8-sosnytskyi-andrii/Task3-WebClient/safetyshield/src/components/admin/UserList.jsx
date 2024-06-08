import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../navbar/styles/admin.css";

const UserList = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/user/', config);
                setUsers(response.data.users);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        const token = sessionStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}/`, config);
            setUsers(users.filter(user => user.id !== userId));
            setAlert({ message: t('alert.userDeleted'), type: 'danger' });
        } catch (error) {
            setAlert({ message: t('alert.deleteError'), type: 'danger' });
        }
    };

    return (
        <div className="infoTable">
            <h1 align="center">{t('userList.title')}</h1>
            {alert.message && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}
            {error && <p>{t('error.message', { error })}</p>}
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>{t('userTable.headers.id')}</th>
                    <th>{t('userTable.headers.name')}</th>
                    <th>{t('userTable.headers.surname')}</th>
                    <th>{t('userTable.headers.email')}</th>
                    <th>{t('userTable.headers.role')}</th>
                    <th>{t('userTable.headers.delete')}</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(users) && users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.surname}</td>
                        <td>{user.email}</td>
                        <td>{user.role === "admin" ? <span className="text-success">{t('roles.admin')}</span>
                            : <span className="text-primary">{t('roles.user')}</span>}</td>
                        <td>{user.role !== "admin" ? <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.id)}>{t('button.delete')}</button> : ' '}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-2">
                <Link type="button" className="btn btn-outline-primary" to="/admin">{t('button.goBack')}</Link>
            </div>
        </div>
    );
};

export default UserList;

