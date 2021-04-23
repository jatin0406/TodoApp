import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import urls from '../config.js';

function Login({ type, setIsAuthenticated }) {

    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleAuth() {
        try {
            if(type === 'signin') {
                const {data} = await axios.post(urls.signin, {
                    username,
                    password
                });
                setIsAuthenticated(true);
                toast.success(data.message);
                window.localStorage.setItem('token', JSON.stringify(data.token));
                history.push('/');
            } else {
                const {data} = await axios.post(urls.signup, {
                    username,
                    password
                });
                toast.success(data.message);
                setUsername("");
                setPassword("");
                history.push('/signin');
            }
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }
    return (
        <div className="login" >
            <div className="title">
                {
                    type === 'signin' ? 'Sign In' : 'Sign Up'
                }
            </div>
            <div className="data">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button onClick={() => handleAuth()}>
                    {
                        type === 'signin' ? 'Sign In' : 'Sign Up'
                    }
                </button>
            </div>
        </div>
    )
}

export default Login;
