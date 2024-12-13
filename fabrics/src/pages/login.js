import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'manufacturer', // Default to manufacturer
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUserTypeChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            userType: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
    
        // Form validation
        if (!formData.email || !formData.password) {
            setErrorMessage('Both email and password are required!');
            setLoading(false);
            return;
        }
    
        try {
            const url = `http://localhost:3999/${formData.userType}/login`;
            const response = await axios.post(
                url,
                {
                    email: formData.email,
                    password: formData.password,
                },
                {
                    withCredentials: true, // Send cookies to backend
                }
            );
    
            if (response.status === 200) {
                alert(`${formData.userType} login successful!`);
                // Add redirection logic if needed
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(
                error.response?.data || 'An error occurred during login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <h2>{formData.userType === 'supplier' ? 'Supplier Login' : formData.userType === 'admin' ? 'Admin Login' : 'Manufacturer Login'}</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group user-type-group">
                    <label>Login as:</label>
                    <label>
                        <input
                            type="radio"
                            name="userType"
                            value="admin"
                            checked={formData.userType === 'admin'}
                            onChange={handleUserTypeChange}
                        />
                        Admin
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="userType"
                            value="manufacturer"
                            checked={formData.userType === 'manufacturer'}
                            onChange={handleUserTypeChange}
                        />
                        Manufacturer
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="userType"
                            value="supplier"
                            checked={formData.userType === 'supplier'}
                            onChange={handleUserTypeChange}
                        />
                        Supplier
                    </label>
                </div>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
