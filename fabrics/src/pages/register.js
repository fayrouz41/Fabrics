import React, { useState } from 'react';
import axios from 'axios';

const RegistrationPage = ({ userType }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact_info: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        // Form Validation
        if (!formData.name || !formData.email || !formData.password || !formData.contact_info) {
            setErrorMessage('All fields are required!');
            setLoading(false);
            return;
        }

        try {
            const url = `http://localhost:3999/${userType}/register`;
            const response = await axios.post(url, formData);

            if (response.status === 201) {
                setSuccessMessage('Registration successful!');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    contact_info: '',
                });
            }
        } catch (error) {
            setErrorMessage(error.response?.data || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <h2>{userType === 'supplier' ? 'Supplier Registration' : 'Manufacturer Registration'}</h2>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label htmlFor="contact_info">Contact Information</label>
                    <input
                        type="text"
                        id="contact_info"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleChange}
                        required
                    />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationPage;
