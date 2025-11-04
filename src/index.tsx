import ReactDOM from "react-dom/client";
import {App} from "./components/app/App.tsx";
import React from "react";
import {HelmetProvider} from "react-helmet-async";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </React.StrictMode>
);