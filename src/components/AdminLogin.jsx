import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'password') {
            onLogin();
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#222831',
            }}
        >
            <div
                style={{
                    backgroundColor: '#393E46',
                    padding: '3rem',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                    maxWidth: '32rem',
                    width: '100%',
                }}
            >
                <h2
                    style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#FFD369',
                        marginBottom: '2rem',
                        textAlign: 'center',
                    }}
                >
                    Admin Login
                </h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #FFD369',
                        backgroundColor: '#222831',
                        color: '#EEEEEE',
                        fontSize: '1.25rem',
                        outline: 'none',
                        boxShadow: '0 0 0 2px transparent',
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #FFD369')}
                    onBlur={(e) => (e.target.style.boxShadow = '0 0 0 2px transparent')}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #FFD369',
                        backgroundColor: '#222831',
                        color: '#EEEEEE',
                        fontSize: '1.25rem',
                        outline: 'none',
                        boxShadow: '0 0 0 2px transparent',
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #FFD369')}
                    onBlur={(e) => (e.target.style.boxShadow = '0 0 0 2px transparent')}
                />

                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#FFD369',
                        color: '#222831',
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#FFD369')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#FFD369')}
                    onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #FFD369')}
                    onBlur={(e) => (e.target.style.boxShadow = '0 0 0 2px transparent')}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;