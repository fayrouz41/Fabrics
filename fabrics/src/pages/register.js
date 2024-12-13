import React, { useState } from 'react';
import axios from 'axios';
import '../styles/register.css';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact_info: '',
        userType: 'manufacturer', // Default to manufacturer
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
        setSuccessMessage('');

        // Form Validation
        if (!formData.name || !formData.email || !formData.password || !formData.contact_info) {
            setErrorMessage('All fields are required!');
            setLoading(false);
            return;
        }

        try {
            const url = `http://localhost:3999/${formData.userType}/register`;
            const response = await axios.post(url, formData);

            if (response.status === 201) {
                setSuccessMessage('Registration successful!');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    contact_info: '',
                    userType: 'manufacturer', // Reset to manufacturer by default
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);  // Log the error details
            setErrorMessage(error.response?.data || 'An error occurred. Please try again.');
                
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <h2>{formData.userType === 'supplier' ? 'Supplier Registration' : 'Manufacturer Registration'}</h2>
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

                <div className="form-group user-type-group">
                    <label>Register as:</label>
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
                {successMessage && <div className="success-message">{successMessage}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationPage;
