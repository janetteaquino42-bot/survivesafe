import "../css/app.css";
import "./bootstrap";
import "../css/custom.css";
import "leaflet/dist/leaflet.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import SplashScreen from "@/Components/SplashScreen/SplashScreen";
import { ToastProvider } from "@/Contexts/ToastContext";
import ToastContainer from "@/Components/Toast/ToastContainer";

const appName = import.meta.env.VITE_APP_NAME || "iMedia";



createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        function AppWithSplash(props) {
            const [showSplash, setShowSplash] = useState(true);

            useEffect(() => {
                const timer = setTimeout(() => setShowSplash(false), 1200);
                return () => clearTimeout(timer);
            }, []);

            if (showSplash) return <SplashScreen />;

            return (
                <ToastProvider>
                    <App {...props} />
                    <ToastContainer />
                </ToastProvider>
            );
        }

        root.render(<AppWithSplash {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
