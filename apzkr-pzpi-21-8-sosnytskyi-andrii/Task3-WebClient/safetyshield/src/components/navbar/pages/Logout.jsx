import React from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

const Logout = ({setUser}) => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {

            const token = sessionStorage.getItem('token');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, config);

            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');

            setUser(null);
            navigate('/login');
            console.log(response.data);

        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout <img src="/logout.webp" alt="logout" style={{height: "30px", width: "30px"}}/></button>
    );
};

export default Logout;

