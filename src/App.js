import React, { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {
    const [credentials, setCredentials] = useState(null);

    const handleLogin = (idInstance, apiTokenInstance) => {
        setCredentials({ idInstance, apiTokenInstance });
    };

    return (
        <div className="app">
            {!credentials ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Chat 
                    idInstance={credentials.idInstance}
                    apiTokenInstance={credentials.apiTokenInstance}
                />
            )}
        </div>
    );
}

export default App;
