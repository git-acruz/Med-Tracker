import React, { useState } from 'react';
import '../components/loginform.css';
import API_BASE from '../api';

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formType, setformType] = useState('login');
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState('');
    
    const handleApiCall = (endpoint, body) => {
        fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setError(data.error); // Display error from server
            } else {
                onLoginSuccess(data); // on success, call the function from App.js
            }
        })
        .catch(() => setError('An error ocurred. Please try again.'));
    };

    // login handler
    const handleLogIn = (e) => {
        e.preventDefault();
        if(!username || !password) {
            setError('Username and password are required.');
            return;
        }
        handleApiCall('login', { username, password });
    }

    // sign up handler
    const handleSignUp = (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password || !confirm) {
            setError('Username, password and confirm password are required.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match. Please try agian');
            return;
        }
        handleApiCall('signup', { username, password });
    }

    // This function now handles switching the form and clearing the state.
    const switchFormType = (type) => {
        setformType(type);
        setUsername('');
        setPassword('');
        setConfirm('');
        setError(''); // Also clear any previous errors
    };

    return (
        <div className='login-form'>
            <form onSubmit={formType === 'login' ? handleLogIn : handleSignUp}>
                <h2>{formType === 'login' ? 'Login' : 'Create Account'}</h2>

                <div className='input-container'>
                    <input
                        type='text'
                        id='username-input'
                        minLength={'4'}
                        placeholder='Enter Username(4 characters or more)'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type='password'
                        id='password-input'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {formType === 'signup' &&  (<input
                        type='password'
                        id='confirmpass-input'
                        placeholder='Retype Password'
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        />
                    )}
                    
                </div>
                <div>
                    {error && <p className='error-message'>{error}</p>}
                </div>
                <div className='btn-container'>
                    {/* This button's text and function changes */}
                    {formType === 'login' ? (
                        <button 
                            type='submit'
                            id='login-btn'
                            onClick={handleLogIn} // redundant to form element
                            >Login
                        </button>
                    ) : (
                        <button
                            type='button'
                            id='login-btn'
                            onClick={() => switchFormType('login')}
                            >Go Back
                        </button>
                    )}
                    {formType === 'login' ? (
                        <button
                            type='button'
                            id='create-btn'
                            onClick={() => switchFormType('signup')}
                            >Create Account
                        </button>
                    ) : (
                        <button
                            type='submit'
                            id='create-btn'
                            onClick={handleSignUp} // redundant to form element
                            >Create Account
                        </button>
                    )}
                    
                    
                </div>

                <div className='fgt-pass-container'>
                    <p>Forgot Password</p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;