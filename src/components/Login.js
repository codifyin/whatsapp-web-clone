import React, { useState } from "react";
import { checkCredentials } from '../api';

const Login = ({ onLogin }) => {
    const [idInstance, setIdInstance] = useState("");
    const [apiTokenInstance, setApiTokenInstance] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await checkCredentials(idInstance, apiTokenInstance);
        if (isValid) {
            onLogin(idInstance, apiTokenInstance);
        } else {
            setError("Неверные учетные данные");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Вход в WhatsApp</h2>
                <input
                    type="text"
                    placeholder="IdInstance"
                    value={idInstance}
                    onChange={(e) => setIdInstance(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="ApiTokenInstance"
                    value={apiTokenInstance}
                    onChange={(e) => setApiTokenInstance(e.target.value)}
                />
                {error && <div className="error">{error}</div>}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;
