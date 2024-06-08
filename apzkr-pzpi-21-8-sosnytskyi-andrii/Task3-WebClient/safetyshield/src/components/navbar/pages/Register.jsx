import React, { useState } from 'react';
import axios from 'axios';
import {Alert} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const Register = () => {
    // useTranslation hook for handling translations
    const { t } = useTranslation();

    // State hooks to manage form fields and response messages
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to the registration endpoint with form data
            const response = await axios.post('http://127.0.0.1:8000/api/auth/register', {
                name,
                surname,
                email,
                password,
                confirm_password: confirmPassword
            });
            setSuccessMessage(t('register.successMessage'));
            setName('');
            setSurname('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');

        } catch (error) {
            setError(t('register.errorMessage', { message: error.response.data.message }));
            setSuccessMessage('');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            <p>{error}</p>
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                            <p>{successMessage}</p>
                        </Alert>
                    )}
                    <h2 className="mb-4">{t('register.pageTitle')}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">{t('register.labels.name')}</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="surname" className="form-label">{t('register.labels.surname')}</label>
                            <input
                                type="text"
                                id="surname"
                                className="form-control"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">{t('register.labels.email')}</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">{t('register.labels.password')}</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">{t('register.labels.confirmPassword')}</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">{t('register.buttons.register')}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
