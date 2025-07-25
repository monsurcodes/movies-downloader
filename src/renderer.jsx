import { createRoot } from 'react-dom/client';
import Home from './components/Home';
import './index.css'
import { useState, useEffect } from "react";

const App = () => {
    const [braveAvailable, setBraveAvailable] = useState(null);

    useEffect(() => {
        window.api.isBraveInstalled().then(setBraveAvailable);
    }, []);

    // Optional: While checking, you can show a loader or nothing.
    if (braveAvailable === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-800 text-white">
                <div className="text-lg">Checking for Brave browser...</div>
            </div>
        );
    }

    if (!braveAvailable) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 text-white">
                <h1 className="text-2xl font-bold mb-4">Brave Browser Not Found</h1>
                <p className="mb-4">This application requires the Brave browser for movie/series crawling.</p>
                <a
                    href="https://brave.com/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 rounded bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold shadow hover:scale-105 transition-transform duration-200"
                >
                    Download Brave
                </a>
            </div>
        );
    }

    // Only show Home if Brave is available
    return (
        <div className='bg-slate-800 text-white min-h-screen'>
            <Home />
        </div>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
