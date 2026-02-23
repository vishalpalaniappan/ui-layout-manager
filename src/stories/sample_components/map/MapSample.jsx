import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapSample = () => {
    const mapRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map(containerRef.current).setView([43.65, -79.38], 12);

            L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            ).addTo(mapRef.current);

            // Force correct sizing after layout stabilizes
            setTimeout(() => {
                mapRef.current.invalidateSize();
            }, 0);
        }

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    return <div ref={containerRef} style={{ position:"relative", height: "100%", width: "100%" }} />;
};

export default MapSample;