import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Login = ({ setUser }) => {
    const { t } = useTranslation();

    // State hooks to manage form fields and error message
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a POST request to the login endpoint with form data
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
                email,
                password,
            });

            // Destructure the response data to get access_token and user
            const { access_token, user } = response.data;

            // Store the token and user data in sessionStorage
            sessionStorage.setItem('token', access_token);
            sessionStorage.setItem('user', JSON.stringify(user));

            // Clear form fields and error state
            setEmail('');
            setPassword('');
            setError(null);
            setUser(user);
            navigate('/');

        } catch (error) {
            if (error.response.status === 401) {
                setError(t('error.invalidCredentials'));
            } else {
                setError(t('error.generalError'));
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>{t('login.pageTitle')}</h2>
                    {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>{t('login.emailLabel')}</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>{t('login.passwordLabel')}</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <div className="mt-3">
                            <p>{t('login.notRegistered')} <Link to="/register">{t('login.registerLink')}</Link></p>
                        </div>
                        <Button variant="primary" type="submit">{t('login.buttonText')}</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
